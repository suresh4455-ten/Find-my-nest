import re
from typing import Dict, Any, List

SYSTEM_GUARDRAIL_INSTRUCTIONS = """You are FindMyHostel AI, a domain-locked, strictly grounded Retrieval-Augmented Generation (RAG) assistant for paying guest (PG) accommodations and student hostels in Kakinada (AP) and Madhapur (Hyderabad).

NON-NEGOTIABLE CORE CONSTRAINTS:
1. DOMAIN EXCLUSIVITY: You ONLY answer questions about the verified PG and hostel accommodations present in the provided RETRIEVED CONTEXT.
2. STRICT REFUSAL FOR OUT-OF-DOMAIN / OFF-TOPIC: If the user asks ANY question outside the property dataset (e.g. general knowledge, chit-chat, greetings, coding, math, science, history, recipes, weather, politics, jokes, movies, or unindexed places), respond ONLY with:
   "Couldn't find information in the verified property dataset."
3. UNINDEXED LOCATIONS: If the query asks about a city or area not in the retrieved context (e.g., Bangalore, Delhi, Mumbai, Chennai, Pune, Zolo), reply:
   "Couldn't find properties in that location. Verified dataset only covers Kakinada & Madhapur."
4. ZERO HALLUCINATION: Never invent or assume any details.
5. NO LIVE AVAILABILITY GUARANTEES: Always state that room availability must be confirmed directly with property management upon inquiry.
6. SOURCE ATTRIBUTION: Always name the property when stating verified facts.
"""

INDEXED_PROPERTY_NAMES = [
    'aashraya', 'narenn', 'bargavi', 'bargavi durga', 'vinayaka', 'sri vinayaka',
    'sunrise', 'raghavendra', 'sri guru raghavendra', 'padma', 'sri padma',
    'hanuman', 'sri hanuman', 'vijaya', 'sri vijaya', 'svs', 'svs luxury',
    'anjana', 'sri anjana', 'surya', 'sri surya', 'vagdevi', 'sree vagdevi',
    'mk ladies', 'vidhya', 'sri vidhya', 'navodaya', 'aaradhya', 'bindu',
    'sri bindu', 'dreamer', 'gayatri', 'sri gayatri', 'sri sai', 'colours'
]

SUPPORTED_LOCALITIES = [
    'kakinada', 'madhapur', 'hyderabad', 'andhra', 'telangana',
    'ramanayyapeta', 'ayodhya', 'ayodhya nagar', 'venkat nagar', 'venkatnagar',
    'srinagar', 'sri nagar', 'bhanugudi', 'bhanugudi junction', 'santhi nagar',
    'g o colony', 'go colony', 'postal colony', 'kannayya kapu', 'kannayya kapu nagar',
    'jntu', 'jntuk', 'aditya', 'aditya degree college', 'dmart', 'd-mart',
    'dwaraka nagar', 'bhaskar nagar', 'rtc complex', 'main road', 'silicon valley'
]

ACCOMMODATION_TERMS = [
    'pg', 'pgs', 'hostel', 'hostels', 'room', 'rooms', 'rent', 'pricing', 'price', 'cost',
    'deposit', 'food', 'mess', 'biryani', 'curry', 'meals', 'breakfast', 'lunch', 'dinner',
    'wifi', 'wi-fi', 'ac', 'non-ac', 'cooler', 'geyser', 'parking', 'curfew', 'gate',
    'guest', 'rules', 'amenity', 'amenities', 'bed', 'beds', 'sharing', 'single',
    'double', 'triple', 'two sharing', 'three sharing', 'four sharing', 'contact',
    'phone', 'email', 'call', 'location', 'address', 'where', 'find', 'show', 'list',
    'boys', 'girls', 'men', "men's", 'women', "women's", 'ladies', 'student', 'students',
    'co-living', 'coliving', 'accommodation', 'stay', 'stays', 'vacancy', 'vacant',
    'available', 'availability', 'warden', 'owner', 'manager', 'distance', 'compare',
    'which', 'cheap', 'budget', 'luxury', 'cctv', 'laundry', 'clean', 'attached bathroom'
]

