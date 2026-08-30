import React from 'react';

export default function Projects() {
  return (
    <section id="projects" className="projects-section">
<div className="projects-container">
<div className="section-header text-center">
<span className="badge badge-purple">FEATURED PROJECTS</span>
<h2 className="section-heading">Some of My Recent Work</h2>
</div>
<div className="projects-grid">
<div className="project-card">
<div className="project-header">
<span className="project-number">01</span>
</div>
<div className="project-preview preview-ecommerce">
<div className="preview-mockup">
<div className="mock-sidebar"></div>
<div className="mock-content">
<div className="mock-chart"></div>
</div>
</div>
</div>
<div className="project-content">
<h3 className="project-title">Student Management System</h3>
<p className="project-description">A responsive full-stack platform for managing student records and
                            grades.</p>
<a href="#project-1" className="project-link">View Project <i className="fa-solid fa-arrow-up-right-from-square"></i></a>
</div>
</div>
<div className="project-card">
<div className="project-header">
<span className="project-number">02</span>
</div>
<div className="project-preview preview-taskapp">
<div className="preview-mockup light-mockup">
<div className="mock-grid">
<div></div>
<div></div>
<div></div>
</div>
</div>
</div>
<div className="project-content">
<h3 className="project-title">React Task Manager</h3>
<p className="project-description">An interactive todo list web application built with React and
                            dynamic state management.</p>
<a href="#project-2" className="project-link">View Project <i className="fa-solid fa-arrow-up-right-from-square"></i></a>
</div>
</div>
<div className="project-card">
<div className="project-header">
<span className="project-number">03</span>
</div>
<div className="project-preview preview-crypto">
<div className="preview-mockup dark-mockup">
<div className="mock-chart-line"></div>
<div className="mock-circle-chart"></div>
</div>
</div>
<div className="project-content">
<h3 className="project-title">Data Analytics Dashboard</h3>
<p className="project-description">A Python and Streamlit dashboard built for exploratory data
                            analysis and reporting.</p>
<a href="#project-3" className="project-link">View Project <i className="fa-solid fa-arrow-up-right-from-square"></i></a>
</div>
</div>
</div>
<div className="carousel-dots">
<span className="dot active"></span>
<span className="dot"></span>
<span className="dot"></span>
</div>
</div>
</section>
  );
}
