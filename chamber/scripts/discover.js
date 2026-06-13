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

const visitorMsg = document.getElementById('visitor-msg');
const lastVisit = localStorage.getItem('discoverLastVisit');
const now = Date.now();

if (!lastVisit) {
  visitorMsg.textContent = '✨ Welcome! This is your first time visiting this page. Enjoy discovering Potosí.';
} else {
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSince = Math.floor((now - Number(lastVisit)) / msPerDay);

  if (daysSince < 1) {
    visitorMsg.textContent = '👋 Back so soon! Thanks for visiting again today.';
  } else if (daysSince === 1) {
    visitorMsg.textContent = '🌟 You last visited yesterday. Welcome back!';
  } else {
    visitorMsg.textContent = `🕰️ You last visited ${daysSince} days ago. So much has changed – enjoy exploring!`;
  }
}
localStorage.setItem('discoverLastVisit', now);

// ── Load place cards from data/places.json ──
const grid = document.getElementById('places-grid');

async function loadPlaces() {
  grid.innerHTML = '<p class="loading">Loading places...</p>';

  try {
    const response = await fetch('data/places.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const places = await response.json();
    buildCards(places);
  } catch (error) {
    console.error('Error loading places:', error);
    grid.innerHTML = '<p class="error">❌ Could not load places data. Please try again later.</p>';
  }
}

function buildCards(places) {
  grid.innerHTML = '';

  places.forEach((place, index) => {
    const card = document.createElement('div');
    card.classList.add('place-card');
    card.innerHTML = `
      <h2>${escapeHtml(place.name)}</h2>
      <figure>
        <img
          src="${place.image}"
          alt="${escapeHtml(place.name)}"
          loading="lazy"
          width="300"
          height="200"
          onerror="this.onerror=null; this.src='images/placeholder.jpg';"
        />
      </figure>
      <p>${escapeHtml(place.description)}</p>
      <address>${escapeHtml(place.address)}</address>
      <button class="learn-more-btn" type="button">Learn More</button>
    `;

    const btn = card.querySelector('.learn-more-btn');
    btn.addEventListener('click', () => {
      window.open(place.link, '_blank', 'noopener,noreferrer');
    });

    grid.appendChild(card);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

loadPlaces();