import json
import logging
import sys
from pathlib import Path
from typing import Dict, Any, List

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.config import BASE_DIR
from backend.rag.retriever import PropertyRetriever
from backend.rag.prompt import build_guardrail_prompt, generate_grounded_response_fallback
from backend.rag.memory import SessionMemoryManager

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

def run_eval_suite() -> Dict[str, Any]:
    eval_file = BASE_DIR / "tests" / "eval_questions.json"
    if not eval_file.exists():
        raise FileNotFoundError(f"Evaluation dataset not found at {eval_file}")

    with open(eval_file, "r", encoding="utf-8") as f:
        questions: List[Dict[str, Any]] = json.load(f)

    retriever = PropertyRetriever()
    retriever.load_index()

    test_memory = SessionMemoryManager()

    results = []
    passed_count = 0
    hallucinations_detected = 0
    refusal_tests = 0
    refusal_passes = 0

    print("\n" + "=" * 90)
    print(f"{'ID':<8} | {'CATEGORY':<22} | {'TYPE':<16} | {'STATUS':<8} | {'NOTES'}")
    print("=" * 90)

    for item in questions:
        q_id = item.get("id")
        cat = item.get("category")
        q_type = item.get("type")
        q_text = item.get("question")
        session_id = item.get("session_id", f"eval-sess-{q_id}")

        # Setup turn for memory questions if provided
        if "setup_question" in item:
            setup_q = item["setup_question"]
            setup_ret = retriever.search(setup_q, top_k=4)
            setup_ans = generate_grounded_response_fallback(setup_q, setup_ret.get("grouped_properties", {}))
            slots = test_memory.extract_slots(setup_q)
            test_memory.add_turn(session_id, setup_q, setup_ans, slots)

        # Process main question
        rewritten_q = test_memory.rewrite_query(session_id, q_text)
        retrieval_res = retriever.search(rewritten_q, top_k=4)
        grouped_props = retrieval_res.get("grouped_properties", {})

        # Grounded answer generation
        ans = generate_grounded_response_fallback(rewritten_q, grouped_props)

        # Update test session memory
        slots = test_memory.extract_slots(q_text)
        test_memory.add_turn(session_id, q_text, ans, slots)

        # Verification checks
        expected = item.get("expected_substrings", [])
        must_not = item.get("must_not_contain", [])

        # Check expected substrings (at least one or all depending on test)
        if q_type in ("refusal", "out_of_scope", "adversarial"):
            has_expected = any(exp.lower() in ans.lower() for exp in expected)
        else:
            has_expected = any(exp.lower() in ans.lower() for exp in expected)

        # Check forbidden substrings (e.g. invented prices/details)
        has_forbidden = any(mn.lower() in ans.lower() for mn in must_not)

        if has_forbidden:
            hallucinations_detected += 1

        is_passed = has_expected and not has_forbidden

        if q_type == "refusal":
            refusal_tests += 1
            if is_passed:
                refusal_passes += 1

        if is_passed:
            passed_count += 1
            status = "[PASS]"
            notes = "Compliant"
        else:
            status = "[FAIL]"
            notes = f"Exp: {expected}, Got: {ans[:60]}..."

        results.append({
            "id": q_id,
            "category": cat,
            "type": q_type,
            "question": q_text,
            "answer": ans,
            "passed": is_passed,
            "hallucination": has_forbidden,
            "sources": [p.get("name") for p in grouped_props.values()]
        })

        print(f"{q_id:<8} | {cat:<22} | {q_type:<16} | {status:<8} | {notes}")

    total = len(questions)
    hallucination_rate = (hallucinations_detected / total) * 100
    pass_rate = (passed_count / total) * 100

    print("=" * 90)
    print(f"EVALUATION SUMMARY: Total: {total} | Passed: {passed_count}/{total} ({pass_rate:.1f}%) | Hallucination Rate: {hallucination_rate:.1f}%")
    print("=" * 90 + "\n")

    return {
        "total_questions": total,
        "passed": passed_count,
        "pass_rate_percent": pass_rate,
        "hallucination_rate_percent": hallucination_rate,
        "refusal_accuracy_percent": (refusal_passes / refusal_tests * 100) if refusal_tests else 100.0,
        "details": results
    }

if __name__ == "__main__":
    run_eval_suite()
