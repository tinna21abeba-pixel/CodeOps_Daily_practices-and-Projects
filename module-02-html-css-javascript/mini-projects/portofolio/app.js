

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initActiveNavOnScroll();
  initSkillBarAnimation();
  initScrollReveal();
  initProjectCarousel();
  initScrollToTop();
  initDynamicYear();
  initContactForm();
});


function initMobileNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('show');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('nav-open', isOpen);
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('show');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    });
  });
}


function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const linkMap = new Map();
  navLinks.forEach(link => {
    const id = link.getAttribute('href')?.replace('#', '');
    if (id) linkMap.set(id, link);
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          linkMap.get(entry.target.id)?.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach(section => observer.observe(section));
}


function initSkillBarAnimation() {
  const bars = document.querySelectorAll('.progress-bar-fill');
  if (!bars.length) return;

  bars.forEach(bar => {

    bar.dataset.targetWidth = bar.style.width || '0%';
    bar.style.width = '0%';
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
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

  bars.forEach(bar => observer.observe(bar));
}


function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.project-card, .blog-card, .stat-card, .skill-item, .testimonial-card'
  );
  if (!targets.length) return;

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach(el => observer.observe(el));
}


function initProjectCarousel() {
  const grid = document.querySelector('.projects-grid');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  if (!grid || !dots.length) return;

  const cards = grid.querySelectorAll('.project-card');

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const card = cards[i];
      if (card) {
        grid.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
      }
    });
  });

  let ticking = false;
  grid.addEventListener('scroll', () => {
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
      dots.forEach(d => d.classList.remove('active'));
      dots[closestIndex]?.classList.add('active');
      ticking = false;
    });
  });
}


function initScrollToTop() {
  const btn = document.querySelector('.scroll-top-btn');
  if (!btn) return;

  const toggleVisibility = () => {
    btn.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


function initDynamicYear() {
  const copyright = document.querySelector('.copyright');
  if (!copyright) return;
  copyright.innerHTML = copyright.innerHTML.replace(
    /\d{4}/,
    new Date().getFullYear()
  );
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;

    // Simulate network request
    setTimeout(() => {
      form.reset();
      btn.innerHTML = originalText;
      btn.disabled = false;
      status.textContent = 'Message sent successfully! I will get back to you soon.';
      status.className = 'form-status success';

      setTimeout(() => {
        status.textContent = '';
      }, 5000);
    }, 1500);
  });
}
