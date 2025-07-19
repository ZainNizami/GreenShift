import os
from flask import Flask, request, render_template_string, session, redirect, url_for, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import time
from flask_cors import CORS  # Import CORS

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# Check if the API key was successfully loaded
if not GEMINI_API_KEY:
    raise ValueError("Google Gemini API Key not found. Please ensure it's set in the .env file.")

# Configure Google Gemini API
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# Flask app setup
app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'supersecretkey')  # Secret key for sessions

# Enable CORS
CORS(app)

# HTML template
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat with Gemini</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        async function generateWorkout() {
            const input = document.getElementById('workout-input').value;
            const resultDiv = document.getElementById('workout-result');
            const errorDiv = document.getElementById('workout-error');
            const workoutText = document.getElementById('workout-text');
            const errorText = document.getElementById('error-text');

            resultDiv.classList.add('hidden');
            errorDiv.classList.add('hidden');

            if (!input) {
                errorText.textContent = "Please provide your preferences!";
                errorDiv.classList.remove('hidden');
                return;
            }

            try {
                const response = await fetch('/api/generate_workout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_input: input }),
                });

                const data = await response.json();
                if (response.ok) {
                    workoutText.textContent = data.workout_plan;
                    resultDiv.classList.remove('hidden');
                } else {
                    errorText.textContent = data.error || "An error occurred.";
                    errorDiv.classList.remove('hidden');
                }
            } catch (e) {
                errorText.textContent = e.message || "An unexpected error occurred.";
                errorDiv.classList.remove('hidden');
            }
        }
    </script>
</head>
<body class="bg-gray-100 text-gray-800">
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Chat with Google Gemini</h1>
        
        {% if not cookie_accepted %}
        <div class="p-4 bg-yellow-200 text-gray-800 mb-4">
            <p>We use cookies to enhance your experience. Do you accept?</p>
            <form method="POST" action="/accept_cookies">
                <button type="submit" name="choice" value="accept" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Accept Cookies</button>
                <button type="submit" name="choice" value="deny" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2">Deny Cookies</button>
            </form>
        </div>
        {% endif %}
        
        <form method="POST" class="mb-4">
            <textarea name="user_input" class="w-full p-2 border border-gray-300 rounded mb-2" rows="4" placeholder="Type your message here..."></textarea>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Send</button>
        </form>

        {% if response %}
        <div class="p-4 bg-white shadow rounded">
            <strong>Gemini:</strong>
            <p>{{ response }}</p>
        </div>
        {% endif %}
        
        <div class="container mx-auto p-4">
            <h1 class="text-2xl font-bold mb-4">Generate Your Personalized Gym Workout Plan</h1>
            <textarea
                id="workout-input"
                class="w-full p-2 border border-gray-300 rounded mb-2"
                rows="4"
                placeholder="Type your fitness preferences here..."
            ></textarea>
            <button
                onclick="generateWorkout()"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Generate Workout Plan
            </button>

            <div id="workout-result" class="p-4 bg-white shadow rounded hidden">
                <h2 class="text-xl font-bold">Your Personalized Workout Plan:</h2>
                <p id="workout-text"></p>
            </div>

            <div id="workout-error" class="p-4 bg-red-200 rounded hidden">
                <p id="error-text" class="text-red-600"></p>
            </div>
        </div>
    </div>
</body>
</html>
'''

@app.route('/', methods=['GET', 'POST'])
def chat_page():
    cookie_accepted = session.get('cookie_accepted', None)
    response = None

    if request.method == 'POST' and request.form.get('user_input'):
        user_input = request.form.get('user_input')

        # Generate content using user input
        try:
            start_time = time.time()
            gemini_response = model.generate_content(user_input)
            elapsed_time = time.time() - start_time
            response = gemini_response.text if elapsed_time <= 30 else "Response took too long. Please try again."
        except Exception as e:
            response = f"Error: {str(e)}"

    return render_template_string(HTML_TEMPLATE, response=response, cookie_accepted=cookie_accepted)

@app.route('/accept_cookies', methods=['POST'])
def accept_cookies():
    choice = request.form.get('choice')
    session['cookie_accepted'] = choice == 'accept'
    return redirect(url_for('chat_page'))

@app.route('/api/generate_workout', methods=['POST'])
def generate_workout():
    # Parse JSON input
    data = request.get_json()
    user_input = data.get("user_input")

    # Validate input
    if not user_input:
        return jsonify({"error": "No input provided. Please provide your fitness preferences!"}), 400
    if not isinstance(user_input, str):
        return jsonify({"error": "Invalid input type. Please provide a valid string for your fitness preferences!"}), 400
    if len(user_input.strip()) == 0:
        return jsonify({"error": "Input is empty. Please provide a meaningful fitness preference!"}), 400

    try:
        # Generate workout plan with Gemini API
        prompt = f"Create a personalized workout plan based on: {user_input.strip()}"
        workout_plan_response = model.generate_content(prompt)

        return jsonify({"workout_plan": workout_plan_response.text}), 200
    except Exception as e:
        return jsonify({"error": f"Error generating workout: {str(e)}"}), 500


# Run the Flask app with SSL for local development
if __name__ == "__main__":
    app.run(ssl_context=('cert.pem', 'key.pem'), host='127.0.0.1', port=5000)
