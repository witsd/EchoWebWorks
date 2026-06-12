document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const menuBtn = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (menuBtn && mobileNav) {
    const closeMenu = () => {
      menuBtn.classList.remove('open');
      mobileNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    };

    menuBtn.addEventListener('click', () => {
      const isOpen = !menuBtn.classList.contains('open');
      menuBtn.classList.toggle('open');
      mobileNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
    });

    mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  }

  // Testimonial rotation
  const testimonials = [
    { quote: '“Natalia created the most elegant nails I have ever had. Every visit feels calm, precise, and polished to last.”', author: 'Maria — Lukovit' },
    { quote: '“The details are incredible, and the result lasted even longer than expected.”', author: 'Elena — Sofia' },
    { quote: '“A relaxing experience from start to finish, with gentle care and beautiful design.”', author: 'Viki — Veliko Tarnovo' },
    { quote: '“I felt welcome and well looked after. The shine stayed perfect for weeks.”', author: 'Nina — Lovech' },
  ];

  const quoteEl = document.getElementById('testimonial-quote');
  const authorEl = document.getElementById('testimonial-author');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dotsEl = document.getElementById('quote-dots');
  let index = 0;
  let timer;

  const render = () => {
    if (!quoteEl || !authorEl) return;
    quoteEl.textContent = testimonials[index].quote;
    authorEl.textContent = testimonials[index].author;
    if (dotsEl) {
      dotsEl.querySelectorAll('i').forEach((dot, i) => dot.classList.toggle('on', i === index));
    }
  };

  const step = dir => {
    index = (index + dir + testimonials.length) % testimonials.length;
    render();
  };

  const resetTimer = () => {
    clearInterval(timer);
    timer = setInterval(() => step(1), 6500);
  };

  if (quoteEl && authorEl && prevBtn && nextBtn) {
    if (dotsEl) {
      dotsEl.innerHTML = testimonials.map(() => '<i></i>').join('');
    }
    prevBtn.addEventListener('click', () => { step(-1); resetTimer(); });
    nextBtn.addEventListener('click', () => { step(1); resetTimer(); });
    render();
    resetTimer();
  }

  // Form validation
  const form = document.querySelector('.visit-form');
  const messageEl = document.querySelector('.form-message');

  if (form && messageEl) {
    const fields = ['#name', '#email', '#message'].map(sel => form.querySelector(sel));

    form.addEventListener('submit', event => {
      event.preventDefault();
      let valid = true;
      fields.forEach(field => {
        const bad = !field.value.trim() || (field.type === 'email' && !field.checkValidity());
        field.toggleAttribute('aria-invalid', bad);
        if (bad) valid = false;
      });
      if (!valid) {
        messageEl.textContent = 'Please complete all fields with a valid email address.';
        messageEl.classList.remove('success');
        return;
      }
      messageEl.textContent = 'Thank you — your request has been received. Natalia will contact you soon.';
      messageEl.classList.add('success');
      form.reset();
      fields.forEach(field => field.removeAttribute('aria-invalid'));
    });

    fields.forEach(field => field.addEventListener('input', () => field.removeAttribute('aria-invalid')));
  }

  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }
});
