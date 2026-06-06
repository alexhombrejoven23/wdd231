document.getElementById('copy-year').textContent = new Date().getFullYear();
document.getElementById('last-mod').textContent = document.lastModified;

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

const menuBtn = document.getElementById('menu-btn');
const mainNav = document.getElementById('main-nav');

menuBtn.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  menuBtn.textContent = mainNav.classList.contains('open') ? '✕' : '☰';
});

const timestampField = document.getElementById('timestamp');
const now = new Date();
timestampField.value = now.toLocaleString('es-BO', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

const infoButtons = document.querySelectorAll('.mem-info-btn');
const closeButtons = document.querySelectorAll('.modal-close-btn');

infoButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    if (modal) modal.showModal();
  });
});

closeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('data-close');
    const modal = document.getElementById(modalId);
    if (modal) modal.close();
  });
});

document.querySelectorAll('.mem-modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });
});