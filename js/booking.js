const vehicles = [
  { id:1, name:'Mini Cab',   emoji:'🚗', seats:4, price:8  },
  { id:2, name:'Sedan',      emoji:'🚙', seats:4, price:12 },
  { id:3, name:'SUV',        emoji:'🚐', seats:6, price:18 },
  { id:4, name:'Bike',       emoji:'🏍️', seats:1, price:5  },
  { id:5, name:'Auto',       emoji:'🛺', seats:3, price:7  },
  { id:6, name:'Luxury Van', emoji:'🚌', seats:10,price:30 },
];

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('vehicleGrid');
  if (grid) {
    grid.innerHTML = vehicles.map(v => `
      <div class="vehicle-card" data-id="${v.id}">
        <div class="emoji">${v.emoji}</div>
        <h3>${v.name}</h3>
        <p>${v.seats} seats</p>
        <div class="price">₹${v.price}/km</div>
        <button class="btn-primary book-btn">Book Now</button>
      </div>`).join('');

    grid.querySelectorAll('.book-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const name = e.target.closest('.vehicle-card').querySelector('h3').textContent;
        alert(`✅ ₹${name} booking initiated!\n(Demo — connect a backend to complete.)`);
      });
    });
  }

  const form = document.getElementById('searchForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    SR.clearErrors(form);
    const pickup = document.getElementById('pickup').value.trim();
    const dest   = document.getElementById('destination').value.trim();
    const date   = document.getElementById('date').value;
    const time   = document.getElementById('time').value;

    let ok = true;
    if (pickup.length < 2) { SR.showError('pickup','Enter a valid pickup'); ok=false; }
    if (dest.length < 2)   { SR.showError('destination','Enter a valid destination'); ok=false; }
    if (!date)             { SR.showError('date','Select a date'); ok=false; }
    if (!time)             { SR.showError('time','Select a time'); ok=false; }
    if (pickup && dest && pickup.toLowerCase()===dest.toLowerCase()) {
      SR.showError('destination','Destination must differ from pickup'); ok=false;
    }
    if (!ok) return;

    const results = document.getElementById('searchResults');
    results.innerHTML = '<p style="text-align:center">🔎 Searching rides...</p>';
    setTimeout(() => {
      const distance = (Math.random()*20+5).toFixed(1);
      results.innerHTML = `<h3 style="text-align:center;margin-bottom:1rem">Available rides from <em>${pickup}</em> → <em>${dest}</em></h3>` +
        vehicles.slice(0,4).map(v => `
          <div class="result-card">
            <div><h4>${v.emoji}${v.name}</h4><p>${v.seats} seats · ~${distance} km · ${date} ${time}</p></div>
            <div class="price">₹${(v.price*distance).toFixed(2)}</div>
            <button class="btn-primary">Book</button>
          </div>`).join('');
      results.querySelectorAll('button').forEach(b => b.addEventListener('click', () => alert('✅ Ride booked! (Demo)')));
    }, 800);
  });
});