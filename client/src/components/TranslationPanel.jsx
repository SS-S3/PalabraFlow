import React, { useState } from 'react';
import './TranslationPanel.css';

const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' }
];

const getTargetLanguage = (source) => (source === 'en' ? 'es' : 'en');

const TranslationPanel = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    setLoading(true);
    setError('');
    setOutputText('');
    try {
      const response = await fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          sourceLanguage,
          targetLanguage: getTargetLanguage(sourceLanguage)
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Translation failed');
      setOutputText(data.translatedText);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchLanguages = () => {
    setSourceLanguage(getTargetLanguage(sourceLanguage));
    setInputText(outputText);
    setOutputText(inputText);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError('');
  };

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
    }
  };

  return (
    <div className="translation-container">
      <div className="language-controls">
        <div className="language-selector">
          {languageOptions.map(lang => (
            <button
              key={lang.code}
              className={`language-btn ${sourceLanguage === lang.code ? 'active' : ''}`}
              onClick={() => setSourceLanguage(lang.code)}
            >
              {lang.label}
            </button>
          ))}
        </div>
        <button className="switch-btn" onClick={switchLanguages}>
          <span className="material-icons">swap_horiz</span>
        </button>
      </div>

      <div className="translation-panels">
        <div className="input-panel">
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={sourceLanguage === 'en' ? 'Enter English text...' : 'Ingrese texto en español...'}
          />
          <div className="panel-controls">
            <button className="clear-btn" onClick={handleClear}>Clear</button>
          </div>
        </div>

        <div className="output-panel">
          <div className="output-text">
            {loading ? <em>Translating...</em> : outputText}
            {error && <div className="error">{error}</div>}
          </div>
          <div className="panel-controls">
            <button className="copy-btn" onClick={handleCopy} disabled={!outputText}>
              <span className="material-icons">content_copy</span>
            </button>
          </div>
        </div>
      </div>

      <button className="translate-btn" onClick={handleTranslate} disabled={loading || !inputText}>
        Translate
      </button>
    </div>
  );
};

export default TranslationPanel;




// // import React, { useState, useEffect } from 'react';
// // import './TranslationPanel.css';

// // const TranslationPanel = () => {
// //   const [inputText, setInputText] = useState('');
// //   const [outputText, setOutputText] = useState('');
// //   const [sourceLanguage, setSourceLanguage] = useState('english');
// //   const [targetLanguage, setTargetLanguage] = useState('spanish');
// //   const [apiKey, setApiKey] = useState('');
// //   const [savedApiKey, setSavedApiKey] = useState('');
// //   const [isKeyValid, setIsKeyValid] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [showApiInput, setShowApiInput] = useState(false);

// //   // Load API key from localStorage on component mount
// //   useEffect(() => {
// //     const storedApiKey = localStorage.getItem('geminiApiKey');
// //     if (storedApiKey) {
// //       setApiKey(storedApiKey);
// //       setSavedApiKey(storedApiKey);
// //       verifyApiKey(storedApiKey);
// //     } else {
// //       setShowApiInput(true);
// //     }
// //   }, []);

// //   const verifyApiKey = async (key) => {
// //     try {
// //       setIsLoading(true);
// //       const response = await fetch('http://localhost:5000/api/verify-key', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ apiKey: key }),
// //       });
      
// //       const data = await response.json();
      
// //       if (data.valid) {
// //         setIsKeyValid(true);
// //         setShowApiInput(false);
// //         localStorage.setItem('geminiApiKey', key);
// //         setSavedApiKey(key);
// //         setError('');
// //       } else {
// //         setIsKeyValid(false);
// //         setError('Invalid API key');
// //       }
// //     } catch (err) {
// //       setIsKeyValid(false);
// //       setError('Failed to verify API key');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const saveApiKey = () => {
// //     if (apiKey.trim() === '') {
// //       setError('API key cannot be empty');
// //       return;
// //     }
// //     verifyApiKey(apiKey);
// //   };

// //   const handleTranslate = async () => {
// //     if (!inputText.trim()) {
// //       setError('Please enter text to translate');
// //       return;
// //     }
    
// //     if (!isKeyValid) {
// //       setError('Please enter a valid API key');
// //       setShowApiInput(true);
// //       return;
// //     }
    
// //     try {
// //       setIsLoading(true);
// //       setError('');
      
// //       const response = await fetch('http://localhost:5000/api/translate', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           text: inputText,
// //           sourceLanguage,
// //           targetLanguage,
// //           apiKey: savedApiKey,
// //         }),
// //       });
      
