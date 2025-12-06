"""
PalabraFlow - Combined Node.js and Python Translation Service
This file combines both the Express server and Flask translation service
for deployment on platforms like Render.
"""
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from easynmt import EasyNMT
import nltk
import os

try:
    nltk.download('punkt_tab', quiet=True)
except:
    pass

app = Flask(__name__, static_folder='../client/build', static_url_path='')
CORS(app)

print("Loading EasyNMT model...")
model = EasyNMT('opus-mt')
print("Model loaded successfully!")

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'OK',
        'service': 'PalabraFlow Full-Stack',
        'model': 'EasyNMT opus-mt'
    })

# Translation endpoint
@app.route('/api/translate', methods=['POST'])
def translate():
    data = request.json
    text = data.get('text')
    source = data.get('sourceLanguage', 'en')
    target = data.get('targetLanguage', 'es')

    if not text:
        return jsonify({'error': 'Missing text parameter'}), 400

    try:
        translated = model.translate(text, source_lang=source, target_lang=target)
        return jsonify({'translatedText': translated})
    except Exception as e:
        return jsonify({'error': 'Translation failed', 'details': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=False)
