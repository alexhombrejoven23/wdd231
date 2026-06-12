// discover.js
// Potosí Chamber of Commerce | Alex Condori Molle | WDD 231

import { places } from '../data/places.mjs';

// ── Footer ──
document.getElementById('copy-year').textContent = new Date().getFullYear();
document.getElementById('last-mod').textContent = document.lastModified;

// ── Dark theme ──
const themeBtn = document.getElementById('theme-btn');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
  themeBtn.textContent = '☀️';
}

themeBtn.addEventListener('click', () => {
  body.classList.toggle('dark');
  const isDark = body.classList.contains('dark');
  themeBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ── Hamburger menu ──
const menuBtn = document.getElementById('menu-btn');
const mainNav = document.getElementById('main-nav');

menuBtn.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  menuBtn.textContent = mainNav.classList.contains('open') ? '✕' : '☰';
});

// ── Visitor message using localStorage ──
const visitorMsg = document.getElementById('visitor-msg');
const lastVisit = localStorage.getItem('discoverLastVisit');
const now = Date.now();

if (!lastVisit) {
  // First visit ever
  visitorMsg.textContent = 'Welcome! Let us know if you have any questions.';
} else {
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSince = Math.floor((now - Number(lastVisit)) / msPerDay);

  if (daysSince < 1) {
    visitorMsg.textContent = 'Back so soon! Awesome!';
  } else if (daysSince === 1) {
    visitorMsg.textContent = 'You last visited 1 day ago.';
  } else {
    visitorMsg.textContent = `You last visited ${daysSince} days ago.`;
  }
}

// Save current visit date
localStorage.setItem('discoverLastVisit', now);

// ── Build place cards from JSON data ──
const grid = document.getElementById('places-grid');

places.forEach((place, index) => {
  const card = document.createElement('div');
  card.classList.add('place-card');
  card.style.gridArea = `place${index + 1}`;

  card.innerHTML = `
    <h2>${place.name}</h2>
    <figure>
      <img
        src="${place.image}"
        alt="${place.name}"
        loading="lazy"
        width="300"
        height="200"
        onerror="this.src='images/placeholder.jpg'"
      />
    </figure>
    <p>${place.description}</p>
    <address>${place.address}</address>
    <button class="learn-more-btn" type="button">Learn More</button>
  `;

  grid.appendChild(card);
});