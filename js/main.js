// Loader
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hide');
      setTimeout(() => loader.remove(), 500);
    }, 600);
  }
});

// Mobile nav & Navbar auth update
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  // Update Navbar if User is Logged In
  const user = JSON.parse(localStorage.getItem('sr_current'));
  if (user && navLinks) {
    const loginBtn = navLinks.querySelector('a[href*="login.html"]');
    const signupBtn = navLinks.querySelector('a[href*="signup.html"]');
    if (loginBtn && signupBtn) {
      const parentLi = loginBtn.parentElement;
      parentLi.innerHTML = `<a href="#" id="logoutBtn" style="color:#dc2626;font-weight:600;">Logout (${user.name})</a>`;
      signupBtn.parentElement.remove();

      document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('sr_current');
        location.reload();
      });
    }
  }
});

// ---------- Validation Helpers ----------
window.SR = {
  showError(id, msg) {
    const el = document.querySelector(`.error[data-for="${id}"]`);
    if (el) {
      el.textContent = msg || '';
      const input = document.getElementById(id);
      if (input) input.style.borderColor = msg ? '#dc2626' : '';
    }
  },
  clearErrors(form) {
    form.querySelectorAll('.error').forEach(e => e.textContent = '');
    form.querySelectorAll('.field input, .field textarea').forEach(inp => inp.style.borderColor = '');
  },
  isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
  isPhone(v) { return /^\+?\d{7,15}$/.test(v.replace(/\s|-/g, '')); }
};