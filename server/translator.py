from flask import Flask, request, jsonify
from easynmt import EasyNMT
from flask_cors import CORS
import nltk

# Download required NLTK resources
nltk.download('punkt_tab')
app = Flask(__name__)
CORS(app)  # Allow CORS if calling from a Node.js frontend/backend

model = EasyNMT('opus-mt')  # or 'm2m_100_418M', 'mbart50_m2m'

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    text = data.get('text')
    source = data.get('sourceLanguage')
    target = data.get('targetLanguage')

    if not text or not source or not target:
        return jsonify({'error': 'Missing parameters'}), 400

    try:
        translated = model.translate(text, source_lang=source, target_lang=target)
        return jsonify({'translatedText': translated})
    except Exception as e:
        return jsonify({'error': 'Translation failed', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)  # Change port if needed