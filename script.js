// Echo Web Works — interactive bits

// Lucide icons
window.addEventListener('DOMContentLoaded', () => {
    const lucide = window.lucide || (typeof self !== 'undefined' ? self.lucide : null);
    if (lucide?.createIcons) {
        lucide.createIcons();
    }

    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    const setTheme = (mode) => {
        if (mode === 'light') {
            document.body.classList.add('light');
            themeToggle.textContent = 'Dark mode';
        } else {
            document.body.classList.remove('light');
            themeToggle.textContent = 'Light mode';
        }
        localStorage.setItem('theme', mode);
    };

    if (savedTheme === 'light') {
        setTheme('light');
    } else {
        setTheme('dark');
    }

    themeToggle?.addEventListener('click', () => {
        setTheme(document.body.classList.contains('light') ? 'dark' : 'light');
    });

    // Year
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // FAQ accordion
    document.querySelectorAll('.faq-item').forEach((item) => {
        const btn = item.querySelector('.faq-q');
        btn ?.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach((o) => o.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });

    // Page-wide mouse-follow glow
    const root = document.documentElement;
    const body = document.body;

    document.addEventListener('mousemove', (e) => {
        root.style.setProperty('--mx', `${e.clientX}px`);
        root.style.setProperty('--my', `${e.clientY}px`);
        body.classList.add('glow-active');
    });

    window.addEventListener('mouseout', (e) => {
        if (!e.relatedTarget && !e.toElement) {
            body.classList.remove('glow-active');
        }
    });

    // Scroll reveal
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
});