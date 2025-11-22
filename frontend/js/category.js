
export function initCategoryPage() {
  const activitiesContainer = document.getElementById('activitiesContainer');
  const titleEl = document.getElementById('categoryTitle');
  const addBtn = document.getElementById('addActivityBtn');

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // Decode JWT safely
  const decodeToken = (tkn) => {
    try {
      return JSON.parse(atob(tkn.split('.')[1]));
    } catch {
      return null;
    }
  };

  const currentUser = decodeToken(token);
  const isAdmin = currentUser?.role === 'admin' || currentUser?.user?.role === 'admin';

  // Get category from URL
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  if (!category) {
    activitiesContainer.innerHTML = `<p>No category selected.</p>`;
    return;
  }

  titleEl.textContent = `${category} Activities`;

  // Add button - only show to admin
  if (isAdmin) {
    addBtn.href = `add-activity.html?category=${encodeURIComponent(category)}`;
  } else {
    addBtn.style.display = 'none';
  }

  // ⭐ Global array for filtering
  let allActivities = [];

  // ⭐ Insert filter UI
  function insertFilters() {
    const filterDiv = document.createElement('div');
    filterDiv.classList.add('filter-section');
    filterDiv.innerHTML = `
      <input type="text" id="searchInput" placeholder="Search by name..." class="filter-input"/>
      <select id="filterSelect" class="filter-dropdown">
        <option value="all">All Activities</option>
        <option value="top">Top Rated (4+)</option>
        <option value="new">New Activities</option>
      </select>
    `;
    addBtn.insertAdjacentElement('afterend', filterDiv);

    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('filterSelect').addEventListener('change', applyFilters);
  }

  insertFilters();

  // ⭐ Load activities from backend
  async function loadActivities() {
    try {
      const res = await fetch(`${API_BASE}/api/activities/category/${encodeURIComponent(category)}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) {
        activitiesContainer.innerHTML = `<p>Error loading activities (${res.status}).</p>`;
        return;
      }

      const activities = await res.json();

      if (!activities.length) {
        activitiesContainer.innerHTML = `<p>No activities found for "${category}".</p>`;
        return;
      }

      allActivities = activities; // store for filtering
      applyFilters(); // render after filters
    } catch (err) {
      activitiesContainer.innerHTML = `<p>Error loading activities.</p>`;
      console.error(err);
    }
  }

  loadActivities();

  // ⭐ Render activities function
  function renderActivities(list) {
    activitiesContainer.innerHTML = list.map(a => {
      const avgRating = a.ratings && a.ratings.length
        ? (a.ratings.reduce((sum, r) => sum + r.value, 0) / a.ratings.length).toFixed(1)
        : 0;

      return `
        <div class="activity-card" data-id="${a._id}">
          <h3>${a.name}</h3>
          <p><strong>Date:</strong> ${new Date(a.date).toLocaleDateString()}</p>
          <p><strong>Location:</strong> ${a.location}</p>
          <p><strong>Organizer:</strong> ${a.organizer}</p>
          <p>${a.description}</p>

          <div class="rating-container">
            <div class="stars">
              ${[1,2,3,4,5].map(i => `
                <span class="star ${i <= Math.round(avgRating) ? 'filled' : ''}" data-value="${i}">★</span>
              `).join('')}
            </div>
            <p>Average: <span class="avg-rating">${avgRating}</span> / 5</p>
          </div>

          ${isAdmin ? `
          <div class="card-actions">
            <button class="edit-btn" data-id="${a._id}">✏️ Edit</button>
            <button class="delete-btn" data-id="${a._id}">🗑️ Delete</button>
          </div>` : ''}
        </div>
      `;
    }).join('');

    setupRatings();
  }

  // ⭐ Rating setup
  function setupRatings() {
    const ratingContainers = activitiesContainer.querySelectorAll('.rating-container');

    ratingContainers.forEach(container => {
      const activityId = container.closest('.activity-card').dataset.id;
      const stars = container.querySelectorAll('.star');
      const avgEl = container.querySelector('.avg-rating');

      stars.forEach((star, idx) => {
        star.addEventListener('mouseover', () => {
          stars.forEach((s, i) => s.classList.toggle('hovered', i <= idx));
        });
        star.addEventListener('mouseout', () => {
          stars.forEach(s => s.classList.remove('hovered'));
        });

        star.addEventListener('click', async () => {
          if (!token) {
            alert('Please log in to rate this activity.');
            return;
          }

          const value = parseInt(star.dataset.value);
          try {
            const res = await fetch(`${API_BASE}/api/activities/${activityId}/rate`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ value })
            });

            const data = await res.json();
            if (!res.ok) {
              alert(data.message || 'Error submitting rating.');
              return;
            }

            avgEl.textContent = data.averageRating;
            stars.forEach(s => s.classList.toggle('filled', parseInt(s.dataset.value) <= Math.round(data.averageRating)));
          } catch (err) {
            console.error(err);
            alert('Server error submitting rating.');
          }
        });
      });
    });
  }

  // ⭐ Edit button
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const id = e.target.dataset.id;
      window.location.href = `add-activity.html?id=${id}`;
    }
  });

  // ⭐ Delete button
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.dataset.id;
      if (!confirm("Are you sure you want to delete this activity?")) return;

      try {
        const res = await fetch(`${API_BASE}/api/activities/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
          const msg = await res.json();
          alert(msg.message || "Error deleting activity");
          return;
        }

        alert("Activity deleted!");
        loadActivities();
      } catch (err) {
        console.error(err);
        alert("Server error deleting activity.");
      }
    }
  });

  // ⭐ Filtering helpers
  function calculateAverage(activity) {
    if (!activity.ratings || activity.ratings.length === 0) return 0;
    return activity.ratings.reduce((s, r) => s + r.value, 0) / activity.ratings.length;
  }

  function filterByName(activities, text) {
    return activities.filter(a => a.name.toLowerCase().includes(text.toLowerCase()));
  }

  function filterTopRated(activities) {
    return activities.filter(a => calculateAverage(a) >= 4);
  }

  function filterNewActivities(activities) {
    const now = new Date();
    return activities.filter(a => {
      const created = new Date(a.createdAt);
      const diffDays = (now - created) / (1000*60*60*24);
      return diffDays <= 30;
    });
  }

  function applyFilters() {
    let filtered = [...allActivities];
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');

    if (searchInput && searchInput.value.trim() !== '') {
      filtered = filterByName(filtered, searchInput.value.trim());
    }

    if (filterSelect) {
      const f = filterSelect.value;
      if (f === 'top') filtered = filterTopRated(filtered);
      if (f === 'new') filtered = filterNewActivities(filtered);
    }

    renderActivities(filtered);
  }
}



















