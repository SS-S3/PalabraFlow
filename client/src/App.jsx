import React from 'react';
import Header from './components/Header';
import TranslationPanel from './components/TranslationPanel';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <div className="background-elements">
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>
      </div>
      
      <Header />
      
      <main className="main-content">
        <TranslationPanel />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
