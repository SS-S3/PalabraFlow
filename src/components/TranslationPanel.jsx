import React, { useState } from 'react';
import './TranslationPanel.css';

const TranslationPanel = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('english');
  
  const handleTranslate = () => {
    // Translation logic will be implemented here
    // This is where you'll connect to your translation API
  };
  
  const switchLanguages = () => {
    setSourceLanguage(sourceLanguage === 'english' ? 'spanish' : 'english');
    setInputText(outputText);
    setOutputText(inputText);
  };
  
  return (
    <div className="translation-container">
      <div className="language-controls">
        <div className="language-selector">
          <button 
            className={`language-btn ${sourceLanguage === 'english' ? 'active' : ''}`}
            onClick={() => setSourceLanguage('english')}
          >
            English
          </button>
          <button 
            className={`language-btn ${sourceLanguage === 'spanish' ? 'active' : ''}`}
            onClick={() => setSourceLanguage('spanish')}
          >
            Spanish
          </button>
        </div>
        <button className="switch-btn" onClick={switchLanguages}>
          <span className="material-icons">swap_horiz</span>
        </button>
      </div>
      
      <div className="translation-panels">
        <div className="input-panel">
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={sourceLanguage === 'english' ? 'Enter English text...' : 'Ingrese texto en español...'}
          />
          <div className="panel-controls">
            <button className="clear-btn">Clear</button>
          </div>
        </div>
        
        <div className="output-panel">
          <div className="output-text">{outputText}</div>
          <div className="panel-controls">
            <button className="copy-btn">
              <span className="material-icons">content_copy</span>
            </button>
          </div>
        </div>
      </div>
      
      <button className="translate-btn" onClick={handleTranslate}>
        Translate
      </button>
    </div>
  );
};

export default TranslationPanel;