// //       const data = await response.json();
      
// //       if (response.ok) {
// //         setOutputText(data.translatedText);
// //       } else {
// //         setError(data.error || 'Translation failed');
// //       }
// //     } catch (err) {
// //       setError('Failed to connect to translation service');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };
  
// //   const switchLanguages = () => {
// //     const newSourceLang = sourceLanguage === 'english' ? 'spanish' : 'english';
// //     const newTargetLang = targetLanguage === 'english' ? 'spanish' : 'english';
    
// //     setSourceLanguage(newSourceLang);
// //     setTargetLanguage(newTargetLang);
// //     setInputText(outputText);
// //     setOutputText(inputText);
// //   };
  
// //   const clearText = () => {
// //     setInputText('');
// //     setOutputText('');
// //     setError('');
// //   };
  
// //   const copyToClipboard = () => {
// //     navigator.clipboard.writeText(outputText);
// //   };

// //   return (
// //     <div className="translation-container">
// //       {showApiInput ? (
// //         <div className="api-key-section">
// //           <h3>Enter your Gemini API Key</h3>
// //           <input
// //             type="password"
// //             value={apiKey}
// //             onChange={(e) => setApiKey(e.target.value)}
// //             placeholder="Enter Gemini API Key"
// //           />
// //           <button onClick={saveApiKey} disabled={isLoading}>
// //             {isLoading ? 'Verifying...' : 'Save API Key'}
// //           </button>
// //           {error && <p className="error-message">{error}</p>}
// //         </div>
// //       ) : (
// //         <>
// //           <div className="language-controls">
// //             <div className="language-selector">
// //               <button 
// //                 className={`language-btn ${sourceLanguage === 'english' ? 'active' : ''}`}
// //                 onClick={() => {
// //                   setSourceLanguage('english');
// //                   setTargetLanguage('spanish');
// //                 }}
// //               >
// //                 English → Spanish
// //               </button>
// //               <button 
// //                 className={`language-btn ${sourceLanguage === 'spanish' ? 'active' : ''}`}
// //                 onClick={() => {
// //                   setSourceLanguage('spanish');
// //                   setTargetLanguage('english');
// //                 }}
// //               >
// //                 Spanish → English
// //               </button>
// //             </div>
// //             <button className="switch-btn" onClick={switchLanguages}>
// //               <span className="material-icons">swap_horiz</span>
// //             </button>
// //           </div>
          
// //           <div className="translation-panels">
// //             <div className="input-panel">
// //               <textarea 
// //                 value={inputText}
// //                 onChange={(e) => setInputText(e.target.value)}
// //                 placeholder={sourceLanguage === 'english' ? 'Enter English text...' : 'Ingrese texto en español...'}
// //               />
// //               <div className="panel-controls">
// //                 <button className="clear-btn" onClick={clearText}>Clear</button>
// //               </div>
// //             </div>
            
// //             <div className="output-panel">
// //               <div className="output-text">{outputText}</div>
// //               <div className="panel-controls">
// //                 <button className="copy-btn" onClick={copyToClipboard}>
// //                   <span className="material-icons">content_copy</span>
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
          
// //           <button 
// //             className="translate-btn" 
// //             onClick={handleTranslate}
// //             disabled={isLoading || !inputText.trim()}
// //           >
// //             {isLoading ? 'Translating...' : 'Translate'}
// //           </button>
          
// //           {error && <p className="error-message">{error}</p>}
          
// //           <div className="api-settings">
// //             <button 
// //               className="api-settings-btn"
// //               onClick={() => setShowApiInput(true)}
// //             >
// //               Change API Key
// //             </button>
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default TranslationPanel;






// // import React, { useState, useEffect } from 'react';
// // import { ArrowLeftRight, Copy, X } from 'lucide-react';
// // import './TranslationPanel.css';

// // const TranslationPanel = () => {
// //   const [inputText, setInputText] = useState('');
// //   const [outputText, setOutputText] = useState('');
// //   const [sourceLanguage, setSourceLanguage] = useState('english');
// //   const [targetLanguage, setTargetLanguage] = useState('spanish');
// //   const [apiKey, setApiKey] = useState('');
// //   const [savedApiKey, setSavedApiKey] = useState('');
// //   const [isKeyValid, setIsKeyValid] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [statusMessage, setStatusMessage] = useState('');
// //   const [showApiInput, setShowApiInput] = useState(false);
// //   const [copySuccess, setCopySuccess] = useState(false);