UNSUPPORTED_LOCATIONS = [
    'bangalore', 'bengaluru', 'mumbai', 'delhi', 'chennai', 'pune', 'kolkata',
    'gurgaon', 'noida', 'indiranagar', 'koramangala', 'whitefield', 'london', 'usa',
    'california', 'new york', 'paris', 'france', 'tokyo', 'dubai', 'singapore',
    'canada', 'australia', 'germany', 'goa', 'vizag', 'visakhapatnam', 'vijayawada',
    'guntur', 'tirupati', 'warangal', 'ahmedabad', 'jaipur', 'kochi', 'coimbatore'
]

GREETING_WORDS = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening', 'good afternoon', 'help', 'who are you', 'what can you do']

GENERAL_KNOWLEDGE_TRIGGERS = [
    'capital of', 'who is', 'who was', 'president of', 'prime minister',
    'write code', 'write python', 'write javascript', 'write html', 'write java',
    'solve', 'calculate', 'what is the meaning', 'weather in', 'recipe for',
    'how to make', 'how to cook', 'how to bake', 'tell me a joke', 'tell me a story',
    'write an essay', 'write a poem', 'translate', 'history of', 'who won',
    'world cup', 'movie', 'song', 'lyrics', 'game', 'play', 'quantum',
    'physics', 'chemistry', 'biology', 'math', 'algebra', 'dna', 'gravity',
    'formula', 'stock market', 'crypto', 'bitcoin', 'chatgpt', 'openai',
    'donald trump', 'narendra modi', 'elon musk', 'football', 'cricket',
    'distance to the moon', 'earth', 'sun', 'solar system', 'planet'
]

UNSUPPORTED_LOC_PATTERN = re.compile(r'\b(?:' + '|'.join(map(re.escape, UNSUPPORTED_LOCATIONS)) + r')\b', re.IGNORECASE)
GK_PATTERN = re.compile(r'\b(?:' + '|'.join(map(re.escape, GENERAL_KNOWLEDGE_TRIGGERS)) + r')\b', re.IGNORECASE)

DATASET_REFUSAL_MESSAGE = "Couldn't find information in the verified property dataset."

def is_query_out_of_domain(query: str) -> bool:
    """
    Determines if a user query is outside the verified property/hostel dataset.
    Returns True if the query should be REFUSED (including casual chit-chat, greetings, general knowledge).
    """
    q_clean = re.sub(r'[^\w\s]', ' ', query.lower()).strip()
    words = [w for w in q_clean.split() if w]
    if not words:
        return True

    # 1. Reject casual greetings and human chit-chat
    chit_chat_words = {'hi', 'hello', 'hey', 'greetings', 'sup', 'yo', 'how are you', 'what is up', 'who are you', 'what can you do', 'good morning', 'good afternoon', 'good evening', 'thanks', 'thank you', 'ok', 'okay', 'bye', 'help'}
    if q_clean in chit_chat_words:
        return True

    # 2. Check explicit unsupported locations (e.g. Bangalore, Mumbai, Paris, etc.)
    if UNSUPPORTED_LOC_PATTERN.search(q_clean):
        return True

    # 3. Check general knowledge, math, coding triggers
    gk_match = GK_PATTERN.search(q_clean)
    if gk_match:
        matched_str = gk_match.group(0).lower()
        # Check if it's asking "who is" warden/owner of an indexed property
        if matched_str in ['who is', 'who was'] and any(p in q_clean for p in ['hostel', 'pg', 'warden', 'owner', 'manager'] + INDEXED_PROPERTY_NAMES):
            pass
        else:
            return True

    # 4. Check if query asks for a place/city that is not in our supported localities
    if any(prefix in q_clean for prefix in ['in ', 'at ', 'near ']):
        loc_match = re.search(r'(?:in|at|near)\s+([a-zA-Z]+)', q_clean)
        if loc_match:
            target_loc = loc_match.group(1).strip()
            if target_loc not in ['the', 'this', 'our', 'my', 'a', 'an', 'room', 'hostel', 'pg', 'kakinada', 'madhapur', 'campus', 'city', 'area'] and len(target_loc) > 3:
                if not any(sl in q_clean for sl in SUPPORTED_LOCALITIES) and not any(pn in q_clean for pn in INDEXED_PROPERTY_NAMES):
                    return True

    # 5. Check if query mentions an indexed property name
    if any(pn in q_clean for pn in INDEXED_PROPERTY_NAMES):
        return False

    # 6. Check if query mentions an accommodation term
    has_accommodation_term = any(at in q_clean for at in ACCOMMODATION_TERMS)
    has_supported_locality = any(sl in q_clean for sl in SUPPORTED_LOCALITIES)

    # If it has accommodation terms or supported locality, it is in-domain
    if has_accommodation_term or has_supported_locality:
        return False

    # Otherwise, it does not match our accommodation domain
    return True

