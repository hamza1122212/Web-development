/* =============================================
   MARKIVO – Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar Scroll ───
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // ─── Hamburger Menu ───
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // ─── Mobile Dropdown Toggle ───
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        toggle.closest('.nav-dropdown').classList.toggle('open');
      }
    });
  });

  // ─── Active Nav Link ───
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath === href || currentPath.endsWith(href))) {
      link.classList.add('active');
    }
  });

  // ─── Scroll Reveal Animations ───
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ─── Counter Animation ───
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = performance.now();

        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          counter.textContent = current.toLocaleString() + suffix;
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            counter.textContent = target.toLocaleString() + suffix;
          }
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // ─── Contact Form AJAX ───
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('/contact', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        showFlash(data.message, data.status);
        if (data.status === 'success') contactForm.reset();
      } catch (err) {
        showFlash('Something went wrong. Please try again.', 'error');
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }

  // ─── Login Form ───
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = loginForm.querySelector('button[type="submit"]');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
      btn.disabled = true;

      try {
        const formData = new FormData(loginForm);
        const response = await fetch('/login', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        showFlash(data.message, data.status);
        if (data.status === 'success') {
          setTimeout(() => window.location.href = '/', 1000);
        }
      } catch (err) {
        showFlash('Something went wrong. Please try again.', 'error');
      } finally {
        btn.innerHTML = 'Sign In';
        btn.disabled = false;
      }
    });
  }

  // ─── Signup Form ───
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = signupForm.querySelector('#password').value;
      const confirm = signupForm.querySelector('#confirmPassword').value;

      if (password !== confirm) {
        showFlash('Passwords do not match.', 'error');
        return;
      }

      if (password.length < 8) {
        showFlash('Password must be at least 8 characters.', 'error');
        return;
      }

      const btn = signupForm.querySelector('button[type="submit"]');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
      btn.disabled = true;

      try {
        const formData = new FormData(signupForm);
        const response = await fetch('/signup', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        showFlash(data.message, data.status);
        if (data.status === 'success') {
          setTimeout(() => window.location.href = '/login', 1500);
        }
      } catch (err) {
        showFlash('Something went wrong. Please try again.', 'error');
      } finally {
        btn.innerHTML = 'Create Account';
        btn.disabled = false;
      }
    });
  }

  // ─── Flash Messages ───
  function showFlash(message, type = 'success') {
    let container = document.querySelector('.flash-messages');
    if (!container) {
      container = document.createElement('div');
      container.className = 'flash-messages';
      document.body.appendChild(container);
    }

    const msg = document.createElement('div');
    msg.className = `flash-msg ${type}`;
    msg.textContent = message;
    container.appendChild(msg);

    setTimeout(() => {
      msg.style.opacity = '0';
      msg.style.transform = 'translateX(40px)';
      setTimeout(() => msg.remove(), 300);
    }, 4000);
  }

  // ─── Smooth Scroll for Anchor Links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
