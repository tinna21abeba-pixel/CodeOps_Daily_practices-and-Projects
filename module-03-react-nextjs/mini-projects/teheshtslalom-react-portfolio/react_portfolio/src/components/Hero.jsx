import React from 'react';

export default function Hero() {
  return (
    <section id="home" className="hero-section">
<div className="hero-container">
<div className="hero-content">
<div className="role">
<span className="badge badge-purple" id="text-role">FULL STACK ENGINEER</span>
</div>
<h1 className="hero-title">
                    Hi, I'm <span className="highlight-purple">Tehesh</span><br />
                    I build user-friendly and practical applications.
                </h1>
<p className="hero-description">
                    I'm an aspiring full-stack web developer passionate about writing clean code, exploring modern
                    frameworks, and solving real-world problems.
                </p>
<div className="hero-chta-group">
<a href="#projects" className="btn btn-primary">
                        View My Work <i className="fa-solid fa-arrow-up-right-from-square"></i>
</a>
<a href="/documents/Tehesh-Tslalom-CV.pdf" className="btn btn-secondary" download="">
                        Download CV <i className="fa-solid fa-download"></i>
</a>
</div>
<div className="tech-stack-row">
<p className="tech-title">TECHNOLOGIES I WORK WITH</p>
<div className="tech-icons">
<div className="tech-item html" title="HTML5"><i className="fa-brands fa-html5" style={{color: "#E34F26"}}></i></div>
<div className="tech-item" title="CSS3"><i className="fa-brands fa-css3-alt" style={{color: "#1572B6"}}></i></div>
<div className="tech-item" title="JavaScript"><i className="fa-brands fa-js" style={{color: "#F7DF1E"}}></i></div>
<div className="tech-item" title="TypeScript"><i className="fa-solid fa-code" style={{color: "#3178C6"}}></i></div>
<div className="tech-item" title="React"><i className="fa-brands fa-react" style={{color: "#61DAFB"}}></i>
</div>
<div className="tech-item" title="Node.js"><i className="fa-brands fa-node-js" style={{color: "#339933"}}></i></div>
<div className="tech-item" title="Git"><i className="fa-brands fa-git-alt" style={{color: "#F05032"}}></i>
</div>
</div>
</div>
</div>
<div className="hero-visual">
<div className="hero-glow-circle"></div>
<div className="hero-image-wrapper">
<img src="/images/image.png" alt="Tehesh Tslalom - Web Developer" className="hero-image" />
</div>
          <div className="floating-code-card">
            <div className="code-header">
              <span className="code-title">{"</>"} Code</span>
              <span className="code-dot active"></span>
            </div>
            <pre className="code-body"><code><span className="keyword">const</span> <span className="var-name">developer</span> = &#123;
  <span className="property">name</span>: <span className="string">"Tehesh"</span>,
  <span className="property">skills</span>: [<span className="string">"HTML"</span>, <span className="string">"CSS"</span>, 
           <span className="string">"JavaScript"</span>, <span className="string">"React"</span>],
  <span className="property">passion</span>: <span className="string">"Building practical web solutions"</span>
&#125;;</code></pre>
          </div>
</div>
</div>
</section>
  );
}
