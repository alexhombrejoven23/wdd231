// app.js — ES Module: shared utilities across all pages
import { getFavorites, toggleFavorite } from './storage.js';

export function initNav() {
  const hamburger = document.querySelector('.hamburger');
  const navUl = document.querySelector('nav ul');

  if (hamburger && navUl) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navUl.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', navUl.classList.contains('open'));
    });
  }

  // Wayfinding: highlight current page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });

  updateFavCount();
}

export function updateFavCount() {
  const favs = getFavorites();
  const badge = document.querySelector('.fav-count');
  if (badge) {
    badge.textContent = favs.length;
    badge.style.display = favs.length > 0 ? 'inline-flex' : 'none';
  }
}

export function showToast(message, type = 'info') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

export function getStageBadgeClass(stage) {
  const map = { 'Pre-Seed': 'pre-seed', 'Seed': 'seed', 'Series A': 'series-a' };
  return map[stage] || 'pre-seed';
}

export function buildCardHTML(startup) {
  const stageClass = getStageBadgeClass(startup.stage);
  const favs = getFavorites();
  const isFav = favs.includes(startup.id);

  return `
    <article class="startup-card" data-id="${startup.id}" role="button" tabindex="0" aria-label="Ver detalles de ${startup.name}">
      <div class="card-top">
        <div class="card-logo" aria-hidden="true">${startup.logo}</div>
        <span class="stage-badge ${stageClass}">${startup.stage}</span>
      </div>
      <div>
        <div class="card-name">${startup.name}</div>
        <div class="card-industry">${startup.industry}</div>
      </div>
      <p class="card-desc">${startup.description}</p>
      <div class="card-tags">
        ${startup.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="card-footer">
        <span>📍 ${startup.city}</span>
        <span>🗓 ${startup.founded}</span>
        <span>${isFav ? '❤️' : '🤍'} ${startup.employees} empleados</span>
      </div>
    </article>
  `;
}
