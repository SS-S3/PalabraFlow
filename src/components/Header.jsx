import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className="header-container">
      <div className="logo-container">
        <h1>PalabraFlow</h1>
        <div className="tagline">ML Project </div>
      </div>
      <div className="theme-toggle">
        <button className="theme-button">
          <span className="material-icons">dark_mode</span>
        </button>
      </div>
    </div>
  );
};

export default Header;