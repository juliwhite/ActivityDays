
// js/category.js
export function initCategoryPage() {
  const activitiesContainer = document.getElementById('activitiesContainer');
  const titleEl = document.getElementById('categoryTitle');
  const addBtn = document.getElementById('addActivityBtn');

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');
  //const user = JSON.parse(localStorage.getItem('user')); // get user info from localStorage

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


