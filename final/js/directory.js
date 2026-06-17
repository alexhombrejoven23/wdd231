// directory.js — ES Module: full startup directory with filter/search
import { initNav, buildCardHTML, showToast, updateFavCount } from './app.js';
import { openModal, initModal } from './modal.js';
import { getPrefs, savePrefs } from './storage.js';

let allStartups = [];

async function loadAllStartups() {
  const grid = document.getElementById('startups-grid');
  const countEl = document.getElementById('results-count');
  if (!grid) return;

  try {
    const res = await fetch('data/startups.json');
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    allStartups = await res.json();

    const prefs = getPrefs();
    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-industry');
    const sortSelect = document.getElementById('sort-select');

    if (searchInput && prefs.search) searchInput.value = prefs.search;
    if (filterSelect && prefs.filter && prefs.filter !== 'all') {
      filterSelect.value = prefs.filter;
    }

    renderStartups();

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        savePrefs({ ...getPrefs(), search: searchInput.value });
        renderStartups();
      });
    }

    if (filterSelect) {
      filterSelect.addEventListener('change', () => {
        savePrefs({ ...getPrefs(), filter: filterSelect.value });
        renderStartups();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        savePrefs({ ...getPrefs(), sort: sortSelect.value });
        renderStartups();
      });
    }

  } catch (err) {
    console.error('Error fetching startups:', err);
    grid.innerHTML = '<p class="no-results">❌ No se pudieron cargar las startups. Intenta más tarde.</p>';
  }
}

function renderStartups() {
  const grid = document.getElementById('startups-grid');
  const countEl = document.getElementById('results-count');
  const searchVal = document.getElementById('search-input')?.value.toLowerCase() || '';
  const filterVal = document.getElementById('filter-industry')?.value || 'all';
  const sortVal = document.getElementById('sort-select')?.value || 'name';

  let filtered = allStartups.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchVal) ||
      s.description.toLowerCase().includes(searchVal) ||
      s.city.toLowerCase().includes(searchVal) ||
      s.tags.some(t => t.toLowerCase().includes(searchVal));

    const matchFilter = filterVal === 'all' || s.industry === filterVal;

    return matchSearch && matchFilter;
  });

  filtered = filtered.sort((a, b) => {
    if (sortVal === 'name') return a.name.localeCompare(b.name);
    if (sortVal === 'founded') return b.founded - a.founded;
    if (sortVal === 'employees') return b.employees - a.employees;
    return 0;
  });

  if (countEl) {
    countEl.innerHTML = `Mostrando <span>${filtered.length}</span> de ${allStartups.length} startups`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-results">🔍 No se encontraron resultados para "<strong>${searchVal || filterVal}</strong>"</div>`;
    return;
  }

  grid.innerHTML = filtered.map(s => buildCardHTML(s)).join('');

  grid.querySelectorAll('.startup-card').forEach(card => {
    const id = parseInt(card.dataset.id);
    const startup = allStartups.find(s => s.id === id);

    card.addEventListener('click', () => openModal(startup));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(startup);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initModal();
  loadAllStartups();
});
