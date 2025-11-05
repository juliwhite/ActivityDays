// ✅ Email Validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ✅ Password Validation
function isValidPassword(password) {
  // Example rule: 8+ chars, at least 1 letter and 1 number
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
}

module.exports = {
  isValidEmail,
  isValidPassword
};