import React from 'react';

export default function Blogs() {
  return (
    <section id="blogs" className="blogs-section">
<div className="blogs-container">
<div className="section-header text-center">
<span className="badge badge-purple">MY BLOG</span>
<h2 className="section-heading">Learning Journey & Articles</h2>
</div>
<div className="blogs-grid">
<div className="blog-card">
<div className="blog-image">
<div className="placeholder-img" style={{background: "linear-gradient(135deg, #1e1b4b, #581c87)"}}>
</div>
</div>
<div className="blog-content">
<div className="blog-meta">
<span className="blog-date"><i className="fa-regular fa-calendar"></i> Oct 15, 2024</span>
<span className="blog-category">Web Dev</span>
</div>
<h3 className="blog-title">Getting Started with React Hooks</h3>
<p className="blog-description">My key takeaways on state management and building functional React
                            components.</p>
<a href="#" className="blog-link">Read More <i className="fa-solid fa-arrow-right"></i></a>
</div>
</div>
<div className="blog-card">
<div className="blog-image">
<div className="placeholder-img" style={{background: "linear-gradient(135deg, #0f172a, #3b82f6)"}}>
</div>
</div>
<div className="blog-content">
<div className="blog-meta">
<span className="blog-date"><i className="fa-regular fa-calendar"></i> Sep 28, 2024</span>
<span className="blog-category">CSS</span>
</div>
<h3 className="blog-title">Building Layouts with CSS Flexbox & Grid</h3>
<p className="blog-description">A practical guide to creating clean and responsive user interfaces
                            from scratch.</p>
<a href="#" className="blog-link">Read More <i className="fa-solid fa-arrow-right"></i></a>
</div>
</div>
<div className="blog-card">
<div className="blog-image">
<div className="placeholder-img" style={{background: "linear-gradient(135deg, #064e3b, #10b981)"}}>
</div>
</div>
<div className="blog-content">
<div className="blog-meta">
<span className="blog-date"><i className="fa-regular fa-calendar"></i> Sep 10, 2024</span>
<span className="blog-category">Career</span>
</div>
<h3 className="blog-title">Lessons Learned as a Junior Developer</h3>
<p className="blog-description">Essential habits, debugging tips, and tools that helped accelerate
                            my coding journey.</p>
<a href="#" className="blog-link">Read More <i className="fa-solid fa-arrow-right"></i></a>
</div>
</div>
</div>
</div>
</section>
  );
}
