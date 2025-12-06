from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import MarianMTModel, MarianTokenizer
import os

app = Flask(__name__)
CORS(app)

print("Loading translation models...")
# Load lightweight models for both directions
model_en_es = MarianMTModel.from_pretrained('Helsinki-NLP/opus-mt-en-es')
tokenizer_en_es = MarianTokenizer.from_pretrained('Helsinki-NLP/opus-mt-en-es')

model_es_en = MarianMTModel.from_pretrained('Helsinki-NLP/opus-mt-es-en')
tokenizer_es_en = MarianTokenizer.from_pretrained('Helsinki-NLP/opus-mt-es-en')
print("Models loaded successfully!")

def translate_text(text, source_lang, target_lang):
    """Translate text using the appropriate model"""
    if source_lang == 'en' and target_lang == 'es':
        model = model_en_es
        tokenizer = tokenizer_en_es
    elif source_lang == 'es' and target_lang == 'en':
        model = model_es_en
        tokenizer = tokenizer_es_en
    else:
        raise ValueError(f"Unsupported language pair: {source_lang} -> {target_lang}")
    
    # Tokenize and translate
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
    translated = model.generate(**inputs)
    result = tokenizer.decode(translated[0], skip_special_tokens=True)
    return result

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'PalabraFlow Translation Service',
        'status': 'running',
        'model': 'Helsinki-NLP/opus-mt (lightweight)',
        'endpoints': {
            'health': '/health',
            'translate': '/api/translate (POST)'
        }
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'service': 'Translation Service'})

@app.route('/api/health', methods=['GET'])
def api_health():
    return jsonify({'status': 'OK', 'service': 'Translation Service'})

@app.route('/translate', methods=['POST'])
def translate_legacy():
    """Legacy endpoint for backward compatibility"""
    return translate()

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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=False)
