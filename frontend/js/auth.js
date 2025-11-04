// Vite-aware, single auth client for signup/login
// Uses import.meta.env.VITE_API_URL when available (build-time),
// falls back to window.__API_BASE__ or localhost during development.

const API_BASE = import.meta.env.VITE_API_URL || window.__API_BASE__ || (window.location.hostname.includes('localhost') ? 'http://localhost:8000' : '');
const API_URL = API_BASE ? `${API_BASE.replace(/\/$/, '')}/api/auth` : '/api/auth';

function showMessage(id, text, color = 'red') {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = text;
    el.style.color = color;
  } 
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function isValidPassword(password) {
  return password.length >= 6;
}

// -------------------------------
// Sign Up
// -------------------------------
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = signupForm.querySelector('input[type="email"]').value.trim();
    const password = signupForm.querySelector('input[type="password"]').value.trim();
    const messageId = 'signupMessage';


    // Client-side validation
    if (!email || !password) {
      showMessage(messageId, 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      showMessage(messageId, 'Please enter a valid email address');
      return;
    }

    if (!isValidPassword(password)) {
      showMessage(messageId, 'Password must be at least 6 characters long');
      return;
    }

    // Send signup request
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
        showMessage(messageId, 'Account created! Redirecting to login...', 'green');
        setTimeout(() => (window.location.href = '/login.html'), 1200);
      } else {
        showMessage(messageId, data.message || 'Sign up failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      showMessage(messageId, 'Error connecting to server');
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
    const email = loginForm.querySelector('input[type="email"]').value.trim();
    const password = loginForm.querySelector('input[type="password"]').value.trim();
    const messageId = 'loginMessage';

    if (!email || !password) {
      showMessage(messageId, 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      showMessage(messageId, 'Please enter a valid email address');
      return;
    }

    if (!isValidPassword(password)) {
      showMessage(messageId, 'Password must be at least 6 characters long');
      return;
    }

    // Send login request
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.token) localStorage.setItem('token', data.token);
        showMessage(messageId, 'Login successful! Redirecting...', 'green');
        setTimeout(() => (window.location.href = '/index.html'), 800);
      } else {
        showMessage(messageId, data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      showMessage(messageId, 'Error connecting to server');
    }
  });
}
