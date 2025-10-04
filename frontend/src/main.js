import './css/style.css';

console.log('ActivityDays frontend loaded (Vite - vanilla)');

const app = document.getElementById('app');
if (app) {
  const p = document.createElement('p');
  p.textContent = 'Vite dev server is running. Edit files in /src to see HMR.';
  app.appendChild(p);
}
