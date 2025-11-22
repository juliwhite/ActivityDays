// js/main.js
async function loadPartials() {
  const headerEl = document.getElementById('header');
  const footerEl = document.getElementById('footer');

  if (headerEl) {
    const header = await fetch('/partials/header.html').then(res => res.text());
    headerEl.innerHTML = header;

    setupAuthLinks();  // handle login/logout visibility
    setupMobileMenu(); // enable mobile menu toggle
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
        window.location.href = '/login.html'; // Redirect to login page
      });
    } 
  } else {
    if (logoutLink) logoutLink.style.display = 'none';
    if (loginLink) loginLink.style.display = 'inline';
  }
}

// Enable mobile menu toggle
function setupMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      menuToggle.classList.toggle('active'); // optional: animate icon

      // Switch between hamburger ☰ and X ✖
      if (navLinks.classList.contains('show')) {
        menuToggle.innerHTML = '&times;'; // X symbol
      } else {
        menuToggle.innerHTML = '&#9776;'; // ☰ symbol
      }

    });

    // Optional: close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        menuToggle.classList.remove('active');
        menuToggle.innerHTML = '&#9776;';
      });
    });
  }
}

// Prevent clicking cards unless logged in 
function setupCardProtection() {
  //const token = localStorage.getItem('token');
  const cards = document.querySelectorAll('.card'); 

  cards.forEach(card => {
    card.addEventListener('click', e => {
      const token = localStorage.getItem('token'); // check token at click time
      if (!token) {
        e.preventDefault(); // stop navigation
        //alert('Please log in to view activities.');
        window.location.href = '/login.html'; // redirect to login form
      }
    });
  });
}

/*function setupAddActivityVisibility() {
  const user = JSON.parse(localStorage.getItem("user"));
  const addBtn = document.querySelector(".add-activity-btn");

  if (!addBtn) return; // avoid errors if button doesn't exist on some pages

  // If no user or user is not admin → hide the button
  if (!user || user.role !== "admin") {
    addBtn.style.display = "none";
  }
}*/

// Load and display the most recent activity on the homepage
async function loadUpcomingActivity() {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const upcomingEl = document.getElementById("recentActivity");
  if (!upcomingEl) return;


  try {
    const res = await fetch(`${API_BASE}/api/activities/upcoming`);
    console.log("Upcoming activity response:", res.status);
    
    if (!res.ok) {  
      upcomingEl.innerHTML = `<p>Error loading upcoming activity (${res.status}).</p>`;
      return;
    }

    const activity = await res.json();

    
    // No activities
    if (!activity || activity.message === "No activities found") {
      upcomingEl.innerHTML = `
        <div class="upcoming-activity">
          <h2>Upcoming Activity</h2>
          <p>No upcoming activities at the moment.</p>
        </div>
      `;
      return;
    }

    const date = new Date(activity.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
      weekday: 'long',   // full weekday name, e.g. "Wednesday"
      month: 'short',    // short month name, e.g. "Dec"
      day: 'numeric'     // day of month, e.g. "3"
    });

    // Display upcoming activity with full styled card
    upcomingEl.innerHTML = `
      <div class="activity-details">
        <h2>Upcoming Activity</h2>
        <p><strong>${activity.name}</strong></p>
        <p>${activity.location}</p>
        <span class="date-highlight">${formattedDate}</span>
        <a href="/category.html?category=${activity.category}" class="btn-view">View Activity</a>
      </div>
    `;
  } catch (error) {
    console.error("Error fetching upcoming activity:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartials(); // wait until header/footer are loaded

  //setupAddActivityVisibility();

  // Only initialize category.js if on category.html
  if (window.location.pathname.includes("category.html")) {
    const categoryModule = await import("/js/category.js");
    categoryModule.initCategoryPage();
  }

  // ⭐ NEW: Load the most recent activity only on the homepage
  if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
    loadUpcomingActivity();
  }
});

//loadPartials()