// //   // Load API key from localStorage on component mount
// //   useEffect(() => {
// //     const storedApiKey = localStorage.getItem('geminiApiKey');
// //     if (storedApiKey) {
// //       setApiKey(storedApiKey);
// //       setSavedApiKey(storedApiKey);
// //       setStatusMessage('Verifying stored API key...');
// //       verifyApiKey(storedApiKey);
// //     } else {
// //       setShowApiInput(true);
// //     }
// //   }, []);

// //   // Reset copy success message after 2 seconds
// //   useEffect(() => {
// //     if (copySuccess) {
// //       const timer = setTimeout(() => setCopySuccess(false), 2000);
// //       return () => clearTimeout(timer);
// //     }
// //   }, [copySuccess]);

// //   const verifyApiKey = async (key) => {
// //     try {
// //       setIsLoading(true);
// //       setError('');
// //       setStatusMessage('Verifying API key...');
      
// //       console.log('Sending key verification request');
      
// //       const response = await fetch('/api/verify-key', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ apiKey: key }),
// //       });
      
// //       const data = await response.json();
// //       console.log('Key verification response:', data);
      
// //       if (data.valid) {
// //         setIsKeyValid(true);
// //         setShowApiInput(false);
// //         localStorage.setItem('geminiApiKey', key);
// //         setSavedApiKey(key);
// //         setError('');
// //         setStatusMessage('API key verified successfully!');
// //       } else {
// //         setIsKeyValid(false);
// //         setError(data.error || 'Invalid API key');
// //         setStatusMessage('');
// //       }
// //     } catch (err) {
// //       console.error('API verification error:', err);
// //       setIsKeyValid(false);
// //       setError('Failed to verify API key: ' + (err.message || 'Unknown error'));
// //       setStatusMessage('');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const saveApiKey = () => {
// //     if (!apiKey || apiKey.trim() === '') {
// //       setError('API key cannot be empty');
// //       return;
// //     }
    
// //     // Clean the API key to remove any extra spaces
// //     const cleanedKey = apiKey.trim();
// //     setApiKey(cleanedKey);
// //     verifyApiKey(cleanedKey);
// //   };

// //   const handleTranslate = async () => {
// //     if (!inputText.trim()) {
// //       setError('Please enter text to translate');
// //       return;
// //     }
    
// //     if (!isKeyValid) {
// //       setError('Please enter a valid API key');
// //       setShowApiInput(true);
// //       return;
// //     }
    
// //     try {
// //       setIsLoading(true);
// //       setError('');
// //       setStatusMessage('Translating...');
      
// //       const response = await fetch('/api/translate', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           text: inputText,
// //           sourceLanguage,
// //           targetLanguage,
// //           apiKey: savedApiKey,
// //         }),
// //       });
      
// //       const data = await response.json();
      
// //       if (response.ok) {
// //         setOutputText(data.translatedText);
// //         setStatusMessage('');
// //       } else {
// //         setError(data.error || 'Translation failed');
// //         setStatusMessage('');
// //       }
// //     } catch (err) {
// //       console.error('Translation error:', err);
// //       setError('Failed to connect to translation service');
// //       setStatusMessage('');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };
  
// //   const switchLanguages = () => {
// //     const newSourceLang = sourceLanguage === 'english' ? 'spanish' : 'english';
// //     const newTargetLang = targetLanguage === 'english' ? 'spanish' : 'english';
    
// //     setSourceLanguage(newSourceLang);
// //     setTargetLanguage(newTargetLang);
// //     setInputText(outputText);
// //     setOutputText(inputText);
// //   };
  
// //   const clearText = () => {
// //     setInputText('');
// //     setOutputText('');
// //     setError('');
// //   };
  
// //   const copyToClipboard = () => {
// //     navigator.clipboard.writeText(outputText);
// //     setCopySuccess(true);
// //   };

