import React from 'react';

export default function Navbar({ menuOpen, onToggleMenu, theme, onToggleTheme }) {
  return (
    <header className="navbar">
<div className="nav-container">
<div className="logo">
<a href="#home">
<span className="logo-icon"><i className="fa-solid fa-code"></i></span>
<span className="logo-text">Tehesh.dev </span>
</a>
</div>
<div className={`nav-menu ${menuOpen ? "show" : ""}`}>
<ul className="nav-links">
<li><a href="#home" className="nav-link" onClick={onToggleMenu}>Home</a></li>
<li><a href="#about" className="nav-link" onClick={onToggleMenu}>About</a></li>
<li><a href="#skills" className="nav-link" onClick={onToggleMenu}>Skills</a></li>
<li><a href="#projects" className="nav-link" onClick={onToggleMenu}>Projects</a></li>
<li><a href="#blogs" className="nav-link" onClick={onToggleMenu}>Blog</a></li>
<li><a href="#contact" className="nav-link" onClick={onToggleMenu}>Contact</a></li>
</ul>
</div>
<div className="nav-right" style={{display: "flex", gap: "20px", alignItems: "center"}}>
<button id="theme-toggle" className="theme-toggle-btn" aria-label="Toggle dark/light mode">
<i className="fa-solid fa-moon"></i>
</button>
<div className="nav-actions">
<a href="#contact" className="btn btn-primary">Hire Me</a>
</div>
</div>
<button className="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
<span></span><span></span><span></span>
</button>
</div>
</header>
  );
}
