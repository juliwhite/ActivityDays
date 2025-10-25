// Simple auth client for signup/login
(function () {
  const API_BASE = window.location.hostname.includes('localhost')
    ? 'http://localhost:8000'
    : (window.__API_BASE__ || 'https://activitydays.onrender.com');

  // Signup
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const msg = document.getElementById('signupMessage');
      try {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Signup failed');
        msg.textContent = 'Signup successful — you are logged in.';
        // store token
        if (data.token) localStorage.setItem('token', data.token);
        // optionally redirect
        setTimeout(() => (window.location.href = '/'), 800);
      } catch (err) {
        msg.textContent = err.message;
      }
    });
  }

  // Login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const msg = document.getElementById('loginMessage');
      try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        msg.textContent = 'Login successful';
        if (data.token) localStorage.setItem('token', data.token);
        // redirect to home or protected page
        setTimeout(() => (window.location.href = '/'), 500);
      } catch (err) {
        msg.textContent = err.message;
      }
    });
  }
})();
