// Aquatica — nav toggle, animated stat counters, form feedback, scroll reveal

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Mobile nav
    const toggle = document.querySelector('.nav-toggle');
    const links = document.getElementById('primary-navigation');

    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const open = links.dataset.visible === 'true';
        links.dataset.visible = String(!open);
        toggle.setAttribute('aria-expanded', String(!open));
      });
      links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        links.dataset.visible = 'false';
        toggle.setAttribute('aria-expanded', 'false');
      }));
    }

    // Pool search feedback
    const search = document.querySelector('.search');
    const feedback = document.getElementById('pool-search-feedback');

    if (search && feedback) {
      search.addEventListener('submit', e => {
        e.preventDefault();
        const input = search.querySelector('input');
        const value = input.value.trim();
        feedback.textContent = value
          ? `Great news — we have coached sessions near "${value}". Book below and we'll confirm your nearest pool.`
          : 'Enter your town, city or postcode to find your nearest pool.';
      });
    }

    // CTA email form
    const ctaForm = document.querySelector('.cta-form');
    const ctaFeedback = document.querySelector('.cta-feedback');

    if (ctaForm && ctaFeedback) {
      ctaForm.addEventListener('submit', e => {
        e.preventDefault();
        const input = ctaForm.querySelector('input');
        if (!input.value.trim() || !input.checkValidity()) {
          ctaFeedback.textContent = 'Please enter a valid email address.';
          return;
        }
        ctaFeedback.textContent = 'Thank you — we’ll be in touch within one working day to arrange your first session.';
        ctaForm.reset();
      });
    }

    // Animated counters
    const counters = document.querySelectorAll('.stat-n[data-count]');
    const animate = el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    // Scroll reveal (also triggers counters)
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.querySelectorAll('.stat-n[data-count]').forEach(animate);
            if (entry.target.matches('.stat-n[data-count]')) animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      reveals.forEach(el => io.observe(el));
      counters.forEach(el => { if (!el.closest('.reveal')) io.observe(el); });
    } else {
      reveals.forEach(el => el.classList.add('visible'));
      counters.forEach(animate);
    }

    // Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
