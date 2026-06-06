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

const params = new URLSearchParams(window.location.search);

const membershipLabels = {
  np:     '🤝 NP – Sin costo',
  bronze: '🥉 Bronce',
  silver: '🥈 Plata',
  gold:   '🥇 Oro'
};

const fields = [
  { key: 'firstName',  label: 'Nombre' },
  { key: 'lastName',   label: 'Apellido' },
  { key: 'email',      label: 'Correo electrónico' },
  { key: 'phone',      label: 'Teléfono móvil' },
  { key: 'orgName',    label: 'Empresa' },
  { key: 'membership', label: 'Nivel de membresía' },
  { key: 'timestamp',  label: 'Fecha de solicitud' },
];

const grid = document.getElementById('summary-grid');

fields.forEach(field => {
  let value = params.get(field.key) || '—';

  if (field.key === 'membership' && membershipLabels[value]) {
    value = membershipLabels[value];
  }

  const item = document.createElement('div');
  item.classList.add('summary-item');
  item.innerHTML = `
    <span class="summary-label">${field.label}</span>
    <span class="summary-value">${value}</span>
  `;
  grid.appendChild(item);
});