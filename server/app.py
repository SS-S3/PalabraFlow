"""
PalabraFlow - Combined Node.js and Python Translation Service
This file combines both the Express server and Flask translation service
for deployment on platforms like Render.
Uses tiny models with lazy loading and memory optimization.
"""
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import gc

# Set memory-efficient environment variables
os.environ['TOKENIZERS_PARALLELISM'] = 'false'
os.environ['OMP_NUM_THREADS'] = '1'

# Resolve client build path absolutely to avoid 404s when cwd differs
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CLIENT_BUILD = os.path.normpath(os.path.join(BASE_DIR, '..', 'client', 'build'))
app = Flask(__name__, static_folder=CLIENT_BUILD, static_url_path='')

# FIXED: Configure CORS to allow your GitHub Pages domain
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://ss-s3.github.io",
            "http://localhost:3000",
            "http://localhost:5000"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    }
})

# Global cache for both tiny models (loaded on-demand)
model_cache = {
    'en-es': None,
    'es-en': None
}

def get_model(direction):
    """Lazy load specific tiny model only when needed"""
    global model_cache
    from transformers import MarianMTModel, MarianTokenizer
    
    if model_cache[direction] is None:
        print(f"Loading tiny translation model ({direction})...")
        # Use tatoeba-tiny models - much smaller!
        if direction == 'en-es':
            model_name = 'Helsinki-NLP/opus-mt-tc-big-en-es'
        else:  # es-en
            model_name = 'Helsinki-NLP/opus-mt-tc-big-es-en'
        
        # Load model without torch dtype specification
        model_cache[direction] = {
            'model': MarianMTModel.from_pretrained(model_name),
            'tokenizer': MarianTokenizer.from_pretrained(model_name)
        }
        
        # Clear memory
        gc.collect()
        print(f"Tiny model loaded: {model_name}")
    
    return model_cache[direction]

def translate_text(text, source_lang, target_lang):
    """Translate text with bidirectional support using tiny models"""
    # Determine direction
    if source_lang == 'en' and target_lang == 'es':
        direction = 'en-es'
    elif source_lang == 'es' and target_lang == 'en':
        direction = 'es-en'
    else:
        raise ValueError(f"Unsupported language pair: {source_lang} -> {target_lang}")
    
    # Load tiny model for this direction (if not already loaded)
    model_data = get_model(direction)
    model = model_data['model']
    tokenizer = model_data['tokenizer']
    
    # Tokenize and translate
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
    translated = model.generate(**inputs, max_length=512)
    result = tokenizer.decode(translated[0], skip_special_tokens=True)
    return result

# Health check endpoint
@app.route('/api/health', methods=['GET', 'OPTIONS'])
def health():
    if request.method == 'OPTIONS':
        return '', 204
    loaded = [k for k, v in model_cache.items() if v is not None]
    return jsonify({
        'status': 'OK',
        'service': 'PalabraFlow Full-Stack',
        'model': 'Helsinki-NLP/opus-mt-tc-big (tiny models)',
        'loaded_models': loaded,
        'memory_efficient': True
    })

# Translation endpoint
@app.route('/api/translate', methods=['POST', 'OPTIONS'])
def translate():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        data = request.json
        text = data.get('text')
        source = data.get('sourceLanguage', 'en')
        target = data.get('targetLanguage', 'es')

        if not text:
            return jsonify({'error': 'Missing text parameter'}), 400

        print(f"Translating: '{text}' from {source} to {target}")
        translated = translate_text(text, source, target)
        print(f"Translation result: '{translated}'")
        return jsonify({'translatedText': translated})
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Translation error: {error_trace}")
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