const API_URL = 'http://localhost:5000/api/auth'; 

const messageEl = document.getElementById('message');
// -------------------------------
// Sign Up
// -------------------------------
const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    //const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    //const messageEl = document.getElementById('signupMessage');

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        messageEl.textContent = 'Account created! Redirecting to login...';
        setTimeout(() => {
          window.location.href = '/login.html';
        }, 1500);
      } else {
        messageEl.textContent = data.message || 'Sign up failed';
      }
    } catch (err) {
        console.error('Error:', err);
        messageEl.textContent = 'Error connecting to server';
    }
  });
}

// -------------------------------
// Login
// -------------------------------
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    //const messageEl = document.getElementById('loginMessage');

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        messageEl.textContent = 'Login successful! Redirecting...';
        setTimeout(() => {
          window.location.href = '/index.html';
        }, 1500);
      } else {
        messageEl.textContent = data.message || 'Login failed';
      }
    } catch (err) {
        console.error('Error:', err);
        messageEl.textContent = 'Error connecting to server';
    }
  });
}
