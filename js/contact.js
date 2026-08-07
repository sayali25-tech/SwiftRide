document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    SR.clearErrors(form);
    const name = document.getElementById('cName').value.trim();
    const email= document.getElementById('cEmail').value.trim();
    const msg  = document.getElementById('cMessage').value.trim();
    let ok = true;
    if (name.length < 2) { SR.showError('cName','Name is required'); ok=false; }
    if (!SR.isEmail(email)) { SR.showError('cEmail','Enter a valid email'); ok=false; }
    if (msg.length < 10) { SR.showError('cMessage','Message must be at least 10 chars'); ok=false; }
    if (!ok) return;
    document.getElementById('contactSuccess').textContent = '✅ Thanks! Your message has been sent.';
    form.reset();
  });
});