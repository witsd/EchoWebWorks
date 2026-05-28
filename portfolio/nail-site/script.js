document.addEventListener('DOMContentLoaded', () => {
  const services = [
    { img: 'images/svc1.jpg', title: 'Classic Manicure', price: '$25', desc: 'Shaping, cuticle care, and a flawless polish finish.' },
    { img: 'images/svc2.jpg', title: 'Gel Polish', price: '$40', desc: 'Premium long-lasting gel with a glossy shine.' },
    { img: 'images/svc3.jpg', title: 'Color Change', price: '$15', desc: 'Refresh your look with a fresh color change.' },
    { img: 'images/svc4.jpg', title: 'Nail Art & Design', price: '$55', desc: 'Custom hand-painted looks for every style.' },
  ];

  const grid = document.getElementById('services-grid');
  if (grid) {
    grid.innerHTML = services
      .map(service => `
        <article class="service-card reveal">
          <div class="img-wrap"><img src="${service.img}" alt="${service.title}" loading="lazy" /></div>
          <h3>${service.title}</h3>
          <p class="desc">${service.desc}</p>
          <p class="price">${service.price}</p>
        </article>
      `)
      .join('');
  }

  const menuBtn = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const header = document.querySelector('.site-header');

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

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', event => {
      if (!mobileNav.contains(event.target) && !menuBtn.contains(event.target) && mobileNav.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  const form = document.querySelector('.contact-form');
  const messageEl = document.querySelector('.form-message');

  if (form && messageEl) {
    const nameField = form.querySelector('#name');
    const emailField = form.querySelector('#email');
    const messageField = form.querySelector('#message');

    const showMessage = (text, success = false) => {
      messageEl.textContent = text;
      messageEl.classList.toggle('success', success);
    };

    const validateFields = () => {
      let valid = true;

      [nameField, emailField, messageField].forEach(field => {
        if (!field || !field.value.trim()) {
          field?.setAttribute('aria-invalid', 'true');
          valid = false;
        } else {
          field?.removeAttribute('aria-invalid');
        }
      });

      if (emailField && emailField.value.trim()) {
        const isEmailValid = emailField.checkValidity();
        if (!isEmailValid) {
          emailField.setAttribute('aria-invalid', 'true');
          valid = false;
        }
      }

      return valid;
    };

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!validateFields()) {
        showMessage('Please complete all fields and enter a valid email address.', false);
        return;
      }
      showMessage('Thank you! Your request has been received. Natalia will contact you soon.', true);
      form.reset();
      [nameField, emailField, messageField].forEach(field => field?.removeAttribute('aria-invalid'));
    });

    [nameField, emailField, messageField].forEach(field => {
      field?.addEventListener('input', () => {
        field.removeAttribute('aria-invalid');
        if (messageEl.classList.contains('success')) {
          messageEl.textContent = '';
          messageEl.classList.remove('success');
        }
      });
    });
  }

  const testimonials = [
    { quote: 'Natalia created the most elegant nails I have ever had. Every visit feels calm, precise, and polished to last.', author: '— Maria, Lukovit' },
    { quote: 'The details are incredible, and the result lasted even longer than expected.', author: '— Elena, Sofia' },
    { quote: 'A relaxing experience from start to finish, with gentle care and beautiful design.', author: '— Viki, Veliko Tarnovo' },
    { quote: 'I felt welcome and well looked after. The shine stayed perfect for weeks.', author: '— Nina, Lovech' },
  ];

  let testimonialIndex = 0;
  const quoteEl = document.getElementById('testimonial-quote');
  const authorEl = document.getElementById('testimonial-author');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  let testimonialTimer;

  const updateTestimonial = index => {
    const item = testimonials[index];
    if (!item || !quoteEl || !authorEl) return;
    quoteEl.textContent = item.quote;
    authorEl.textContent = item.author;
  };

  const showTestimonial = direction => {
    testimonialIndex = (testimonialIndex + direction + testimonials.length) % testimonials.length;
    updateTestimonial(testimonialIndex);
  };

  const resetTestimonialTimer = () => {
    clearInterval(testimonialTimer);
    testimonialTimer = setInterval(() => showTestimonial(1), 6000);
  };

  if (prevBtn && nextBtn && quoteEl && authorEl) {
    prevBtn.addEventListener('click', () => {
      showTestimonial(-1);
      resetTestimonialTimer();
    });

    nextBtn.addEventListener('click', () => {
      showTestimonial(1);
      resetTestimonialTimer();
    });

    updateTestimonial(testimonialIndex);
    resetTestimonialTimer();
  }

  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }
});
