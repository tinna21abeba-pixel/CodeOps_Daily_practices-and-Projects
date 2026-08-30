import React from 'react';

export default function About() {
  return (
    <section id="about" className="about-section">
<div className="about-container">
<div className="about-content">
<span className="badge badge-purple">ABOUT ME</span>
<h2 className="section-heading">I'm passionate about creating digital solutions</h2>
<p className="section-description">
                    As an emerging software engineer, I am dedicated to mastering full-stack web development. I focus on
                    turning complex challenges into simple, responsive, and maintainable applications using modern tools
                    like React, Next.js, and Node.js.
                </p>
<a href="#about-details" className="btn btn-outline">
                    Learn More About Me <i className="fa-regular fa-user"></i>
</a>
</div>
<div className="stats-grid">
<div className="stat-card">
<div className="stat-icon"><i className="fa-regular fa-calendar"></i></div>
<h3 className="stat-value">2+</h3>
<p className="stat-label">Years Coding Experience</p>
</div>
<div className="stat-card">
<div className="stat-icon"><i className="fa-solid fa-code"></i></div>
<h3 className="stat-value">5+</h3>
<p className="stat-label">Featured Projects</p>
</div>
<div className="stat-card">
<div className="stat-icon"><i className="fa-regular fa-face-smile"></i></div>
<h3 className="stat-value">10+</h3>
<p className="stat-label">Technologies Mastered</p>
</div>
<div className="stat-card">
<div className="stat-icon"><i className="fa-solid fa-trophy"></i></div>
<h3 className="stat-value">100%</h3>
<p className="stat-label">Commitment to Growth</p>
</div>
</div>
</div>
</section>
  );
}
