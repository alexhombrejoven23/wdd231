import { toggleFavorite, isFavorite } from './storage.js';
import { updateFavCount, showToast, getStageBadgeClass } from './app.js';

let currentStartup = null;

export function initModal() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  const favBtn = document.getElementById('modal-fav-btn');
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      if (!currentStartup) return;
      const nowFav = toggleFavorite(currentStartup.id);
      updateFavBtn(currentStartup.id);
      updateFavCount();
      showToast(
        nowFav ? `${currentStartup.name} guardada en favoritos ❤️` : `${currentStartup.name} eliminada de favoritos`,
        nowFav ? 'success' : 'info'
      );

      const card = document.querySelector(`.startup-card[data-id="${currentStartup.id}"]`);
      if (card) {
        const footer = card.querySelector('.card-footer span:last-child');
        if (footer) {
          footer.textContent = `${nowFav ? '❤️' : '🤍'} ${currentStartup.employees} empleados`;
        }
      }
    });
  }
}

export function openModal(startup) {
  currentStartup = startup;
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;

  document.getElementById('modal-logo').textContent = startup.logo;
  document.getElementById('modal-name').textContent = startup.name;
  document.getElementById('modal-industry').textContent = `${startup.industry} · ${startup.city}`;
  document.getElementById('modal-founded').textContent = startup.founded;
  document.getElementById('modal-employees').textContent = startup.employees;
  document.getElementById('modal-stage').textContent = startup.stage;
  document.getElementById('modal-city').textContent = startup.city;
  document.getElementById('modal-desc').textContent = startup.description;

  const stageBadge = document.getElementById('modal-stage-badge');
  if (stageBadge) {
    stageBadge.textContent = startup.stage;
    stageBadge.className = `stage-badge ${getStageBadgeClass(startup.stage)}`;
  }

  const tagsContainer = document.getElementById('modal-tags');
  if (tagsContainer) {
    tagsContainer.innerHTML = startup.tags.map(t => `<span class="tag">${t}</span>`).join('');
  }

  const visitLink = document.getElementById('modal-visit');
  if (visitLink) {
    visitLink.href = startup.website;
    visitLink.textContent = 'Visitar sitio web →';
  }

  updateFavBtn(startup.id);

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
t
  setTimeout(() => {
    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) closeBtn.focus();
  }, 100);
}

function updateFavBtn(id) {
  const favBtn = document.getElementById('modal-fav-btn');
  if (!favBtn) return;
  const fav = isFavorite(id);
  favBtn.classList.toggle('active', fav);
  favBtn.innerHTML = fav ? '❤️ Guardada' : '🤍 Guardar';
}

export function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  currentStartup = null;
}
