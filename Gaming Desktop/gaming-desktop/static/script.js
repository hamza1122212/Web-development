/* ============================================
   Gaming Desktop – Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar Scroll ---------- */
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  /* ---------- Hamburger Menu ---------- */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-menu > li > a:not(.dropdown-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      navMenu?.classList.remove('active');
    });
  });

  /* ---------- Mobile Dropdown Toggle ---------- */
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        toggle.closest('.dropdown')?.classList.toggle('active');
      }
    });
  });

  /* ---------- Scroll Reveal Animation ---------- */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------- Cart System ---------- */
  let cart = JSON.parse(localStorage.getItem('gamingCart')) || [];

  function saveCart() {
    localStorage.setItem('gamingCart', JSON.stringify(cart));
    updateCartUI();
  }

  function updateCartUI() {
    // Update all cart count badges
    document.querySelectorAll('.cart-count').forEach(badge => {
      const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    });
    renderCartItems();
  }

  function addToCart(name, price, emoji) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price: parseFloat(price), qty: 1, emoji: emoji || '🎮' });
    }
    saveCart();
    showToast(`${name} added to cart!`);
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
  }

  function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <i class="fas fa-shopping-bag"></i>
          <p>Your cart is empty</p>
        </div>`;
    } else {
      cartItemsContainer.innerHTML = cart.map((item, i) => `
        <div class="cart-item">
          <div class="cart-item-image">${item.emoji}</div>
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <p class="price">$${item.price.toFixed(2)} × ${item.qty}</p>
          </div>
          <button class="cart-item-remove" data-index="${i}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>`).join('');

      cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          removeFromCart(parseInt(btn.dataset.index));
        });
      });
    }

    // Update total
    const totalEl = document.querySelector('.total-price');
    if (totalEl) {
      const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      totalEl.textContent = `$${total.toFixed(2)}`;
    }
  }

  // Expose addToCart globally
  window.addToCart = addToCart;

  // Add to cart button listeners
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = btn.dataset.name;
      const price = btn.dataset.price;
      const emoji = btn.dataset.emoji || '🎮';
      addToCart(name, price, emoji);
    });
  });

  /* ---------- Cart Sidebar ---------- */
  const cartToggle = document.querySelector('.nav-cart');
  const cartOverlay = document.querySelector('.cart-overlay');
  const cartSidebar = document.querySelector('.cart-sidebar');
  const cartClose = document.querySelector('.cart-close');

  function openCart() {
    cartOverlay?.classList.add('active');
    cartSidebar?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartOverlay?.classList.remove('active');
    cartSidebar?.classList.remove('active');
    document.body.style.overflow = '';
  }

  cartToggle?.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
  cartOverlay?.addEventListener('click', closeCart);
  cartClose?.addEventListener('click', closeCart);

  // Initialize cart UI
  updateCartUI();

  /* ---------- Product Filtering ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.category;

      productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
          card.style.animation = 'fade-in-up 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ---------- Toast Notification ---------- */
  function showToast(message) {
    // Remove existing toast
    document.querySelector('.toast')?.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => { toast.classList.add('show'); });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  window.showToast = showToast;

  /* ---------- Newsletter Form ---------- */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]');
      if (email?.value) {
        showToast('Thank you for subscribing!');
        email.value = '';
      }
    });
  });

  /* ---------- Contact Form ---------- */
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    let valid = true;

    for (const [key, value] of formData.entries()) {
      if (!value.trim()) { valid = false; break; }
    }

    if (valid) {
      showToast('Message sent successfully!');
      contactForm.reset();
    } else {
      showToast('Please fill in all fields.');
    }
  });

  /* ---------- Login Form ---------- */
  const loginForm = document.getElementById('loginForm');
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]')?.value;
    const pass = loginForm.querySelector('input[type="password"]')?.value;

    if (email && pass) {
      showToast('Login successful! Redirecting...');
      setTimeout(() => { window.location.href = '/'; }, 1500);
    } else {
      showToast('Please fill in all fields.');
    }
  });

  /* ---------- Signup Form ---------- */
  const signupForm = document.getElementById('signupForm');
  signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = signupForm.querySelectorAll('input[required]');
    let valid = true;
    inputs.forEach(input => { if (!input.value.trim()) valid = false; });

    const pass = signupForm.querySelector('#password')?.value;
    const confirm = signupForm.querySelector('#confirmPassword')?.value;

    if (!valid) {
      showToast('Please fill in all fields.');
    } else if (pass !== confirm) {
      showToast('Passwords do not match.');
    } else {
      showToast('Account created! Redirecting...');
      setTimeout(() => { window.location.href = '/login'; }, 1500);
    }
  });

  /* ---------- Smooth Scroll for Anchors ---------- */
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
