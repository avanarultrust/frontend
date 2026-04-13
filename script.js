import { API_URL } from './config.js';

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile Nav Toggle =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('open');
  });
});

// ===== Hero Carousel =====
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
let currentSlide = 0;
let slideInterval;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  indicators[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  indicators[currentSlide].classList.add('active');
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function prevSlide() {
  goToSlide(currentSlide - 1);
}

function startAutoplay() {
  slideInterval = setInterval(nextSlide, 5000);
}

function stopAutoplay() {
  clearInterval(slideInterval);
}

// Arrow buttons
document.getElementById('hero-next').addEventListener('click', () => {
  stopAutoplay();
  nextSlide();
  startAutoplay();
});

document.getElementById('hero-prev').addEventListener('click', () => {
  stopAutoplay();
  prevSlide();
  startAutoplay();
});

// Indicator clicks
indicators.forEach(indicator => {
  indicator.addEventListener('click', () => {
    stopAutoplay();
    goToSlide(parseInt(indicator.dataset.slide));
    startAutoplay();
  });
});

// Touch/swipe support for hero
let touchStartX = 0;
let touchEndX = 0;
const heroEl = document.getElementById('hero');

heroEl.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

heroEl.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    stopAutoplay();
    if (diff > 0) nextSlide();
    else prevSlide();
    startAutoplay();
  }
}, { passive: true });

startAutoplay();

// ===== Animated Counter =====
function animateCounter(el, target) {
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ===== Scroll Reveal & Counter Trigger =====
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px'
};

// Reveal animations
const revealElements = document.querySelectorAll('.about-section, .mission-section, .program-card, .force-section, .cta-section');
revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, observerOptions);

revealElements.forEach(el => revealObserver.observe(el));

// Counter animations
const counterElements = document.querySelectorAll('.stat-number, .force-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      const target = parseInt(entry.target.dataset.target);
      animateCounter(entry.target, target);
    }
  });
}, { threshold: 0.5 });

counterElements.forEach(el => counterObserver.observe(el));

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
});

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return; // skip bare '#' links
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.offsetTop - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== LOGIN SYSTEM =====
const loginModal = document.getElementById('login-modal');
const btnLogin = document.getElementById('btn-login');
const modalClose = document.getElementById('modal-close');
const modalOverlay = document.getElementById('login-modal');
const modalTabs = document.querySelectorAll('.modal-tab');
const formContainers = document.querySelectorAll('.modal-form-container');

// Open Modal
let openModalHandler = function (e) {
  if (e) e.preventDefault();
  loginModal.classList.add('active');
};

if (btnLogin) {
  btnLogin.addEventListener('click', openModalHandler);
}

// Close Modal
if (modalClose) {
  modalClose.addEventListener('click', () => {
    loginModal.classList.remove('active');
  });
}

// Close on overlay click
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      loginModal.classList.remove('active');
    }
  });
}

// Toggle Tabs
modalTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    modalTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    formContainers.forEach(fc => fc.classList.remove('active'));
    const target = tab.getAttribute('data-target');
    document.getElementById(`${target}-form`).classList.add('active');
  });
});

// Auth Helpers
function showMessage(elementId, message, type) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.className = `auth-message ${type}`;
  setTimeout(() => {
    el.style.display = 'none';
    el.className = 'auth-message';
  }, 5000);
}

// Register Handlers
const registerForm = document.getElementById('form-register');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const mobile = document.getElementById('register-mobile').value;
    const password = document.getElementById('register-password').value;

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, mobile, password })
      });
      const data = await response.json();

      if (!response.ok) {
        showMessage('register-message', data.message || 'Registration failed', 'error');
      } else {
        showMessage('register-message', 'Registration successful! Please sign in.', 'success');
        registerForm.reset();
        setTimeout(() => {
          document.querySelector('[data-target="sign-in"]').click();
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      showMessage('register-message', 'Server error. Try again later.', 'error');
    }
  });
}

// Login Handlers
const loginForm = document.getElementById('form-login');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        showMessage('login-message', data.message || 'Invalid credentials', 'error');
      }
      if (response.ok) {
        showMessage('login-message', 'Login successful! Redirecting...', 'success');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setTimeout(() => {
          loginModal.classList.remove('active');
          updateNavForUser(data.user);
          
          // Use absolute path for robustness
          const redirectPath = data.user.email === 'avanarultrust@gmail.com' ? '/admin.html' : '/profile.html';
          window.location.href = window.location.origin + redirectPath;
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      showMessage('login-message', 'Server error. Try again later.', 'error');
    }
  });
}

// Forgot Password Handlers
const forgotPasswordLink = document.getElementById('forgot-password-link');
const backToLoginLink = document.getElementById('back-to-login-link');
const forgotPasswordForm = document.getElementById('form-forgot');

