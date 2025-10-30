// js/main.js
async function loadPartials() {
  const headerEl = document.getElementById('header');
  const footerEl = document.getElementById('footer');

  if (headerEl) {
    const header = await fetch('/partials/header.html').then(res => res.text());
    headerEl.innerHTML = header;
    setupAuthLinks();
  }

  if (footerEl) {
    const footer = await fetch('/partials/footer.html').then(res => res.text());
    footerEl.innerHTML = footer;
  }

  // After partials are loaded, restrict cards if not logged in
  setupCardProtection();
}

// Show/hide login/logout depending on token
function setupAuthLinks() {
  const token = localStorage.getItem('token');
  const loginLink = document.getElementById('loginLink');
  const logoutLink = document.getElementById('logoutLink');

  if (token) {
    if (loginLink) loginLink.style.display = 'none';
    if (logoutLink) {
      logoutLink.style.display = 'inline';
      logoutLink.addEventListener('click', () => {
        localStorage.removeItem('token');
        alert('Logged out successfully'); // Optional: show a message
        window.location.href = 'src/login.html'; // Redirect to login page
      });
    } 
  } else {
    if (logoutLink) logoutLink.style.display = 'none';
    if (loginLink) loginLink.style.display = 'inline';
  }
}

// Prevent clicking cards unless logged in 
function setupCardProtection() {
  const token = localStorage.getItem('token');
  const cards = document.querySelectorAll('.card'); // adjust class if needed

  cards.forEach(card => {
    card.addEventListener('click', e => {
      if (!token) {
        e.preventDefault(); // stop navigation
        //alert('Please log in to view activities.');
        window.location.href = '/src/login.html'; // redirect to login form
      }
    });
  });
}


loadPartials()