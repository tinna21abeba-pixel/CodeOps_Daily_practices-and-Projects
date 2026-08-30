import React from 'react';

export default function Footer({ onSubmit }) {
  return (
    <footer id="contact" className="footer-section">
<div className="footer-container">
<div className="footer-grid">
<div className="footer-col contact-cta-col">
<span className="badge badge-purple">LET'S WORK TOGETHER</span>
<h3 className="footer-heading">Have a project in mind?</h3>
<p className="footer-description">
                        I'm always open to discussing new projects, entry-level opportunities, or developer
                        collaborations. Let me know how I can contribute!
                    </p>
<form id="contact-form" className="contact-form" onSubmit={onSubmit}>
<div className="form-group">
<input type="text" id="name" name="name" required="" placeholder="Your Name" className="form-input" />
</div>
<div className="form-group">
<input type="email" id="email" name="email" required="" placeholder="Your Email" className="form-input" />
</div>
<div className="form-group">
<textarea id="message" name="message" required="" placeholder="Your Message" rows="4" className="form-input"></textarea>
</div>
<button type="submit" className="btn btn-primary form-submit-btn">
                            Send Message <i className="fa-regular fa-paper-plane"></i>
</button>
<p id="form-status" className="form-status" aria-live="polite"></p>
</form>
</div>
<div className="footer-col testimonial-col">
<div className="testimonial-card">
<div className="quote-icon"><i className="fa-solid fa-quote-left"></i></div>
<p className="testimonial-text">
                            Tehesh is a dedicated developer who learns quickly, writes clean code, and approaches
                            technical problems with thorough persistence.
                        </p>
<div className="testimonial-author">
<div className="author-avatar">
<i className="fa-regular fa-user"></i>
</div>
<div className="author-info">
<h4 className="author-name">Peer Recommendation</h4>
<p className="author-role">Software Engineering Mentor</p>
</div>
</div>
</div>
</div>
<div className="footer-col follow-col">
<span className="badge badge-purple">FOLLOW ME</span>
<div className="social-links">
<a href="https://github.com/tinna21abeba-pixel" target="_blank" className="social-btn" title="GitHub"><i className="fa-brands fa-github"></i></a>
<a href="https://www.linkedin.com/in/tehesh-tslalom-3203b935a/?isSelfProfile=true" target="_blank" className="social-btn" title="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
<a href="https://twitter.com" target="_blank" className="social-btn" title="Twitter"><i className="fa-brands fa-x-twitter"></i></a>
<a href="https://instagram.com" target="_blank" className="social-btn" title="Instagram"><i className="fa-brands fa-instagram"></i></a>
</div>
<div className="contact-details">
<div className="contact-item">
<i className="fa-regular fa-envelope"></i>
<a href="mailto:teheshtslalom@gmail.com">tinna21abeba@gmail.com</a>
</div>
<div className="contact-item">
<i className="fa-solid fa-phone"></i>
<a href="tel:+251998438170">+251 (998) 438-170</a>
</div>
</div>
</div>
</div>
<div className="footer-bottom">
<p className="copyright">© 2026 Tehesh Tslalom. All rights reserved.</p>
<p className="signature">Made with <span className="heart">♥</span> by Tehesh</p>
</div>
</div>
</footer>
  );
}
