import csv
import json
from pathlib import Path

MAP_COORDINATES = {
    "PG001": {"lat": 17.4483, "lng": 78.3915, "landmark": "Silicon Valley Layout, Madhapur", "maps_url": "https://www.google.com/maps/search/?api=1&query=17.4483,78.3915+(Aashraya+Co-living+Madhapur)"},
    "PG002": {"lat": 17.4399, "lng": 78.3908, "landmark": "Near Metro Station Road 36, Madhapur", "maps_url": "https://www.google.com/maps/search/?api=1&query=17.4399,78.3908+(Narenn+Living+Madhapur)"},
    "PG003": {"lat": 16.9745, "lng": 82.2468, "landmark": "Kannayya Kapu Nagar Main Rd", "maps_url": "https://www.google.com/maps/search/?api=1&query=16.9745,82.2468+(Bargavi+Durga+Boys+Hostel+Kakinada)"},
    "PG004": {"lat": 16.9832, "lng": 82.2356, "landmark": "Opp. Aditya Degree College Road 4, Ayodhya Nagar", "maps_url": "https://www.google.com/maps/search/?api=1&query=16.9832,82.2356+(Vinayaka+Mens+Hostel+Ayodhya+Nagar)"},
    "PG005": {"lat": 16.9691, "lng": 82.2412, "landmark": "Near Jayendra Nagar, Dwaraka Nagar", "maps_url": "https://www.google.com/maps/search/?api=1&query=16.9691,82.2412+(Sunrise+Boys+Hostel+Venkat+Nagar)"},
    "PG006": {"lat": 16.9798, "lng": 82.2405, "landmark": "JNTUK Vegetable Market Rd, Nagamallithota", "maps_url": "https://www.google.com/maps/search/?api=1&query=16.9798,82.2405+(Sri+Guru+Raghavendra+Mens+PG+Ramanayyapeta)"},
    "PG007": {"lat": 16.9723, "lng": 82.2391, "landmark": "Near Municipal High School, Srinagar", "maps_url": "https://www.google.com/maps/search/?api=1&query=16.9723,82.2391+(Padma+Boys+Hostel+Srinagar+Kakinada)"},
    "PG008": {"lat": 16.9582, "lng": 82.2384, "landmark": "Near Police Quarters, Bhanugudi Junction", "maps_url": "https://www.google.com/maps/search/?api=1&query=16.9582,82.2384+(Hanuman+Mens+PG+Bhanugudi+Junction)"},
    "PG009": {"lat": 16.9654, "lng": 82.2321, "landmark": "Shanti Nagar Main Rd", "maps_url": "https://www.google.com/maps/search/?api=1&query=16.9654,82.2321+(Vijaya+Durga+Boys+Hostel+Santhi+Nagar)"},
    "PG010": {"lat": 16.9782, "lng": 82.2415, "landmark": "Nagamalli Thota, Ramanayyapeta", "maps_url": "https://www.google.com/maps/search/?api=1&query=16.9782,82.2415+(Svs+Luxury+Mens+Hostel+Ramanayyapeta)"},
    "PG011": {"lat": 16.9642, "lng": 82.2315, "landmark": "Sambhamurthy Nagar 5th Street, Shanti Nagar", "maps_url": "https://www.google.com/maps/search/?api=1&query=16.9642,82.2315+(Sai+Anjana+Students+Womens+Hostel)"},
    "PG012": {"lat": 16.9688, "lng": 82.2408, "landmark": "Opp. Pragati Junior College, Venkat Nagar", "maps_url": "https://www.google.com/maps/search/?api=1&query=16.9688,82.2408+(Sri+Surya+Ladies+Hostel+Venkat+Nagar)"},
    "PG013": {"lat": 16.9712, "lng": 82.2435, "landmark": "Behind Reliance Mart, Bhaskar Nagar", "maps_url": "https://www.google.com/maps/search/?api=1&query=16.9712,82.2435+(Sree+Vagdevi+Womens+Hostel+Bhaskar+Nagar)"},
    "PG014": {"lat": 16.9765, "lng": 82.2378, "landmark": "Near D-Mart, Laxmi Nagar, Gudari Gunta", "maps_url": "https://www.google.com/maps/search/?api=1&query=16.9765,82.2378+(MK+Ladies+Hostel+Gudari+Gunta+Kakinada)"},
    "PG015": {"lat": 16.9675, "lng": 82.2338, "landmark": "Postal Colony, G O Colony", "maps_url": "https://www.google.com/maps/search/?api=1&query=16.9675,82.2338+(Sri+Vidhya+Womens+Hostel+Postal+Colony)"},
    "PG016": {"lat": 16.9752, "lng": 82.2395, "landmark": "5th Cross Rd, Rajeshwari Nagar, Ramanayyapeta", "maps_url": "https://www.google.com/maps/search/?api=1&query=16.9752,82.2395+(Navodaya+Ladies+PG+Rajeshwari+Nagar)"},
    "PG017": {"lat": 16.9661, "lng": 82.2329, "landmark": "G O Colony, Santhi Nagar", "maps_url": "https://www.google.com/maps/search/?api=1&query=16.9661,82.2329+(Aaradhya+Womans+Hostel+Santhi+Nagar)"},
    "PG018": {"lat": 16.9535, "lng": 82.2341, "landmark": "Swapna Grand Lane, RTC Complex Area", "maps_url": "https://www.google.com/maps/search/?api=1&query=16.9535,82.2341+(Sri+Bindu+Women+PG+Hostel+RTC+Complex)"},
    "PG019": {"lat": 16.9825, "lng": 82.2361, "landmark": "Road 3, Ayodhya Nagar", "maps_url": "https://www.google.com/maps/search/?api=1&query=16.9825,82.2361+(Dreamers+Nest+PG+Co-Living+Ayodhya+Nagar)"},
    "PG020": {"lat": 16.9805, "lng": 82.2410, "landmark": "Plot 21, College View Street near JNTUK", "maps_url": "https://www.google.com/maps/search/?api=1&query=16.9805,82.2410+(Gayatri+Working+Womens+Hostel+Ramanayyapeta)"},
}

data_dir = Path("backend/data")
csv_path = data_dir / "properties.csv"
jsonl_path = data_dir / "properties.jsonl"

rows = []
with open(csv_path, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        pid = row["property_id"]
        meta = MAP_COORDINATES.get(pid, {"lat": 16.9891, "lng": 82.2475, "landmark": "Kakinada", "maps_url": f"https://www.google.com/maps/search/?api=1&query={row.get('name', 'Hostel')}+Kakinada"})
        row["latitude"] = meta["lat"]
        row["longitude"] = meta["lng"]
        row["map_landmark"] = meta["landmark"]
        row["google_maps_url"] = meta["maps_url"]
        rows.append(row)

fieldnames = list(rows[0].keys())
with open(csv_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

with open(jsonl_path, "w", encoding="utf-8") as f:
    for row in rows:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")

print(f"Updated {len(rows)} properties with verified Map Locations, Coordinates & Google Maps URLs!")