if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    formContainers.forEach(fc => fc.classList.remove('active'));
    document.getElementById('forgot-password-form').classList.add('active');
    document.querySelector('.modal-tabs').style.display = 'none';
  });
}

if (backToLoginLink) {
  backToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    formContainers.forEach(fc => fc.classList.remove('active'));
    document.getElementById('sign-in-form').classList.add('active');
    document.querySelector('.modal-tabs').style.display = 'flex';
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;

    try {
      const response = await fetch(`${API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();

      if (!response.ok) {
        showMessage('forgot-message', data.message || 'Error processing request', 'error');
      } else {
        showMessage('forgot-message', 'Recovery email sent! Check your inbox.', 'success');
        forgotPasswordForm.reset();
      }
    } catch (error) {
      console.error(error);
      showMessage('forgot-message', 'Server error. Try again later.', 'error');
    }
  });
}

// Initial Setup
  checkUserSession();
  fetchJourneyProjects();
  initMobileBottomNav();

// ===== Mobile Bottom Nav Intelligence =====
function initMobileBottomNav() {
  const profileBtn = document.getElementById('mobile-profile-link');
  if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
      if (!token) {
        // Not logged in -> Open Modal
        if (typeof openModalHandler === 'function') {
          openModalHandler(e);
        } else {
          document.getElementById('login-modal').classList.add('active');
        }
      } else {
        // Logged in -> Go to Profile (this handler will be overridden by updateNavForUser if session is checked)
        const user = JSON.parse(localStorage.getItem('user'));
        const redirectPath = user && user.email === 'avanarultrust@gmail.com' ? '/admin.html' : '/profile.html';
        window.location.href = window.location.origin + redirectPath;
      }
    });
  }
}

// Check Session & Update UI
async function checkUserSession() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) return;

  try {
    const res = await fetch(`${API_URL}/api/verify`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    
    if (data.valid) {
      updateNavForUser(data.user);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  } catch (err) {
    console.error('Session check failed');
  }
}

// Update Nav for User
function updateNavForUser(user) {
  const desktopLoginBtn = document.getElementById('btn-login');
  const mobileProfileBtn = document.getElementById('mobile-profile-link');
  
  const redirectPath = user.email === 'avanarultrust@gmail.com' ? '/admin.html' : '/profile.html';
  const fullUrl = window.location.origin + redirectPath;

  // Update Desktop Nav
  if (desktopLoginBtn) {
    desktopLoginBtn.textContent = 'Profile';
    desktopLoginBtn.classList.add('logged-in');
    desktopLoginBtn.removeEventListener('click', openModalHandler);
    desktopLoginBtn.onclick = (e) => {
      e.preventDefault();
      window.location.href = fullUrl;
    };
  }

  // Update Mobile Nav
  if (mobileProfileBtn) {
    mobileProfileBtn.classList.add('active-user');
    mobileProfileBtn.onclick = (e) => {
      e.preventDefault();
      window.location.href = fullUrl;
    };
  }
}

// Fetch Journey Projects
async function fetchJourneyProjects() {
  const container = document.getElementById('journey-container');
  if (!container) return;

  try {
    const response = await fetch(`${API_URL}/api/projects`);
    const projects = await response.json();

    if (projects.length === 0) {
      container.innerHTML = '<p class="loading-journey">Our journey is just beginning. Stay tuned for updates!</p>';
      return;
    }

    container.innerHTML = projects.map(p => {
      const mainImg = p.images[0] || 'https://images.unsplash.com/photo-1541339905195-4360e7746c70?auto=format&fit=crop&w=600&q=80';
      const fullImgUrl = mainImg.startsWith('http') ? mainImg : `${API_URL}${mainImg}`;
      
      return `
      <a href="/project.html?id=${p._id}" class="journey-card-link">
        <article class="journey-card reveal">
          <div class="journey-image-wrapper">
            <img src="${fullImgUrl}" alt="${p.title}" class="journey-image">
            ${p.images.length > 1 ? `
              <div class="journey-badge">
                <i class="fas fa-images"></i>
                ${p.images.length} Photos
              </div>
            ` : ''}
          </div>
          <div class="journey-content">
            <div class="journey-date">${new Date(p.date).toLocaleDateString('en-IN', {month: 'long', year: 'numeric'})}</div>
            <h3 class="journey-title">${p.title}</h3>
            <p class="journey-desc">${p.description}</p>
            <span class="journey-view-more">View Details <i class="fas fa-arrow-right"></i></span>
          </div>
        </article>
      </a>
      `;
    }).join('');

    // Trigger reveal animation for dynamic content
    setTimeout(() => {
      const reveals = container.querySelectorAll('.reveal');
      reveals.forEach(r => r.classList.add('active'));
    }, 100);

  } catch (error) {
    console.error('Journey fetch error:', error);
    container.innerHTML = '<p class="loading-journey">Unable to load our journey at this moment.</p>';
  }
}

