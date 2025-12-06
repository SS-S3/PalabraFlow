"""
PalabraFlow - Combined Node.js and Python Translation Service
This file combines both the Express server and Flask translation service
for deployment on platforms like Render.
Uses tiny models with lazy loading for minimal memory usage.
"""
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../client/build', static_url_path='')
CORS(app)

# Global variables for lazy loading
models = {}

def get_model(source_lang, target_lang):
    """Lazy load model only when needed to save memory"""
    from transformers import MarianMTModel, MarianTokenizer
    
    model_key = f"{source_lang}-{target_lang}"
    
    if model_key not in models:
        print(f"Loading model for {source_lang} -> {target_lang}...")
        model_name = f'Helsinki-NLP/opus-mt-{source_lang}-{target_lang}'
        models[model_key] = {
            'model': MarianMTModel.from_pretrained(model_name),
            'tokenizer': MarianTokenizer.from_pretrained(model_name)
        }
        print(f"Model loaded: {model_name}")
    
    return models[model_key]

def translate_text(text, source_lang, target_lang):
    """Translate text using lazy-loaded model"""
    model_data = get_model(source_lang, target_lang)
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
    loaded_models = list(models.keys()) if models else []
    return jsonify({
        'status': 'OK',
        'service': 'PalabraFlow Full-Stack',
        'model': 'Helsinki-NLP/opus-mt (lazy-loaded)',
        'loaded': loaded_models
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
