// Vite-aware, single auth client for signup/login
// Uses import.meta.env.VITE_API_URL when available (build-time),
// falls back to window.__API_BASE__ or localhost during development.

const API_BASE = import.meta.env.VITE_API_URL || window.__API_BASE__ || (window.location.hostname.includes('localhost') ? 'http://localhost:8000' : '');
const API_URL = API_BASE ? `${API_BASE.replace(/\/$/, '')}/api/auth` : '/api/auth';

function showMessage(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// -------------------------------
// Sign Up
// -------------------------------
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = signupForm.querySelector('input[type="email"]').value;
    const password = signupForm.querySelector('input[type="password"]').value;

    if (!email || !password) {
      showMessage('signupMessage', 'Please fill in all fields');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // if backend returns token on register, save it
        if (data.token) localStorage.setItem('token', data.token);
        showMessage('signupMessage', 'Account created! Redirecting to login...');
        setTimeout(() => (window.location.href = '/login.html'), 1200);
      } else {
        showMessage('signupMessage', data.message || 'Sign up failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      showMessage('signupMessage', 'Error connecting to server');
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
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    if (!email || !password) {
      showMessage('loginMessage', 'Please fill in all fields');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.token) localStorage.setItem('token', data.token);
        showMessage('loginMessage', 'Login successful! Redirecting...');
        setTimeout(() => (window.location.href = '/index.html'), 800);
      } else {
        showMessage('loginMessage', data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      showMessage('loginMessage', 'Error connecting to server');
    }
  });
}
