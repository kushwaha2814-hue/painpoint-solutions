/* =========================================
    Painpoint Solution - Complete JavaScript
    ========================================= */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ── Elements ──────────────────────────────
    const header       = document.getElementById('header');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu      = document.querySelector('.nav-menu');
    const navLinks     = document.querySelectorAll('.nav-link');
    const backToTop    = document.getElementById('backToTop');
    const contactForm  = document.getElementById('contactForm');
    const yearSpan     = document.getElementById('year');

    // ── Year ──────────────────────────────────
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // ── Header scroll ─────────────────────────
    function handleScroll() {
        header.classList.toggle('scrolled', window.scrollY > 50);
        backToTop.classList.toggle('visible', window.scrollY > 500);
        updateActiveNavLink();
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ── Mobile menu ───────────────────────────
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function () {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ── Smooth scroll ─────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ── Active nav link ───────────────────────
    function updateActiveNavLink() {
        const sections  = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + header.offsetHeight + 100;
        sections.forEach(section => {
            const sectionTop    = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId     = section.getAttribute('id');
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ── Scroll reveal ─────────────────────────
    const revealSelectors = [
        '.card', '.service-card', '.concept-card', '.info-card',
        '.about-content', '.about-image', '.concepts-intro',
        '.pp-item', '.step-card', '.faq-item', '.cv-item'
    ].join(',');

    document.querySelectorAll(revealSelectors).forEach(el => {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.7s ease';
    });

    function revealOnScroll() {
        document.querySelectorAll(revealSelectors).forEach((el, index) => {
            const top = el.getBoundingClientRect().top;
            if (top < window.innerHeight - 80) {
                setTimeout(() => {
                    el.style.opacity   = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 60);
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // ═══════════════════════════════════════════
    // FAQ ACCORDION ★ NEW
    // ═══════════════════════════════════════════
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function () {
            const isActive = item.classList.contains('active');
            // Close all
            faqItems.forEach(f => f.classList.remove('active'));
            // Open clicked if it wasn't active
            if (!isActive) item.classList.add('active');
        });
    });

    // Open first FAQ by default
    if (faqItems.length > 0) faqItems[0].classList.add('active');

    // ── Contact form ──────────────────────────
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const name    = contactForm.querySelector('#name').value.trim();
            const email   = contactForm.querySelector('#email').value.trim();
            const mobile  = contactForm.querySelector('#mobile').value.trim();
            const message = contactForm.querySelector('#message').value.trim();

            if (!name || !email || !mobile || !message) {
                showNotification('Please fill in all fields.', 'error'); return;
            }
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error'); return;
            }
            if (!isValidMobile(mobile)) {
                showNotification('Please enter a valid mobile number.', 'error'); return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const origHtml  = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                const resp = await fetch(contactForm.getAttribute('action') || '/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, mobile, message, page: window.location.href })
                });
                const data = await resp.json();
                if (resp.ok) {
                    showNotification(data.message || 'Thank you! Your message has been sent.', 'success');
                    contactForm.reset();
                } else {
                    showNotification(data.message || 'Unable to send message. Please try again later.', 'error');
                }
            } catch (err) {
                showNotification('Network error. Please try again later.', 'error');
            }

            submitBtn.innerHTML = origHtml;
            submitBtn.disabled  = false;
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function isValidMobile(mobile) {
        return /^[\d\s\-+()]{10,}$/.test(mobile);
    }

    // ── Notification ──────────────────────────
    function showNotification(message, type = 'success') {
        document.querySelector('.notification')?.remove();
        const n = document.createElement('div');
        n.className = `notification notification-${type}`;
        n.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i><span>${message}</span>`;
        n.style.cssText = `
            position:fixed; top:100px; right:20px;
            background:${type === 'success' ? '#10b981' : '#ef4444'};
            color:white; padding:16px 24px; border-radius:12px;
            box-shadow:0 10px 30px rgba(0,0,0,.2);
            display:flex; align-items:center; gap:12px;
            z-index:10000; font-weight:500;
            transform:translateX(120%); transition:transform .4s ease;
            max-width:400px;
        `;
        document.body.appendChild(n);
        setTimeout(() => { n.style.transform = 'translateX(0)'; }, 100);
        setTimeout(() => {
            n.style.transform = 'translateX(120%)';
            setTimeout(() => n.remove(), 400);
        }, 5000);
    }

    // ── Counter animation ─────────────────────
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el   = entry.target;
            const text = el.textContent;
            const num  = parseInt(text);
            if (!isNaN(num) && num > 0) animateValue(el, 0, num, 1800);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(s => observer.observe(s));

    function animateValue(el, start, end, duration) {
        let startTs = null;
        const suffix = el.textContent.replace(/[0-9]/g, '');
        const step = ts => {
            if (!startTs) startTs = ts;
            const progress = Math.min((ts - startTs) / duration, 1);
            el.textContent = Math.floor(progress * (end - start) + start) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    // ── Parallax hero ─────────────────────────
    const heroBgImg = document.querySelector('.hero-bg img');
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        if (heroBgImg && scrolled < window.innerHeight) {
            heroBgImg.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
    });

    console.log('Painpoint Solution — website loaded!');
});