// //   return (
// //     <div className="translation-container">
// //       {showApiInput ? (
// //         <div className="api-key-section">
// //           <h3>Enter your Gemini API Key</h3>
// //           <p className="api-key-instructions">
// //             Get your API key from <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
// //           </p>
// //           <input
// //             type="text"
// //             value={apiKey}
// //             onChange={(e) => setApiKey(e.target.value)}
// //             placeholder="Enter Gemini API Key"
// //             className="api-key-input"
// //           />
// //           <button 
// //             onClick={saveApiKey} 
// //             disabled={isLoading}
// //             className="api-key-button"
// //           >
// //             {isLoading ? 'Verifying...' : 'Save API Key'}
// //           </button>
// //           {statusMessage && <p className="status-message">{statusMessage}</p>}
// //           {error && <p className="error-message">{error}</p>}
// //         </div>
// //       ) : (
// //         <>
// //           <div className="language-controls">
// //             <div className="language-selector">
// //               <button 
// //                 className={`language-btn ${sourceLanguage === 'english' ? 'active' : ''}`}
// //                 onClick={() => {
// //                   setSourceLanguage('english');
// //                   setTargetLanguage('spanish');
// //                 }}
// //               >
// //                 English → Spanish
// //               </button>
// //               <button 
// //                 className={`language-btn ${sourceLanguage === 'spanish' ? 'active' : ''}`}
// //                 onClick={() => {
// //                   setSourceLanguage('spanish');
// //                   setTargetLanguage('english');
// //                 }}
// //               >
// //                 Spanish → English
// //               </button>
// //             </div>
// //             <button className="switch-btn" onClick={switchLanguages} aria-label="Switch languages">
// //               <ArrowLeftRight size={20} />
// //             </button>
// //           </div>
          
// //           <div className="translation-panels">
// //             <div className="input-panel">
// //               <textarea 
// //                 value={inputText}
// //                 onChange={(e) => setInputText(e.target.value)}
// //                 placeholder={sourceLanguage === 'english' ? 'Enter English text...' : 'Ingrese texto en español...'}
// //                 className="translation-textarea"
// //               />
// //               <div className="panel-controls">
// //                 <button className="clear-btn" onClick={clearText} aria-label="Clear text">
// //                   <X size={18} />
// //                   <span>Clear</span>
// //                 </button>
// //               </div>
// //             </div>
            
// //             <div className="output-panel">
// //               <div className="output-text">{outputText}</div>
// //               <div className="panel-controls">
// //                 <button 
// //                   className="copy-btn" 
// //                   onClick={copyToClipboard} 
// //                   disabled={!outputText}
// //                   aria-label="Copy to clipboard"
// //                 >
// //                   <Copy size={18} />
// //                   <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
          
// //           <button 
// //             className="translate-btn" 
// //             onClick={handleTranslate}
// //             disabled={isLoading || !inputText.trim()}
// //           >
// //             {isLoading ? 'Translating...' : 'Translate'}
// //           </button>
          
// //           {statusMessage && <p className="status-message">{statusMessage}</p>}
// //           {error && <p className="error-message">{error}</p>}
          
// //           <div className="api-settings">
// //             <button 
// //               className="api-settings-btn"
// //               onClick={() => setShowApiInput(true)}
// //             >
// //               Change API Key
// //             </button>
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default TranslationPanel;







// import React, { useState } from 'react';
// import './TranslationPanel.css'; // Make sure this CSS file exists and is linked correctly

// const TranslationPanel = () => {
//     const [inputText, setInputText] = useState('');
//     const [outputText, setOutputText] = useState('');
//     const [sourceLanguage, setSourceLanguage] = useState('english');
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [copySuccess, setCopySuccess] = useState(''); // For feedback on copy

//     // Determine target language based on source
//     const targetLanguage = sourceLanguage === 'english' ? 'spanish' : 'english';

//     const handleTranslate = async () => {
//         if (!inputText.trim()) {
//             setError('Please enter text to translate.');
//             return;
//         }

//         setError(''); // Clear previous errors
//         setOutputText(''); // Clear previous output
//         setIsLoading(true); // Start loading
//         setCopySuccess(''); // Reset copy feedback

//         try {
//             // Make API call to your backend
//             const response = await fetch('http://localhost:5000/api/translate', { // Use your actual backend endpoint URL
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     text: inputText,
//                     sourceLanguage: sourceLanguage,
//                     targetLanguage: targetLanguage,
//                     // No API key is sent from the frontend
//                 }),
//             });

//             const data = await response.json(); // Always try to parse JSON

//             if (!response.ok) {
//                 // Use error message from backend if available, otherwise use status text
//                 throw new Error(data.error || `HTTP error! status: ${response.status} - ${response.statusText}`);
//             }

//             setOutputText(data.translatedText); // Update output text with translation

