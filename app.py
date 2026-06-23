from flask import Flask, jsonify, render_template, request
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv(override=True)

# ✅ FORCE ABSOLUTE PATH (THIS IS THE REAL FIX)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static")
)

print("BASE_DIR:", BASE_DIR)
print("TEMPLATE PATH:", os.path.join(BASE_DIR, "templates"))

client = OpenAI(
    api_key=os.getenv('OPENROUTER_API_KEY'),
    base_url="https://openrouter.ai/api/v1"
)

@app.route("/")
def home():
    return render_template("chatbot.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")

    try:
        response = client.chat.completions.create(
            model="deepseek/deepseek-chat",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ]
        )
        reply = response.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        print("Error:", e)
        return jsonify({"reply": "Error occurred"})
@app.route("/voice")
def voice():
    return render_template("voice.html")

if __name__ == "__main__":
    app.run(debug=True)