/* ================================================================
   STELLAR LOGIN — Interactive Logic & Canvas Animations
   Shared by index.html (login) and register.html (sign-up)
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  let isSubmitting = false;

  setupStarfield();
  setupParticles();
  setupPasswordToggles();
  setupInputFocusClasses();
  setupParallax();
  setupForms();

  // ──────────────────────────────────────────
  // 1. STARFIELD CANVAS (DPI-aware)
  // ──────────────────────────────────────────
  function setupStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const stars = [];
    const STAR_COUNT = 220;
    let viewW = 0, viewH = 0;

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      viewW = window.innerWidth;
      viewH = window.innerHeight;
      canvas.width = Math.floor(viewW * dpr);
      canvas.height = Math.floor(viewH * dpr);
      canvas.style.width = viewW + 'px';
      canvas.style.height = viewH + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * viewW,
          y: Math.random() * viewH,
          radius: Math.random() * 1.4 + 0.3,
          opacity: Math.random() * 0.6 + 0.15,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 0.08,
          driftY: (Math.random() - 0.5) * 0.04,
        });
      }
    }

    function drawStars(timestamp) {
      ctx.clearRect(0, 0, viewW, viewH);
      const t = timestamp * 0.001;

      for (const star of stars) {
        const twinkle = Math.sin(t * star.twinkleSpeed * 60 + star.twinklePhase);
        const alpha = star.opacity + twinkle * 0.2;

        star.x += star.driftX;
        star.y += star.driftY;

        if (star.x < 0) star.x = viewW;
        if (star.x > viewW) star.x = 0;
        if (star.y < 0) star.y = viewH;
        if (star.y > viewH) star.y = 0;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 220, 160, ${Math.max(0.05, alpha)})`;
        ctx.fill();

        if (star.radius > 1.0) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220, 180, 80, ${Math.max(0, alpha * 0.08)})`;
          ctx.fill();
        }
      }

      requestAnimationFrame(drawStars);
    }

    resizeCanvas();
    initStars();
    requestAnimationFrame(drawStars);
    window.addEventListener('resize', () => { resizeCanvas(); initStars(); });
  }

  // ──────────────────────────────────────────
  // 2. FLOATING PARTICLES (uses --drift per particle)
  // ──────────────────────────────────────────
  function setupParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const PARTICLE_COUNT = 35;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const size = Math.random() * 2.5 + 1;
      const left = Math.random() * 100;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * 20;
      const opacity = Math.random() * 0.5 + 0.2;
      const drift = (Math.random() - 0.5) * 80;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${left}%`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.opacity = opacity;
      particle.style.setProperty('--drift', `${drift}px`);

      container.appendChild(particle);
    }
  }

  // ──────────────────────────────────────────
  // 3. PASSWORD TOGGLES (works for any count)
  // ──────────────────────────────────────────
  function setupPasswordToggles() {
    const eyeOpen = `
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    `;
    const eyeClosed = `
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    `;

    document.querySelectorAll('.password-toggle').forEach(btn => {
      const wrapper = btn.closest('.input-wrapper');
      if (!wrapper) return;
      const field = wrapper.querySelector('input');
      const eye = btn.querySelector('svg');
      if (!field || !eye) return;

      let visible = false;
      btn.addEventListener('click', () => {
        visible = !visible;
        field.type = visible ? 'text' : 'password';
        eye.innerHTML = visible ? eyeClosed : eyeOpen;
      });
    });
  }

  // ──────────────────────────────────────────
  // 4. FOCUS CLASS (drives .input-wrapper.focused)
  // ──────────────────────────────────────────
  function setupInputFocusClasses() {
    document.querySelectorAll('.input-wrapper input').forEach(input => {
      input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
      input.addEventListener('blur', () => input.parentElement.classList.remove('focused'));
    });
  }

  // ──────────────────────────────────────────
  // 5. SUBTLE PARALLAX ON CARD (mouse tracking)
  // ──────────────────────────────────────────
  function setupParallax() {
    const card = document.querySelector('.login-card');
    if (!card) return;

    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      card.style.transform =
        `perspective(1200px) rotateX(${-dy * 2}deg) rotateY(${dx * 2.5}deg)`;
    });

    document.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    });
  }

  // ──────────────────────────────────────────
  // 6. FORM WIRING (login + register)
  // ──────────────────────────────────────────
  function setupForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm) setupLogin(loginForm);
    if (registerForm) setupRegister(registerForm);
  }

  function setupLogin(form) {
    const btn = form.querySelector('.btn-signin');
    const emailEl = document.getElementById('email');
    const pwdEl = document.getElementById('password');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      let valid = true;
      if (!emailEl.value.trim() || !isValidEmail(emailEl.value.trim())) {
        shakeInput(emailEl); valid = false;
      }
      if (!pwdEl.value) {
        shakeInput(pwdEl); valid = false;
      }
      if (!valid) return;

      isSubmitting = true;
      runLiquidSequence(btn, '✓ Signed In!', 'Sign In', () => {
        // TODO: window.location.href = '/dashboard';
      });
    });
  }

  function setupRegister(form) {
    const btn = form.querySelector('.btn-signin');
    const nameEl = document.getElementById('fullname');
    const emailEl = document.getElementById('email');
    const pwdEl = document.getElementById('password');
    const confirmEl = document.getElementById('confirm');
    const termsEl = document.getElementById('terms');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      let valid = true;
      if (!nameEl.value.trim()) { shakeInput(nameEl); valid = false; }

      const email = emailEl.value.trim();
      if (!email || !isValidEmail(email)) { shakeInput(emailEl); valid = false; }

      if (pwdEl.value.length < 8) { shakeInput(pwdEl); valid = false; }

      if (confirmEl.value !== pwdEl.value || !confirmEl.value) {
        shakeInput(confirmEl); valid = false;
      }

      if (!termsEl.checked) {
        const check = termsEl.closest('.remember-me');
        if (check) check.style.color = 'var(--danger)';
        valid = false;
      }

      if (!valid) return;

      isSubmitting = true;
      runLiquidSequence(btn, '✓ Account Created!', 'Create Account', () => {
        // TODO: window.location.href = '/welcome';
      });
    });

    // Clear the danger tint once the user agrees
    termsEl.addEventListener('change', () => {
      const check = termsEl.closest('.remember-me');
      if (check) check.style.color = '';
    });
  }

  // Shared loading → success → reset sequence
  function runLiquidSequence(btn, successText, defaultLabel, onComplete) {
    btn.classList.add('loading');

    setTimeout(() => {
      btn.classList.remove('loading');
      btn.classList.add('success');
      const txt = btn.querySelector('.btn-text');
      if (txt) txt.textContent = successText;

      const card = document.querySelector('.login-card');
      if (card) {
        card.style.boxShadow =
          '0 8px 32px rgba(0,0,0,0.50), 0 0 50px rgba(22,163,74,0.20), inset 0 1px 0 rgba(200,210,255,0.06)';
      }

      setTimeout(() => {
        if (card) card.style.boxShadow = '';
        if (onComplete) onComplete();

        setTimeout(() => {
          btn.classList.remove('success');
          if (txt) txt.textContent = defaultLabel;
          isSubmitting = false;
        }, 500);
      }, 1200);
    }, 1400);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeInput(inputEl) {
    inputEl.style.borderColor = 'var(--danger)';
    inputEl.style.animation = 'shake 0.4s ease';
    inputEl.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.15)';

    setTimeout(() => {
      inputEl.style.borderColor = '';
      inputEl.style.animation = '';
      inputEl.style.boxShadow = '';
    }, 1200);
  }

  // Inject shake keyframes once
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(5px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(3px); }
    }
  `;
  document.head.appendChild(shakeStyle);
});
