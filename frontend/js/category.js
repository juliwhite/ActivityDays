//const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';


document.addEventListener('DOMContentLoaded', () => {
  const categoryCards = document.querySelectorAll('.card'); // now it exists
  const activitiesContainer = document.getElementById('activitiesContainer');
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Function to display activities
  async function displayActivitiesByCategory(category) {
    try {
      const res = await fetch(`${API_BASE}/activities?category=${encodeURIComponent(category)}`);
      const activities = await res.json();

      if (!activities.length) {
        activitiesContainer.innerHTML = `<p>No activities found for "${category}".</p>`;
        return;
      }

      activitiesContainer.innerHTML = activities.map(a => `
        <div class="activity-card" data-category="${a.category}">
          <h3>${a.name}</h3>
          <p><strong>Date:</strong> ${new Date(a.date).toLocaleDateString()}</p>
          <p><strong>Location:</strong> ${a.location}</p>
          <p><strong>Organizer:</strong> ${a.organizer}</p>
          <p>${a.description}</p>
          <div class="card-actions">
            <button class="edit-btn" data-id="${a._id}">✏️ Edit</button>
            <button class="delete-btn" data-id="${a._id}">🗑️ Delete</button>
          </div>
        </div>
      `).join('');
    } catch (err) {
      activitiesContainer.innerHTML = `<p>Error loading activities.</p>`;
      console.error(err);
    }
  }

  // Add click listener to each category
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;

      // Highlight selected category
      categoryCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      displayActivitiesByCategory(category);
    });
  });
});



















