import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Blogs from './components/Blogs';
import Footer from './components/Footer';
import ScrollTopButton from './components/ScrollTopButton';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Keep the original light/dark mode behavior.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Original scroll-to-top behavior.
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Original active navigation + reveal animations.
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const linkMap = new Map();
    navLinks.forEach((link) => {
      const id = link.getAttribute('href')?.replace('#', '');
      if (id) linkMap.set(id, link);
    });

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => link.classList.remove('active'));
            linkMap.get(entry.target.id)?.classList.add('active');
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));

    const targets = document.querySelectorAll(
      '.project-card, .blog-card, .stat-card, .skill-item, .testimonial-card'
    );

    targets.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 4) * 80}ms`;
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach((el) => revealObserver.observe(el));

    return () => {
      sectionObserver.disconnect();
      revealObserver.disconnect();
    };
  }, []);

  // Original skill-bar animation.
  useEffect(() => {
    const bars = document.querySelectorAll('.progress-bar-fill');

    bars.forEach((bar) => {
      bar.dataset.targetWidth = bar.style.width || '0%';
      bar.style.width = '0%';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            requestAnimationFrame(() => {
              bar.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
              bar.style.width = bar.dataset.targetWidth;
            });
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.4 }
    );

    bars.forEach((bar) => observer.observe(bar));
    return () => observer.disconnect();
  }, []);

  // Original project carousel dots.
  useEffect(() => {
    const grid = document.querySelector('.projects-grid');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    if (!grid || !dots.length) return;

    const cards = grid.querySelectorAll('.project-card');

    const dotHandlers = [];
    dots.forEach((dot, i) => {
      const handler = () => {
        const card = cards[i];
        if (card) grid.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
      };
      dot.addEventListener('click', handler);
      dotHandlers.push([dot, handler]);
    });

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        let closestIndex = 0;
        let closestDist = Infinity;

        cards.forEach((card, i) => {
          const dist = Math.abs(card.offsetLeft - grid.scrollLeft);
          if (dist < closestDist) {
            closestDist = dist;
            closestIndex = i;
          }
        });

        dots.forEach((dot) => dot.classList.remove('active'));
        dots[closestIndex]?.classList.add('active');
        ticking = false;
      });
    };

    grid.addEventListener('scroll', handleScroll);
    return () => {
      dotHandlers.forEach(([dot, handler]) => dot.removeEventListener('click', handler));
      grid.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const btn = form.querySelector('button[type="submit"]');
    const status = form.querySelector('#form-status');
    const originalText = btn.innerHTML;

    btn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.innerHTML = originalText;
      btn.disabled = false;
      status.textContent = 'Message sent successfully! I will get back to you soon.';
      status.className = 'form-status success';

      setTimeout(() => {
        status.textContent = '';
        status.className = 'form-status';
      }, 5000);
    }, 1500);
  };

  return (
    <>
      <Navbar
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        theme={theme}
        onToggleTheme={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
      />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Blogs />
      <Footer onSubmit={handleContactSubmit} />
      <ScrollTopButton
        show={showScrollTop}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </>
  );
}

export default App;