//         } catch (err) {
//             console.error('Translation failed:', err);
//             // Set a user-friendly error message
//             setError(`Translation failed: ${err.message}. Please check the console or server logs for details.`);
//             setOutputText(''); // Ensure output is clear on error
//         } finally {
//             setIsLoading(false); // Stop loading regardless of success or failure
//         }
//     };

//     const switchLanguages = () => {
//         // Only switch if not loading
//         if (isLoading) return;

//         // Swap source language
//         setSourceLanguage(targetLanguage); // targetLanguage already holds the opposite

//         // Swap text only if there's something to swap
//         if (inputText || outputText) {
//             setInputText(outputText);
//             setOutputText(inputText);
//         }
//         setError(''); // Clear any error messages
//         setCopySuccess('');
//     };

//     const handleClearInput = () => {
//         setInputText('');
//         setError('');
//         setCopySuccess('');
//     };

//     const handleCopyOutput = () => {
//         if (!outputText || isLoading) return; // Don't copy if empty or loading

//         navigator.clipboard.writeText(outputText)
//             .then(() => {
//                 setCopySuccess('Copied!');
//                 setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
//             })
//             .catch(err => {
//                 console.error('Failed to copy text: ', err);
//                 setCopySuccess('Failed to copy');
//                 setTimeout(() => setCopySuccess(''), 2000);
//             });
//     };


//     return (
//         <div className="translation-container">
//             {/* Language Selection and Switch */}
//             <div className="language-controls">
//                 <div className="language-selector">
//                     {/* Source Language Buttons */}
//                     <button
//                         className={`language-btn ${sourceLanguage === 'english' ? 'active' : ''}`}
//                         onClick={() => !isLoading && setSourceLanguage('english')}
//                         disabled={isLoading}
//                     >
//                         English
//                     </button>
//                     <button
//                         className={`language-btn ${sourceLanguage === 'spanish' ? 'active' : ''}`}
//                         onClick={() => !isLoading && setSourceLanguage('spanish')}
//                         disabled={isLoading}
//                     >
//                         Spanish
//                     </button>
//                     {/* Display inferred Target Language */}
//                     <span style={{ marginLeft: '1rem', alignSelf: 'center', color: '#555' }}>
//                         &rarr; {targetLanguage.charAt(0).toUpperCase() + targetLanguage.slice(1)}
//                     </span>
//                 </div>
//                 {/* Switch Button */}
//                 <button className="switch-btn" onClick={switchLanguages} disabled={isLoading} title="Switch Languages">
//                     {/* Using text icon for broader compatibility */}
//                     &#x21C4; {/* Unicode Swap Arrows */}
//                     {/* If you have Material Icons setup: <span className="material-icons">swap_horiz</span> */}
//                 </button>
//             </div>

//             {/* Input and Output Panels */}
//             <div className="translation-panels">
//                 {/* Input Panel */}
//                 <div className="input-panel">
//                     <textarea
//                         value={inputText}
//                         onChange={(e) => setInputText(e.target.value)}
//                         placeholder={sourceLanguage === 'english' ? 'Enter English text...' : 'Ingrese texto en español...'}
//                         disabled={isLoading}
//                     />
//                     <div className="panel-controls">
//                         {/* Clear Button */}
//                         <button className="clear-btn" onClick={handleClearInput} disabled={!inputText || isLoading} title="Clear Input">
//                             {/* Using text icon */}
//                             &#x2715; {/* Unicode Cross Mark */}
//                             {/* If you have Material Icons setup: <span className="material-icons">clear</span> */}
//                         </button>
//                     </div>
//                 </div>

//                 {/* Output Panel */}
//                 <div className="output-panel">
//                     {/* Display Loading or Output */}
//                     <div className="output-text">
//                         {isLoading ? 'Translating...' : outputText}
//                     </div>
//                     <div className="panel-controls">
//                         {/* Copy Button */}
//                         <button className="copy-btn" onClick={handleCopyOutput} disabled={!outputText || isLoading} title="Copy Output">
//                             {copySuccess ? copySuccess : 'Copy'} {/* Provide feedback */}
//                             {/* If you have Material Icons setup: <span className="material-icons">content_copy</span> */}
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Translate Button */}
//             <button
//                 className="translate-btn"
//                 onClick={handleTranslate}
//                 disabled={isLoading || !inputText.trim()} // Disable if loading or input is empty/whitespace
//             >
//                 {isLoading ? 'Translating...' : 'Translate'}
//             </button>

//             {/* Error Message Display */}
//             {error && <p className="error-message" style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}

//         </div>
//     );
// };

// export default TranslationPanel;
