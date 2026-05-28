// Aquatica — subtle scroll-reveal, smooth anchor scrolling, mobile nav, and accessible form feedback

(function () {
  'use strict';

  // Smooth scroll for in-page anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Reveal-on-scroll using IntersectionObserver
  var reveals = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { io.observe(el); });
  }

  // Mobile menu toggle
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.getElementById('primary-navigation');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navLinks.dataset.visible = String(!expanded);
    });

    navLinks.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.dataset.visible = 'false';
      });
    });
  }

  // Find-a-pool form feedback handler
  var form = document.querySelector('.search');
  var feedback = document.getElementById('pool-search-feedback');

  if (form && feedback) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input');
      var value = input && input.value.trim();

      if (!value) {
        feedback.textContent = 'Please enter a town, city, or postcode to search nearby pools.';
        return;
      }

      feedback.textContent = 'Searching pools near ' + value + '...';
    });
  }
})();
