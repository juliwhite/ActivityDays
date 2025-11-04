const form = document.getElementById('add-activity-form');
const messageEl = document.getElementById('form-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const activityData = {
    name: document.getElementById('activity-name').value,
    date: document.getElementById('activity-date').value,
    location: document.getElementById('activity-location').value,
    organizer: document.getElementById('activity-organizer').value,
    description: document.getElementById('activity-description').value,
    category: document.getElementById('activity-category').value,
  };

  try {
    const res = await fetch('http://localhost:5000/api/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });

    const data = await res.json();

    if (res.ok) {
      messageEl.textContent = '✅ Activity added successfully!';
      messageEl.style.color = 'green';
      form.reset();
    } else {
      messageEl.textContent = `❌ ${data.message || 'Failed to add activity'}`;
      messageEl.style.color = 'red';
    }
  } catch (error) {
    console.error(error);
    messageEl.textContent = '❌ Error connecting to server';
    messageEl.style.color = 'red';
  }
});
