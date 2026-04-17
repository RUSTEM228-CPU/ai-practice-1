from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# ============================================
# МЫНА ЖЕРГЕ ӨЗІҢІЗДІҢ API КІЛТІҢІЗДІ ҚОЙЫҢЫЗ
# ============================================
API_KEY = "СІЗДІҢ_GEMINI_API_КІЛТІҢІЗ"
API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

@app.route('/ask', methods=['POST'])
def ask():
    try:
        user_message = request.json.get('message')
        
        payload = {
            "contents": [{
                "parts": [{"text": user_message}]
            }]
        }
        
        response = requests.post(f"{API_URL}?key={API_KEY}", json=payload)
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": f"API қатесі: {response.status_code}"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)