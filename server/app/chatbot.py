# import json
# import hashlib
# from typing import List, Dict, Any

# # Load average income from message (5).txt manually parsed or from JSON
# TORONTO_AVERAGE_INCOME_2023 = 63600

# # Placeholder neighbourhood income data (should be expanded with real values)
# income_data = {
#     "Parkdale": 42000,
#     "Danforth": 61000,
#     "Etobicoke": 72000,
#     "Downtown": 58000,
#     "Scarborough": 45000,
#     # Add more as needed
# }

# def hash_score(value: str, mod: int = 100) -> int:
#     """Simple hash function to generate pseudo-random but deterministic scores."""
#     return int(hashlib.sha256(value.encode()).hexdigest(), 16) % mod

# def calculate_sustainability_score(row: Dict[str, Any]) -> Dict[str, Any]:
#     area_name = row.get('neighbourhood', '')
#     income = income_data.get(area_name, None)

#     green_score = hash_score(area_name)
#     affordability_score = hash_score(area_name + '_afford')
#     permit_score = hash_score(area_name + '_permit')
#     completeness_score = 100 if area_name else 50

#     sustainability_score = (green_score + affordability_score + permit_score + completeness_score) / 4

#     if sustainability_score >= 70:
#         risk_level = "Low"
#     elif sustainability_score >= 40:
#         risk_level = "Medium"
#     else:
#         risk_level = "High"

#     return {
#         "neighbourhood": area_name,
#         "income": income,
#         "sustainability_score": round(sustainability_score, 2),
#         "risk_level": risk_level,
#         "breakdown": {
#             "green_score": green_score,
#             "affordability_score": affordability_score,
#             "permit_score": permit_score,
#             "completeness_score": completeness_score
#         }
#     }

# def generate_sustainability_dataset(neighbourhoods: List[str]) -> List[Dict[str, Any]]:
#     """Generates sustainability data for a list of neighbourhoods."""
#     results = []
#     for name in neighbourhoods:
#         row = {"neighbourhood": name}
#         results.append(calculate_sustainability_score(row))
#     return results

# if __name__ == "__main__":
#     # Example list of neighbourhoods (expand as needed)
#     sample_neighbourhoods = [
#     "Parkdale", "Danforth", "Etobicoke", "Downtown", "Scarborough",
#     "Roncesvalles", "The Annex", "Kensington", "Yorkville", "Liberty Village",
#     "High Park", "Regent Park", "Leslieville", "Chinatown", "St. Lawrence",
#     "Forest Hill", "Cabbagetown", "Yonge–Eglinton", "The Beaches", "North York",
#     "Little Italy", "Distillery District", "East York", "Weston", "Mimico"
# ]

#     output = generate_sustainability_dataset(sample_neighbourhoods)
#     #with open("sustainability_data.json", "w") as f:
#      #   json.dump(res, f, indent=2)
#     # Output JSON result
#     #print(json.dumps(output, indent=2))
#     import json

#     # Load the JSON file contents into the `res` variable
#     with open("sustainability_data.json", "r") as f:
#         res = json.load(f)

#     # Now res contains all your JSON records
#     print(res[0])  # Print first record to confirm
