import requests
import json
import os
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai import GenerativeModel

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY")) 

base_url = "http://localhost:5000"

def fetch_data():
    affordable = (requests.get(f"{base_url}/api/affordable-units").json())[:1]
    permits = (requests.get(f"{base_url}/api/building-permits").json())[:1]
    green = (requests.get(f"{base_url}/api/green-spaces").json())[:1]
    neighbourhoods = (requests.get(f"{base_url}/api/neighbourhoods").json())[:1]


    return {
        "affordable_units": affordable,
        "building_permits": permits,
        "green_spaces": green,
        "neighbourhoods": neighbourhoods
    }

def format_prompt_for_gemini(data):
    prompt = """
You are an urban planning AI tasked with evaluating sustainability in Toronto neighbourhoods. The output must be a json file, nothing else.
Your end goal is by using the sustainability score, we can determine the risk of gentrification on that area relative to sustainability.

You are given raw data from multiple sources:

1. Affordable housing projects (`affordable_units`)
2. Active building permits (`building_permits`)
3. Green space data (`green_spaces`)
4. Neighbourhood polygons or metadata (`neighbourhoods`)

Each dataset includes many columns. Your job is to:
- Select only the attributes relevant to sustainability and anti-gentrification
- Normalize each relevant factor across neighbourhoods
- Assign weights to each factor using your knowledge of urban planning best practices and academic literature
- Compute a sustainability score per neighbourhood (0-100)
- Return results like:
  ```json
  [
    {
      "neighbourhood": "Parkdale",
      "score": 74.3,
      "details": {
        "affordable_units_score": 0.8,
        "green_space_score": 0.6,
        "building_permits_score": 0.2
      }
    },
    ...

    Some neighbourhoods may have missing or incomplete data in one or more categories (e.g. no affordable units, no green space, or no building permits). When this occurs:
    - Do not fail
    - Either impute a default value based on trends from similar neighbourhoods
    - Or assign a lower weight to the missing variable
    - Clearly return a `score` regardless, and optionally include a `confidence` rating

    Return a list like:
        [
            {
                "neighbourhood": "Parkdale",
                "score": 74.3,
                "confidence": "High",
                "details": {
                "affordable_units_score": 0.8,
                "green_space_score": 0.6,
                "building_permits_score": 0.2
                }
            },
            {
                "neighbourhood": "NoName",
                "score": 58.1,
                "confidence": "Low",
                "details": {
                "affordable_units_score": null,
                "green_space_score": 0.7,
                "building_permits_score": 0.2
                }
            }
        ]
    ]
"""
    sample_data = {
        "affordable_units": data["affordable_units"][:1],
        "building_permits": data["building_permits"][:1],
        "green_spaces": data["green_spaces"][:1],
        "neighbourhoods": data["neighbourhoods"][:1]
    }

    prompt += "\nHere is a sample of the data:\n" + json.dumps(sample_data, indent=2)
    return prompt

def get_scores_from_gemini(prompt):
    model = GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)
    return response.text

def interpret_score(score):
    if score >= 80:
        return "Very Low"
    elif score >= 65:
        return "Low"
    elif score >= 50:
        return "Moderate"
    elif score >= 35:
        return "High"
    else:
        return "Very High"

def compute_sustainability_scores():
    data = fetch_data()  # Pulls all your raw data from Flask endpoints
    print(data)
    prompt = format_prompt_for_gemini(data)  # Formats it as a text prompt for Gemini
    print("response")
    ai_response = get_scores_from_gemini(prompt)  # Sends to Gemini and gets back a string response
    print(ai_response)


    try:
        scores = json.loads(ai_response)  # 👈 THIS LINE parses the Gemini string into usable JSON
    except Exception:
        scores = [{"error": "Gemini returned unstructured response"}]  # fallback if parsing fails

    for s in scores:
        if "score" in s:
            s["gentrification_risk"] = interpret_score(s["score"])  # Adds risk label

    return scores