// js/category.js
/*export function initCategoryPage() {
  const activitiesContainer = document.getElementById('activitiesContainer');
  const titleEl = document.getElementById('categoryTitle');
  const addBtn = document.getElementById('addActivityBtn');

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  // Decode JWT safely
  const decodeToken = (tkn) => {
    try {
      return JSON.parse(atob(tkn.split('.')[1]));
    } catch {
      return null;
    }
  };

  const currentUser = token ? decodeToken(token) : null;
  const isAdmin = currentUser?.role === 'admin' || currentUser?.user?.role === 'admin';

  // Get category from URL
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  if (!category) {
    activitiesContainer.innerHTML = `<p>No category selected.</p>`;
    return;
  }

  titleEl.textContent = `${category} Activities`;

  // Add button  - only show to admin
  if (isAdmin) {
    addBtn.href = `add-activity.html?category=${encodeURIComponent(category)}`;
  } else {
    addBtn.style.display = 'none';
  }
  
  // ⭐ Load activities
  async function loadActivities() {
    try {
      //const token = localStorage.getItem('token');

      const res = await fetch(`${API_BASE}/api/activities/category/${encodeURIComponent(category)}`, {
        headers: token ? {
          "Authorization": `Bearer ${token}`
        } : {}
      });

      if (!res.ok) {
        activitiesContainer.innerHTML = `<p>Error loading activities (${res.status}).</p>`;
        return;
      }

      const activities = await res.json();

      if (!activities.length) {
        activitiesContainer.innerHTML = `<p>No activities found for "${category}".</p>`;
        return;
      }

      // Render activity cards and admin-only edit/delete buttons
      activitiesContainer.innerHTML = activities.map(a => {
        const avgRating = a.ratings && a.ratings.length
          ? (a.ratings.reduce((sum, r) => sum + r.value, 0) / a.ratings.length).toFixed(1)
          : 0;

        return `
        <div class="activity-card" data-id="${a._id}">
          <h3>${a.name}</h3>
          <p><strong>Date:</strong> ${new Date(a.date).toLocaleDateString()}</p>
          <p><strong>Location:</strong> ${a.location}</p>
          <p><strong>Organizer:</strong> ${a.organizer}</p>
          <p>${a.description}</p>

          <!-- ⭐ Rating -->
            <div class="rating-container">
              <div class="stars">
                ${[1,2,3,4,5].map(i => `
                  <span class="star ${i <= Math.round(avgRating) ? 'filled' : ''}" data-value="${i}">★</span>
                `).join('')}
              </div>
              <p>Average: <span class="avg-rating">${avgRating}</span> / 5</p>
            </div>

          ${isAdmin ? `
          <div class="card-actions">
            <button class="edit-btn" data-id="${a._id}">✏️ Edit</button>
            <button class="delete-btn" data-id="${a._id}">🗑️ Delete</button>
          </div>
          ` : '' }
        </div>
      `;
    }).join('');

    // Setup rating click handlers
    setupRatings();

    } catch (err) {
      activitiesContainer.innerHTML = `<p>Error loading activities.</p>`;
      console.error(err);
    }
  }

  loadActivities();

  // ⭐ Handle rating clicks
  function setupRatings() {
    const ratingContainers = activitiesContainer.querySelectorAll('.rating-container');

    ratingContainers.forEach(container => {
      const activityId = container.closest('.activity-card').dataset.id;
      const stars = container.querySelectorAll('.star');
      const avgEl = container.querySelector('.avg-rating');

      // Hover effect
      stars.forEach((star, idx) => {
        star.addEventListener('mouseover', () => {
          stars.forEach((s, i) => s.classList.toggle('hovered', i <= idx));
        });

        star.addEventListener('mouseout', () => {
          stars.forEach(s => s.classList.remove('hovered'));
        });

        // Click to rate
        star.addEventListener('click', async () => { 
          if (!token) {
            alert('Please log in to rate this activity.');
            return;
          }

          const value = parseInt(star.dataset.value);

          try {
            const res = await fetch(`${API_BASE}/api/activities/${activityId}/rate`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ value })
            });

            const data = await res.json();

            if (!res.ok) {
              alert(data.message || 'Error submitting rating.');
              return;
            }

            // Update average rating in the card
            //const avgEl = container.querySelector('.avg-rating');
            avgEl.textContent = data.averageRating;

            // Update star fill
            stars.forEach(s => s.classList.toggle('filled', parseInt(s.dataset.value) <= Math.round(data.averageRating)));

          } catch (err) {
            console.error(err);
            alert('Server error submitting rating.');
          }
        });
      });
    });
  }

  // Edit button
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const id = e.target.dataset.id;
      window.location.href = `add-activity.html?id=${id}`;
    }
  });

  // Delete button
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.dataset.id;
      const confirmDelete = confirm("Are you sure you want to delete this activity?");
      if (!confirmDelete) return;

      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${API_BASE}/api/activities/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
          const msg = await res.json();
          alert(msg.message || "Error deleting activity");
          return;
        }

        alert("Activity deleted!");
        loadActivities();
      } catch (err) {
        console.error(err);
        alert("Server error deleting activity.");
      }
    }
  });
}
*/

