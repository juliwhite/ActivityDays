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
        window.location.href = '/login.html';
      });
    }
  }
}

loadPartials();
