/*const form = document.getElementById('add-activity-form');
const messageEl = document.getElementById('form-message');
// Use environment variable or fallback to localhost for local dev
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Prevent access if not logged in
const token = localStorage.getItem('token');
if (!token) {
  messageEl.textContent = '⚠️ Only Admin can add an activity.';
  messageEl.style.color = 'red';
  form.style.display = 'none'; // hide form
  //window.location.href = '/login.html'; // redirect to login form
} else {

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

  //const token = localStorage.getItem('token'); // JWT from login

  try {
    const res = await fetch(`${API_BASE}/api/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // include JWT
      },
      body: JSON.stringify(activityData),
    });

    const data = await res.json();
    //messageEl.textContent = data.message;

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
}*/



const form = document.getElementById('add-activity-form');
const messageEl = document.getElementById('form-message');
const titleEl = document.getElementById('activity-page-title');
const submitBtn = document.getElementById('submit-btn');

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// User + Token
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// Decode JWT payload helper
function decodeToken(tkn) {
  try {
    return JSON.parse(atob(tkn.split('.')[1]));
  } catch {
    return null;
  }
}

// Get role from localStorage user or JWT payload
const payload = decodeToken(token);
const role =
  user?.role ||
  payload?.role ||
  payload?.user?.role ||
  null;

// Check if editing (URL contains ?id=)
const urlParams = new URLSearchParams(window.location.search);
const activityId = urlParams.get("id");


// ----------------------------------------------------------
// 🚫 Block all access if not logged in
// ----------------------------------------------------------
if (!token) {
  messageEl.textContent = '⚠️ You must be logged in.';
  messageEl.style.color = 'red';
  form.style.display = 'none';
  throw new Error("User not logged in");
}

// ----------------------------------------------------------
// 🔒 Block ADD page for non-admins (when NOT editing)
// ----------------------------------------------------------
if (!activityId && role !== "admin") {
  messageEl.textContent = '⛔ Only Admin can add an activity.';
  messageEl.style.color = 'red';
  form.style.display = 'none';
  throw new Error("Unauthorized add attempt");
}

// ----------------------------------------------------------
// 🔒 If editing → only allow Admin
// ----------------------------------------------------------
if (activityId && role !== "admin") {
  messageEl.textContent = '⛔ Only Admin can edit an activity.';
  messageEl.style.color = 'red';
  form.style.display = 'none';
  throw new Error("Unauthorized edit attempt");
}


// ----------------------------------------------------------
// 📌 If editing → load the existing activity
// ----------------------------------------------------------
if (activityId) {
  titleEl.textContent = "Edit Activity";
  submitBtn.value = "Update Activity";

  loadActivity(activityId);
}

async function loadActivity(id) {
  try {
    const res = await fetch(`${API_BASE}/api/activities/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to load activity");
    }

    const activity = await res.json();

    // Populate form fields
    document.getElementById('activity-name').value = activity.name;
    document.getElementById('activity-date').value = activity.date.split("T")[0];
    document.getElementById('activity-location').value = activity.location;
    document.getElementById('activity-organizer').value = activity.organizer;
    document.getElementById('activity-description').value = activity.description;
    document.getElementById('activity-category').value = activity.category;

  } catch (error) {
    console.error(error);
    messageEl.textContent = "❌ Error loading activity";
    messageEl.style.color = 'red';
  }
}


// ----------------------------------------------------------
// 📌 Submit handler for Add + Edit
// ----------------------------------------------------------
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
    let endpoint = `${API_BASE}/api/activities`;
    let method = "POST";

    // If editing → update instead of add
    if (activityId) {
      endpoint = `${API_BASE}/api/activities/${activityId}`;
      method = "PUT";
    }

    const res = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(activityData),
    });

    const data = await res.json();

    if (res.ok) {
      messageEl.style.color = 'green';

      if (activityId) {
        messageEl.textContent = "✅ Activity updated successfully!";
      } else {
        messageEl.textContent = "✅ Activity added successfully!";
        form.reset();
      }

      // Optional redirect
      setTimeout(() => {
        window.location.href = `category.html?category=${activityData.category}`;
      }, 1200);

    } else {
      messageEl.textContent = `❌ ${data.message || 'Failed to save activity'}`;
      messageEl.style.color = 'red';
    }

  } catch (error) {
    console.error(error);
    messageEl.textContent = '❌ Error connecting to server';
    messageEl.style.color = 'red';
  }
});