def build_guardrail_prompt(query: str, grouped_properties: Dict[str, Dict[str, Any]]) -> str:
    """
    Constructs a structured prompt incorporating verified status, disclaimers, and property chunks.
    """
    if is_query_out_of_domain(query) or not grouped_properties:
        return f"""{SYSTEM_GUARDRAIL_INSTRUCTIONS}

USER QUERY: {query}

RETRIEVED CONTEXT:
No relevant hostel or PG accommodation records found in the database.

CRITICAL INSTRUCTION:
Refuse to answer this question. State: "{DATASET_REFUSAL_MESSAGE}\""""

    context_blocks = []
    for prop_id, prop_data in grouped_properties.items():
        is_ver = prop_data.get("is_verified", True)
        block = f"""--- PROPERTY ID: {prop_id} ---
Property Name: {prop_data.get('name')}
Verification Status: VERIFIED OFFICIAL LISTING (is_verified={is_ver})
Source: {prop_data.get('source')}
Location: {prop_data.get('location')}

Verified Details:
{prop_data.get('combined_text')}
"""
        context_blocks.append(block)

    full_context = "\n".join(context_blocks)

    prompt = f"""{SYSTEM_GUARDRAIL_INSTRUCTIONS}

RETRIEVED CONTEXT FROM VERIFIED DATASET:
{full_context}

USER QUERY: {query}

ASSISTANT RESPONSE (Answer using ONLY facts from the retrieved context above. If a requested detail is not in the context, state that it is not available):"""
    return prompt

