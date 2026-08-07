document.addEventListener('DOMContentLoaded', () => {
  const signup = document.getElementById('signupForm');
  const login  = document.getElementById('loginForm');

  if (signup) {
    signup.addEventListener('submit', e => {
      e.preventDefault();
      SR.clearErrors(signup);
      const name = document.getElementById('sName').value.trim();
      const email= document.getElementById('sEmail').value.trim();
      const phone= document.getElementById('sPhone').value.trim();
      const pw   = document.getElementById('sPassword').value;
      const cf   = document.getElementById('sConfirm').value;

      let ok = true;
      if (name.length < 2) { SR.showError('sName','Name is required'); ok=false; }
      if (!SR.isEmail(email)) { SR.showError('sEmail','Enter a valid email'); ok=false; }
      if (!SR.isPhone(phone)) { SR.showError('sPhone','Enter a valid phone'); ok=false; }
      if (pw.length < 6) { SR.showError('sPassword','Min 6 characters'); ok=false; }
      if (pw !== cf) { SR.showError('sConfirm','Passwords do not match'); ok=false; }
      if (!ok) return;

      const users = JSON.parse(localStorage.getItem('sr_users') || '[]');
      if (users.some(u => u.email === email)) {
        SR.showError('sEmail','Email already registered'); return;
      }
      users.push({ name, email, phone, pw });
      localStorage.setItem('sr_users', JSON.stringify(users));
      document.getElementById('signupMsg').textContent = '✅ Account created! Redirecting to login...';
      setTimeout(() => location.href = 'login.html', 1200);
    });
  }

  if (login) {
    login.addEventListener('submit', e => {
      e.preventDefault();
      SR.clearErrors(login);
      const email = document.getElementById('loginEmail').value.trim();
      const pw    = document.getElementById('loginPassword').value;
      let ok = true;
      if (!SR.isEmail(email)) { SR.showError('loginEmail','Enter a valid email'); ok=false; }
      if (pw.length < 6) { SR.showError('loginPassword','Min 6 characters'); ok=false; }
      if (!ok) return;

      const users = JSON.parse(localStorage.getItem('sr_users') || '[]');
      const user = users.find(u => u.email === email && u.pw === pw);
      if (!user) { SR.showError('loginPassword','Invalid email or password'); return; }
      localStorage.setItem('sr_current', JSON.stringify({ name:user.name, email:user.email }));
      
      document.getElementById('loginMsg').textContent = `✅ Welcome back, ${user.name}! Redirecting...`;
      setTimeout(() => location.href = '../index.html', 1200);
    });
  }
});