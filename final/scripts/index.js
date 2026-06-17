import { initNav, buildCardHTML, showToast } from './app.js';
import { openModal, initModal } from './modal.js';

async function loadFeaturedStartups() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;

  try {
    const res = await fetch('data/startups.json');
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const startups = await res.json();

    const featured = startups.filter((_, i) => i < 6);
    grid.innerHTML = featured.map(s => buildCardHTML(s)).join('');

    grid.querySelectorAll('.startup-card').forEach(card => {
      const id = parseInt(card.dataset.id);
      const startup = startups.find(s => s.id === id);

      card.addEventListener('click', () => openModal(startup));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(startup);
        }
      });
    });

    animateCounters();

  } catch (err) {
    console.error('Error loading startups:', err);
    grid.innerHTML = '<p class="no-results">Error cargando datos. Intenta de nuevo.</p>';
  }
}

function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const suffix = counter.dataset.suffix || '';
    let current = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      counter.textContent = current + suffix;
      if (current >= target) clearInterval(interval);
    }, 35);
  });
}

function loadIndustries() {
  const container = document.getElementById('industries-container');
  if (!container) return;

  const industries = [
    { name: 'Fintech', icon: '🏦' },
    { name: 'EdTech', icon: '📚' },
    { name: 'HealthTech', icon: '🏥' },
    { name: 'AgriTech', icon: '🌱' },
    { name: 'CleanTech', icon: '☀️' },
    { name: 'Logística', icon: '🚚' },
    { name: 'E-commerce', icon: '🛒' },
    { name: 'Blockchain', icon: '₿' },
  ];

  container.innerHTML = industries.map(ind => `
    <button class="industry-chip" aria-label="Ver startups de ${ind.name}">
      <span class="icon" aria-hidden="true">${ind.icon}</span>
      ${ind.name}
    </button>
  `).join('');

  container.querySelectorAll('.industry-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const name = chip.textContent.trim();
      showToast(`Filtrando por ${name} — ve al Directorio`, 'info');
      localStorage.setItem('bsd_prefs', JSON.stringify({ filter: name }));
      setTimeout(() => { window.location.href = 'directory.html'; }, 900);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initModal();
  loadFeaturedStartups();
  loadIndustries();
});
