import os
import time
import json
from flask import Flask, request, render_template_string, session, redirect, url_for
from dotenv import load_dotenv
from flask_cors import CORS
import google.generativeai as genai

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

if not GEMINI_API_KEY:
    raise ValueError("Google Gemini API Key not found. Please set GEMINI_API_KEY in the .env file.")

# Configure Google Gemini API
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

# Load multiple JSON files and combine
def load_json_files(file_paths):
    combined_data = []
    for path in file_paths:
        try:
            with open(path, 'r') as f:
                data = json.load(f)
                if isinstance(data, list):
                    combined_data.extend(data)
                elif isinstance(data, dict):
                    combined_data.append(data)
        except Exception as e:
            print(f"❌ Error loading {path}: {e}")
    return combined_data

# List your files here
json_files = [
    "filtered_neighbourhoods_resource_0.json",
    "filtered_neighbourhoods_resource_1.json",
    "neighbourhoods_sustainability.json",
    "income_data.json",
    "sustainability_data.json",
    "Neighbourhoods - 4326.json",
    "rent_increase.json",

    # Add more if needed
]

neighbourhoods_data = load_json_files(json_files)

# Flask app setup
app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'supersecretkey')
CORS(app)

# HTML UI
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Toronto Carbon Risk Analyzer</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-800">
<div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-4">Toronto Carbon Emissions Risk Analyzer</h1>

    {% if not cookie_accepted %}
    <div class="p-4 bg-yellow-100 text-gray-900 rounded mb-4">
        <p>This site uses cookies. Do you accept?</p>
        <form method="POST" action="{{ url_for('accept_cookies') }}">
            <button type="submit" name="choice" value="accept" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Accept</button>
            <button type="submit" name="choice" value="deny" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2">Deny</button>
        </form>
    </div>
    {% endif %}

    <form method="POST" class="mb-4">
        <label class="block mb-2 font-semibold">Analyze carbon emissions trend:</label>
        <textarea name="user_input" class="w-full p-2 border border-gray-300 rounded mb-2" rows="4" placeholder="Ask anything or just hit send to get analysis..."></textarea>
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
    </form>

    {% if response %}
    <div class="p-4 bg-white rounded shadow">
        <h2 class="text-xl font-bold mb-2">Gemini’s Analysis:</h2>
        <pre class="whitespace-pre-wrap">{{ response }}</pre>
    </div>
    {% endif %}
</div>
</body>
</html>
'''

@app.route('/', methods=['GET', 'POST'])
def chat_page():
    cookie_accepted = session.get('cookie_accepted', None)
    response = None

    if request.method == 'POST':
        user_input = request.form.get('user_input', '')

        # Construct prompt  
        prompt = f"""
You are a world-class AI sustainability analyst. You are analyzing **multi-year data** on Toronto neighbourhoods, pulled from multiple sources, to determine **carbon emissions risk trends**. Each entry contains:

- `neighbourhood`: Name of the area
- `sustainability_score`: Overall sustainability score (avg. of indicators)
- `green_score`: Reflects green space availability
- `affordability_score`: Indicates housing pressure
- `permit_score`: Indicates development intensity

👉 Your goal: Detect how the **carbon emissions risk** is changing in each neighbourhood across time.

For each neighbourhood:
1. Track the **trend in sustainability_score** over time — is it **rising**, **dropping**, or **flat**?
2. Use changes in green_score, affordability_score, and permit_score to **justify** the trend:
   - ↑ permit_score, ↓ affordability or ↓ green_score → likely **rising emissions**
   - ↑ green_score or affordability → likely **lowering emissions**
3. Based on the most recent score:
   - 🔴 Red = 0–69 → **High emissions risk**
   - 🟡 Yellow = 70–79 → **Moderate risk**
   - 🟢 Green = 80–100 → **Low risk**

⚠️ Ignore formatting errors, and just generate clear, structured summaries like this:

---
Neighbourhood: [Name]  
Sustainability Score: [Most recent score]   
Color Label: [🔴 Red / 🟡 Yellow / 🟢 Green]  
Breakdown:
- Green Score: [Latest green_score]  
- Affordability Score: [Latest affordability_score]  
- Permit Score: [Latest permit_score]  
Reasoning: [Why the trend points to ↑ / ↓ / steady carbon emissions risk]  
---

Here is the input data (up to 10 entries):
{json.dumps(neighbourhoods_data[:10], indent=2)}
"""


        try:
            start_time = time.time()
            gemini_response = model.generate_content(prompt)
            elapsed_time = time.time() - start_time
            response = gemini_response.text if elapsed_time <= 30 else "Response took too long. Try again!"
        except Exception as e:
            response = f"Error generating content: {str(e)}"

    return render_template_string(HTML_TEMPLATE, response=response, cookie_accepted=cookie_accepted)

@app.route('/accept_cookies', methods=['POST'])
def accept_cookies():
    choice = request.form.get('choice')
    session['cookie_accepted'] = choice == 'accept'
    return redirect(url_for('chat_page'))

# Run Flask app
if __name__ == "__main__":
    # For local development, run without SSL if cert files are missing
    app.run(host='127.0.0.1', port=5000)




