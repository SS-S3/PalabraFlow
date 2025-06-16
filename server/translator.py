from flask import Flask, request, jsonify
from easynmt import EasyNMT
from flask_cors import CORS
import nltk
import os

try:
    nltk.download('punkt_tab', quiet=True)
except:
    pass

app = Flask(__name__)
CORS(app)

print("Loading EasyNMT model...")
model = EasyNMT('opus-mt')
print("Model loaded successfully!")

# ADD THIS ROOT ROUTE
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'PalabraFlow Translation Service',
        'status': 'running',
        'model': 'EasyNMT opus-mt',
        'endpoints': {
            'health': '/health',
            'translate': '/translate (POST)'
        }
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'service': 'EasyNMT Translation'})

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    text = data.get('text')

    if not text or not source or not target:
        return jsonify({'error': 'Missing parameters'}), 400

    try:
        translated = model.translate(text, source_lang="en", target_lang="es")
        return jsonify({'translatedText': translated})
    except Exception as e:
        return jsonify({'error': 'Translation failed', 'details': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
