import logging
from typing import Dict, List, Optional, Any

logger = logging.getLogger(__name__)

class ConversationTurn:
    def __init__(self, user_message: str, assistant_answer: str, context_entities: Dict[str, Any]):
        self.user_message = user_message
        self.assistant_answer = assistant_answer
        self.context_entities = context_entities

class SessionMemoryManager:
    def __init__(self, max_history_turns: int = 6):
        self.max_history_turns = max_history_turns
        self.sessions: Dict[str, List[ConversationTurn]] = {}

    def get_history(self, session_id: str) -> List[ConversationTurn]:
        return self.sessions.get(session_id, [])

    def add_turn(self, session_id: str, user_msg: str, assistant_ans: str, entities: Dict[str, Any]):
        if session_id not in self.sessions:
            self.sessions[session_id] = []
        self.sessions[session_id].append(ConversationTurn(user_msg, assistant_ans, entities))
        if len(self.sessions[session_id]) > self.max_history_turns:
            self.sessions[session_id].pop(0)

    def extract_slots(self, text: str) -> Dict[str, Any]:
        slots = {}
        t_lower = text.lower()

        # Location slots
        if "madhapur" in t_lower:
            slots["location"] = "Madhapur"
        elif "kakinada" in t_lower:
            slots["location"] = "Kakinada"
        elif "ayodhya nagar" in t_lower:
            slots["location"] = "Ayodhya Nagar"
        elif "venkata nagar" in t_lower or "venkat nagar" in t_lower:
            slots["location"] = "Venkat Nagar"
        elif "ramanayyapeta" in t_lower:
            slots["location"] = "Ramanayyapeta"

        # Amenity slots
        amenities = []
        if "wifi" in t_lower or "wi-fi" in t_lower or "internet" in t_lower:
            amenities.append("Wi-Fi")
        if "food" in t_lower or "meals" in t_lower or "biryani" in t_lower:
            amenities.append("Food")
        if "ac" in t_lower or "air condition" in t_lower:
            amenities.append("AC")
        if "parking" in t_lower or "bike" in t_lower:
            amenities.append("Parking")
        if "gym" in t_lower:
            amenities.append("Gym")
        if amenities:
            slots["amenities"] = amenities

        # Target properties
        known_props = [
            "Bargavi Durga Boys Hostel", "Bargavi Durga", "Vinayaka Mens Hostel", "Vinayaka",
            "Sunrise Boys Hostel", "Sunrise", "Sri Guru Raghavendra", "Sri Guru",
            "Padma Boys Hostel", "Padma", "Hanuman Mens PG", "Hanuman",
            "Vijaya Durga Boys Hostel", "Vijaya Durga", "Svs Luxury Mens Hostel", "Svs Luxury",
            "Sai Anjana Students & Working Women Hostel", "Sai Anjana",
            "Sri Surya Ladies Hostel", "Sri Surya",
            "Sree Vagdevi Students & Working Women's Hostel", "Sree Vagdevi",
            "MK Ladies Hostel", "Sri Vidhya", "Navodaya Ladies PG", "Navodaya",
            "Aaradhya Woman's Hostel", "Aaradhya", "Sri Bindu Women PG", "Sri Bindu",
            "Dreamer's Nest", "Gayatri Working Women's Hostel", "Gayatri",
            "Aashraya Co-living", "Aashraya", "Narenn Living", "Narenn"
        ]
        for p in known_props:
            if p.lower() in t_lower:
                slots["property"] = p
                break

        return slots

    def rewrite_query(self, session_id: str, new_query: str) -> str:
        """
        Rewrites a contextual follow-up query into a self-contained query using active slots.
        """
        history = self.get_history(session_id)
        if not history:
            return new_query

        q_lower = new_query.lower()
        is_followup = any(pattern in q_lower for pattern in [
            "which one", "which ones", "what about", "and for", "how about",
            "how much", "tell me more", "their", "its", "what is the price",
            "what is their", "what is the contact", "what is the phone", "what is the rent",
            "does it have", "do they have", "is it available", "where is it", "what amenities"
        ]) or (len(new_query.split()) <= 6 and not any(p in q_lower for p in ["hello", "hi", "help"]))

        if not is_followup:
            return new_query

        # Aggregate slots from past turns
        accumulated_slots = {}
        for turn in history:
            accumulated_slots.update(turn.context_entities)

        current_slots = self.extract_slots(new_query)
        accumulated_slots.update(current_slots)

        rewritten_parts = [new_query]
        if "property" in accumulated_slots and accumulated_slots["property"].lower() not in q_lower:
            rewritten_parts.append(f"for {accumulated_slots['property']}")
        if "location" in accumulated_slots and accumulated_slots["location"].lower() not in q_lower:
            rewritten_parts.append(f"in {accumulated_slots['location']}")
        if "amenities" in accumulated_slots:
            for a in accumulated_slots["amenities"]:
                if a.lower() not in q_lower:
                    rewritten_parts.append(f"with {a}")

        rewritten = " ".join(rewritten_parts)
        logger.info(f"Query rewrite for session {session_id}: '{new_query}' -> '{rewritten}'")
        return rewritten

# Global singleton session manager
session_memory = SessionMemoryManager()
