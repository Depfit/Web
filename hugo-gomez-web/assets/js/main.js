/* ================================================================
   HUGO GÓMEZ SALGADO — main.js
   Navbar · Mobile menu · Scroll animations · Counter · Parallax
   ================================================================ */

(function () {
  'use strict';

  /* ---- Navbar scroll ------------------------------------------ */
  const navbar = document.getElementById('navbar');
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });


  /* ---- Mobile menu -------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menú');
      });
    });

    /* Close on outside click */
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }


  /* ---- Smooth scroll for anchor links ------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const hash = this.getAttribute('href');
      if (hash === '#') return;
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ---- Scroll reveal ------------------------------------------ */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  function addReveal(selectors) {
    selectors.forEach((sel, si) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('reveal');
        /* Stagger siblings within the same group */
        if (i > 0 && i <= 4) {
          el.classList.add(`reveal-d${i}`);
        }
        revealObserver.observe(el);
      });
    });
  }

  addReveal([
    '.stat-item',
    '.about-content',
    '.about-visual',
    '.project-card',
    '.expertise-card',
    '.ig-item',
    '.contact-block',
    '.section-header',
  ]);


  /* ---- Number counter ----------------------------------------- */
  const counterObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-num').forEach(el => {
    counterObserver.observe(el);
  });

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const isPlus = el.classList.contains('stat-plus');
    if (isNaN(target)) return;

    const duration = 1400;
    const frameTime = 16;
    const totalFrames = Math.round(duration / frameTime);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      /* Ease-out: faster at start, slow at end */
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      const current = Math.round(target * progress);
      el.textContent = current + (isPlus ? '+' : '');

      if (frame >= totalFrames) {
        el.textContent = target + (isPlus ? '+' : '');
        clearInterval(timer);
      }
    }, frameTime);
  }


  /* ---- Subtle hero grid parallax ------------------------------ */
  const heroGrid = document.querySelector('.hero-grid');
  if (heroGrid) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroGrid.style.transform = `translateY(${window.scrollY * 0.28}px)`;
      }
    }, { passive: true });
  }

})();
