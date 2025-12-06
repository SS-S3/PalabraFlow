"""
PalabraFlow - Combined Node.js and Python Translation Service
This file combines both the Express server and Flask translation service
for deployment on platforms like Render.
Uses a single tiny model with lazy loading for minimal memory usage.
"""
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../client/build', static_url_path='')
CORS(app)

# Global variables for lazy loading - only load ONE model
model_cache = None

def get_model():
    """Lazy load model only when needed - SINGLE MODEL ONLY"""
    global model_cache
    from transformers import MarianMTModel, MarianTokenizer
    
    if model_cache is None:
        print("Loading translation model (en-es)...")
        model_name = 'Helsinki-NLP/opus-mt-en-es'
        model_cache = {
            'model': MarianMTModel.from_pretrained(model_name),
            'tokenizer': MarianTokenizer.from_pretrained(model_name)
        }
        print("Model loaded successfully!")
    
    return model_cache

def translate_text(text, source_lang, target_lang):
    """Translate text using single model (en->es only)"""
    # Only support en to es with the single model
    if source_lang != 'en' or target_lang != 'es':
        # For es->en, inform user to use en->es direction
        return f"Only English to Spanish translation is supported in free tier. Please switch languages."
    
    model_data = get_model()
    model = model_data['model']
    tokenizer = model_data['tokenizer']
    
    # Tokenize and translate
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
    translated = model.generate(**inputs, max_length=512)
    result = tokenizer.decode(translated[0], skip_special_tokens=True)
    return result

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health():
    is_loaded = model_cache is not None
    return jsonify({
        'status': 'OK',
        'service': 'PalabraFlow Full-Stack',
        'model': 'Helsinki-NLP/opus-mt-en-es (single model)',
        'loaded': is_loaded
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
        translated = translate_text(text, source, target)
        return jsonify({'translatedText': translated})
    except Exception as e:
        return jsonify({'error': 'Translation failed', 'details': str(e)}), 500

# Serve React App (must be last)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=False)
