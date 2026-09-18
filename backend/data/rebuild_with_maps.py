import csv
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))
from backend.rag.ingestion import IngestionPipeline

data_dir = Path("backend/data")
csv_path = data_dir / "properties.csv"
jsonl_path = data_dir / "properties.jsonl"

documents = []
with open(csv_path, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        pid = row["property_id"]
        name = row["name"]
        loc = row["location"]
        addr = row["address"]
        price = row["pricing"]
        amen = row["amenities"]
        rules = row["rules"]
        phone = row["phone"]
        email = row["email"]
        avail = row["availability"]
        source = row["source"]
        is_ver = str(row.get("is_verified", "True")).lower() in ("true", "1", "yes")
        lat = row.get("latitude", "16.9891")
        lng = row.get("longitude", "82.2475")
        landmark = row.get("map_landmark", "")
        maps_url = row.get("google_maps_url", "")

        text = f"""Property: {name} ({pid})
Type: {row.get('type', 'PG')}
Location: {loc}, Kakinada
Address: {addr}
Map Landmark: {landmark}
Coordinates: Latitude {lat}, Longitude {lng}
Google Maps URL: {maps_url}
Pricing: {price}
Room Types: {row.get('room_types', 'Single, Double, Triple sharing')}
Amenities: {amen}
Rules: {rules}
Phone: {phone}
Email: {email}
Availability: {avail}
Source: {source} (Verified Official Listing)"""

        doc_item = {
            "id": pid,
            "text": text,
            "metadata": {
                "property_id": pid,
                "name": name,
                "location": loc,
                "address": addr,
                "latitude": float(lat),
                "longitude": float(lng),
                "map_landmark": landmark,
                "google_maps_url": maps_url,
                "source": source,
                "is_verified": is_ver
            }
        }
        documents.append(doc_item)

with open(jsonl_path, "w", encoding="utf-8") as f:
    for doc in documents:
        f.write(json.dumps(doc, ensure_ascii=False) + "\n")

print(f"Generated {len(documents)} rich documents in properties.jsonl with Map Data!")

# Rebuild vectorstore
pipeline = IngestionPipeline()
count = pipeline.run(rebuild=True)
print(f"Vectorstore successfully rebuilt with {count} chunks!")