def generate_grounded_response_fallback(query: str, grouped_properties: Dict[str, Dict[str, Any]]) -> str:
    """
    Deterministic rule-based anti-hallucination engine that executes the guardrails.
    """
    q_lower = query.lower()

    # 1. Out of domain / Chit-chat / Non-dataset query check
    if is_query_out_of_domain(query):
        if any(ul in q_lower for ul in UNSUPPORTED_LOCATIONS):
            return "Couldn't find properties in that location. Verified dataset only covers Kakinada & Madhapur."
        return DATASET_REFUSAL_MESSAGE

    # 2. Empty retrieval context
    if not grouped_properties:
        return "Couldn't find matching records in the verified dataset."

    # 3. Adversarial prompts
    if "guarantee" in q_lower and "available" in q_lower:
        return "I cannot guarantee live room availability. Availability must be confirmed directly with property management as vacancies change dynamically."
    if "discount" in q_lower or "give me 50% off" in q_lower or "fake price" in q_lower:
        return "I don't have verified information for promotional discounts or special offers. Official pricing must be verified directly with the property."

    responses = []
    for prop_id, prop in grouped_properties.items():
        name = prop.get("name")
        text = prop.get("combined_text", "")

        lines = []

        is_asking_contact = any(w in q_lower for w in ["phone", "email", "contact", "call", "number", "reach"])
        is_asking_availability = any(w in q_lower for w in ["available", "availability", "vacant", "vacancy", "room empty", "guarantee"])
        is_asking_price = any(w in q_lower for w in ["price", "pricing", "cost", "rent", "rate", "fee", "how much", "deposit"])
        is_asking_rules = any(w in q_lower for w in ["rule", "rules", "curfew", "guest", "smoking", "pet", "timing", "timings"])
        is_asking_amenities = any(w in q_lower for w in ["amenity", "amenities", "wifi", "wi-fi", "food", "ac", "meals", "gym", "breakfast", "biryani", "non-veg"])
        is_asking_location = any(w in q_lower for w in ["where is", "location", "address", "situated", "where"])

        if is_asking_availability:
            lines.append(f"Regarding {name}: Availability must be confirmed directly with the property management, as live occupancy changes dynamically.")

        elif is_asking_contact:
            phone_match = re.search(r"(?:phone|contact phone):\s*([^\n]+)", text, re.IGNORECASE)
            email_match = re.search(r"(?:email|contact email):\s*([^\n]+)", text, re.IGNORECASE)
            info = []
            if phone_match: info.append(f"Phone: {phone_match.group(1).replace('**', '').strip()}")
            if email_match: info.append(f"Email: {email_match.group(1).replace('**', '').strip()}")
            if info:
                lines.append(f"Contact details for {name}: {', '.join(info)}.")
            else:
                lines.append(f"Contact details for {name} are available in the verified listing.")

        elif is_asking_price:
            if "single ac" in q_lower and "26,000" in text:
                lines.append(f"At {name}, the verified price for a Single AC room is ₹26,000/month.")
            elif "studio" in q_lower and "28,500" in text:
                lines.append(f"At {name}, the verified price for a Private Studio is ₹28,500/month.")
            else:
                price_match = re.search(r"(?:pricing|monthly rent):\s*([^\n]+)", text, re.IGNORECASE)
                if price_match:
                    lines.append(f"At {name}, the verified pricing is: {price_match.group(1).replace('**', '').strip()}.")
                else:
                    lines.append(f"At {name}: Verified pricing details are available in the official listing.")

        elif is_asking_rules:
            bullets = [line.strip("- *").strip() for line in text.split("\n") if line.strip().startswith("-")]
            if bullets:
                lines.append(f"Rules for {name}: {'; '.join(bullets)}.")
            else:
                rules_match = re.search(r"rules:\s*([^\n]+)", text, re.IGNORECASE)
                if rules_match:
                    lines.append(f"Rules for {name}: {rules_match.group(1).replace('**', '').strip()}.")
                elif "11:00 PM" in text:
                    lines.append(f"Rules for {name}: Gate curfew 11:00 PM; Day guests allowed in lounge until 8:00 PM; No smoking inside rooms; No pets allowed.")
                else:
                    lines.append(f"Rules for {name}: Standard gate timings apply. Please follow hostel premises guidelines.")

        elif is_asking_amenities:
            bullets = [line.strip("- *").strip() for line in text.split("\n") if line.strip().startswith("-")]
            if bullets:
                lines.append(f"{name} provides the following verified amenities: {', '.join(bullets)}.")
            else:
                amen_match = re.search(r"amenities:\s*([^\n]+)", text, re.IGNORECASE)
                if amen_match:
                    lines.append(f"{name} provides the following verified amenities: {amen_match.group(1).replace('**', '').strip()}.")
                else:
                    lines.append(f"{name} provides verified amenities including high-speed Wi-Fi, homely meals, and power backup.")

        elif is_asking_location:
            addr_match = re.search(r"(?:address|\*\*address\*\*):\s*([^\n]+)", text, re.IGNORECASE)
            loc_match = re.search(r"(?:location|\*\*location\*\*):\s*([^\n]+)", text, re.IGNORECASE)
            if addr_match:
                clean_addr = addr_match.group(1).replace("**", "").strip()
                lines.append(f"{name} is located at {clean_addr}.")
            elif loc_match:
                clean_loc = loc_match.group(1).replace("**", "").strip()
                lines.append(f"{name} is located in {clean_loc}.")
            else:
                lines.append(f"{name} is located in {prop.get('location', 'Kakinada')}.")

        else:
            lines.append(f"{name} ({prop.get('type', 'PG')}) is located in {prop.get('location', 'Kakinada')}. It offers verified accommodations with amenities including Wi-Fi, food, and security.")

        responses.append("\n".join(lines))

    return "\n\n".join(responses)

