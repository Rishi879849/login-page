/* ================================================================
   STELLAR REGISTRATION — Custom Select, Validation & Formatters
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────────────
  // 1. PASSWORD & CONFIRM PASSWORD TOGGLES
  // ──────────────────────────────────────────
  function setupPasswordToggle(inputId, toggleId) {
    const inputField = document.getElementById(inputId);
    const toggleBtn = document.getElementById(toggleId);
    if (!inputField || !toggleBtn) return;

    const eyeOpenSVG = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="eyeIcon">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    `;

    const eyeClosedSVG = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="eyeIcon">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>
    `;

    let visible = false;
    toggleBtn.addEventListener('click', () => {
      visible = !visible;
      inputField.type = visible ? 'text' : 'password';
      toggleBtn.innerHTML = visible ? eyeClosedSVG : eyeOpenSVG;
    });
  }

  setupPasswordToggle('password', 'togglePassword');
  setupPasswordToggle('confirmPassword', 'toggleConfirmPassword');


  // ──────────────────────────────────────────
  // 2. MOBILE NUMBER AUTO-FORMATTING (+1 (XXX) XXX-XXXX)
  // ──────────────────────────────────────────
  const mobileInput = document.getElementById('mobile');
  if (mobileInput) {
    mobileInput.addEventListener('input', (e) => {
      let inputVal = e.target.value.replace(/\D/g, ''); // Extract all digits
      
      // If the digits start with '1' (due to +1 prefix), strip it to format the 10-digit number
      if (inputVal.startsWith('1')) {
        inputVal = inputVal.substring(1);
      }

      let formatted = '';
      if (inputVal.length > 0) {
        // Build format step-by-step
        formatted = '+1 ';
        if (inputVal.length <= 3) {
          formatted += `(${inputVal}`;
        } else if (inputVal.length <= 6) {
          formatted += `(${inputVal.substring(0, 3)}) ${inputVal.substring(3)}`;
        } else {
          formatted += `(${inputVal.substring(0, 3)}) ${inputVal.substring(3, 6)}-${inputVal.substring(6, 10)}`;
        }
      }
      
      e.target.value = formatted;
    });
  }


  // ──────────────────────────────────────────
  // 3. REAL-TIME PASSWORD STRENGTH METER
  // ──────────────────────────────────────────
  const passwordField = document.getElementById('password');
  const strengthFill = document.getElementById('strengthFill');
  const strengthLabel = document.getElementById('strengthLabel');
  const strengthWarning = document.getElementById('strengthWarning');

  if (passwordField && strengthFill && strengthLabel && strengthWarning) {
    passwordField.addEventListener('input', () => {
      const val = passwordField.value;
      const analysis = evaluatePassword(val);

      // Update Fill width & color
      strengthFill.style.width = analysis.width;
      strengthFill.style.backgroundColor = analysis.color;
      
      // Update Texts
      strengthLabel.textContent = analysis.label;
      strengthLabel.style.color = analysis.color;
      strengthWarning.textContent = analysis.warning;
    });
  }

  function evaluatePassword(pwd) {
    if (!pwd) {
      return { width: '0%', color: 'transparent', label: 'Weak', warning: 'Must be 8+ characters' };
    }

    if (pwd.length < 8) {
      return { 
        width: '25%', 
        color: '#ef4444', // Red
        label: 'Weak', 
        warning: 'Must be at least 8 characters' 
      };
    }

    // Criteria checks
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumbers = /\d/.test(pwd);
    const hasNonalphas = /\W/.test(pwd);

    const score = [hasUpperCase, hasLowerCase, hasNumbers, hasNonalphas].filter(Boolean).length;

    if (score <= 2) {
      return {
        width: '50%',
        color: '#f97316', // Orange
        label: 'Medium',
        warning: 'Add uppercase letters, numbers, or symbols'
      };
    } else if (score === 3) {
      return {
        width: '75%',
        color: '#eab308', // Amber/Yellow
        label: 'Medium',
        warning: 'Combine caps, numbers, and symbols for full strength'
      };
    } else {
      return {
        width: '100%',
        color: '#e0c060', // Glowing Gold
        label: 'Strong',
        warning: 'Excellent password'
      };
    }
  }


  // ──────────────────────────────────────────
  // 4. ACCESSIBLE CUSTOM ROLE SELECTOR
  // ──────────────────────────────────────────
  const wrapper = document.querySelector('.custom-select-wrapper');
  const trigger = document.getElementById('roleTrigger');
  const listbox = document.getElementById('roleOptions');
  const options = listbox ? listbox.querySelectorAll('.custom-option') : [];
  const nativeSelect = document.getElementById('roleSelect');
  const triggerText = document.getElementById('roleTriggerText');

  let activeIndex = -1;

  if (wrapper && trigger && listbox && nativeSelect) {
    
    // Toggle dropdown on click
    trigger.addEventListener('click', toggleDropdown);

    // Click on option
    options.forEach((opt, idx) => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        selectOption(idx);
        closeDropdown();
      });
      
      // Mouse hover keeps keyboard index in sync
      opt.addEventListener('mouseenter', () => {
        removeFocus();
        activeIndex = idx;
        opt.classList.add('focused');
      });
    });

    // Close on clicking outside
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        closeDropdown(false);
      }
    });

    // Keyboard navigation
    trigger.addEventListener('keydown', (e) => {
      const open = wrapper.classList.contains('open');

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (open) {
            if (activeIndex >= 0 && activeIndex < options.length) {
              selectOption(activeIndex);
            }
            closeDropdown();
          } else {
            openDropdown();
          }
          break;
        case 'ArrowDown':
        case 'Down':
          e.preventDefault();
          if (!open) {
            openDropdown();
          } else {
            navigateOptions(1);
          }
          break;
        case 'ArrowUp':
        case 'Up':
          e.preventDefault();
          if (!open) {
            openDropdown();
          } else {
            navigateOptions(-1);
          }
          break;
        case 'Escape':
        case 'Esc':
          e.preventDefault();
          closeDropdown();
          break;
        case 'Tab':
          if (open) {
            closeDropdown();
          }
          break;
      }
    });

    // Helper functions for custom select
    function toggleDropdown() {
      if (wrapper.classList.contains('open')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    }

    function openDropdown() {
      wrapper.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      listbox.focus();

      // Set initial focus to selected item or first item
      const selectedIdx = Array.from(options).findIndex(o => o.classList.contains('selected'));
      activeIndex = selectedIdx >= 0 ? selectedIdx : 0;
      highlightOption(activeIndex);
    }

    function closeDropdown(shouldFocus = true) {
      if (!wrapper.classList.contains('open')) return;
      wrapper.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      if (shouldFocus) {
        trigger.focus();
      }
      removeFocus();
    }

    function selectOption(index) {
      options.forEach(o => o.classList.remove('selected'));
      const selectedOpt = options[index];
      selectedOpt.classList.add('selected');
      
      const value = selectedOpt.getAttribute('data-value');
      triggerText.textContent = value;
      wrapper.classList.add('filled');
      
      // Update hidden native select
      nativeSelect.value = value;
      nativeSelect.dispatchEvent(new Event('change')); // Trigger event listener
    }

    function highlightOption(index) {
      removeFocus();
      if (index >= 0 && index < options.length) {
        options[index].classList.add('focused');
        options[index].scrollIntoView({ block: 'nearest' });
      }
    }

    function removeFocus() {
      options.forEach(o => o.classList.remove('focused'));
    }

    function navigateOptions(direction) {
      activeIndex += direction;
      if (activeIndex < 0) activeIndex = options.length - 1;
      if (activeIndex >= options.length) activeIndex = 0;
      highlightOption(activeIndex);
    }
  }


  // ──────────────────────────────────────────
  // 5. DYNAMIC ROLE FIELDS
  // ──────────────────────────────────────────
  const roleSelect = document.getElementById('roleSelect');
  const schoolFieldGroup = document.getElementById('schoolFieldGroup');
  const schoolInput = document.getElementById('schoolName');
  const companyFieldGroup = document.getElementById('companyFieldGroup');
  const companyInput = document.getElementById('companyName');

  if (roleSelect && schoolFieldGroup && companyFieldGroup) {
    roleSelect.addEventListener('change', () => {
      const selectedRole = roleSelect.value;

      if (['School Student', 'Undergraduate', 'Postgraduate'].includes(selectedRole)) {
        // Show School Input, Hide Company Input
        schoolFieldGroup.classList.add('active');
        if (schoolInput) schoolInput.setAttribute('required', 'true');
        
        companyFieldGroup.classList.remove('active');
        if (companyInput) {
          companyInput.removeAttribute('required');
          companyInput.value = '';
        }
      } else if (selectedRole === 'Career Counsellor') {
        // Show Company Input, Hide School Input
        companyFieldGroup.classList.add('active');
        if (companyInput) companyInput.setAttribute('required', 'true');

        schoolFieldGroup.classList.remove('active');
        if (schoolInput) {
          schoolInput.removeAttribute('required');
          schoolInput.value = '';
        }
      } else {
        // Hide both
        schoolFieldGroup.classList.remove('active');
        companyFieldGroup.classList.remove('active');
        if (schoolInput) {
          schoolInput.removeAttribute('required');
          schoolInput.value = '';
        }
        if (companyInput) {
          companyInput.removeAttribute('required');
          companyInput.value = '';
        }
      }
    });
  }


  // ──────────────────────────────────────────
  // 6. FORM REGISTRATION SUBMISSION & DUAL-NODE ANIMATION
  // ──────────────────────────────────────────
  const registerForm = document.getElementById('registerForm');
  const signupBtn = document.getElementById('signupBtn');

  if (registerForm && signupBtn) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const mobile = document.getElementById('mobile').value.trim();
      const role = roleSelect.value;
      const pwd = passwordField.value;
      const confirmPwd = document.getElementById('confirmPassword').value;
      const btnText = signupBtn.querySelector('.btn-text');

      let valid = true;

      // Validation logic
      if (!fullName) {
        shakeInput(document.getElementById('fullName'));
        valid = false;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        shakeInput(document.getElementById('email'));
        valid = false;
      }
      if (!mobile || mobile.length < 10) {
        shakeInput(document.getElementById('mobile'));
        valid = false;
      }
      if (!role) {
        shakeInput(trigger);
        valid = false;
      }
      
      // Dynamic fields validation
      if (schoolFieldGroup.classList.contains('active') && schoolInput && !schoolInput.value.trim()) {
        shakeInput(schoolInput);
        valid = false;
      }
      if (companyFieldGroup.classList.contains('active') && companyInput && !companyInput.value.trim()) {
        shakeInput(companyInput);
        valid = false;
      }

      // Password checks
      if (!pwd || pwd.length < 8) {
        shakeInput(passwordField);
        valid = false;
      }
      if (pwd !== confirmPwd) {
        shakeInput(document.getElementById('confirmPassword'));
        valid = false;
      }

      if (!valid) return;

      // Trigger Dual-Node Fusion Connection Animation on Button
      signupBtn.classList.add('loading');

      setTimeout(() => {
        signupBtn.classList.remove('loading');
        signupBtn.classList.add('success');
        btnText.textContent = '✓ Registered!';

        // Card success glow
        const card = document.querySelector('.login-card');
        card.style.boxShadow = `
          0 8px 32px rgba(0, 0, 0, 0.50),
          0 0 50px rgba(22, 163, 74, 0.20),
          inset 0 1px 0 rgba(200, 210, 255, 0.06)
        `;

        setTimeout(() => {
          card.style.boxShadow = '';
          // Success action (e.g. redirect back to sign in page)
          window.location.href = 'index.html';
        }, 1200);
      }, 1400);
    });
  }

  function shakeInput(el) {
    el.style.borderColor = '#ef4444';
    el.style.animation = 'shake 0.4s ease';
    el.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.15)';

    setTimeout(() => {
      el.style.borderColor = '';
      el.style.animation = '';
      el.style.boxShadow = '';
    }, 1200);
  }

});
