from flask import Flask, request, jsonify
from easynmt import EasyNMT
from flask_cors import CORS
import nltk
import os

# Download required NLTK resources
try:
    nltk.download('punkt_tab', quiet=True)
except:
    pass

app = Flask(__name__)
CORS(app)

# Initialize model (this might take time on first run)
print("Loading EasyNMT model...")
model = EasyNMT('opus-mt')
print("Model loaded successfully!")

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
        print(f"Translation error: {str(e)}")
        return jsonify({'error': 'Translation failed', 'details': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'service': 'EasyNMT Translation'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
