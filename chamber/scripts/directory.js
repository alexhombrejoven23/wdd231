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

function getMembershipInfo(level) {
  switch (level) {
    case 3: return { label: '🥇 Oro',   cls: 'badge-3' };
    case 2: return { label: '🥈 Plata', cls: 'badge-2' };
    default: return { label: 'Miembro', cls: 'badge-1' };
  }
}

function createGridCard(member) {
  const { label, cls } = getMembershipInfo(member.membershipLevel);
  const card = document.createElement('div');
  card.classList.add('member-card');
  card.innerHTML = `
    <img src="images/${member.image}" alt="Logo de ${member.name}" loading="lazy"
         onerror="this.src='images/placeholder.jpg'">
    <h2>${member.name}</h2>
    <p>${member.description}</p>
    <p>📍 ${member.address}</p>
    <p>📞 ${member.phone}</p>
    <a href="${member.website}" target="_blank" rel="noopener">🌐 ${member.website}</a>
    <span class="membership-badge ${cls}">${label}</span>
  `;
  return card;
}

function createListItem(member) {
  const { label, cls } = getMembershipInfo(member.membershipLevel);
  const item = document.createElement('div');
  item.classList.add('member-list-item');
  item.innerHTML = `
    <img src="images/${member.image}" alt="Logo de ${member.name}" loading="lazy"
         onerror="this.src='images/placeholder.jpg'">
    <div class="list-info">
      <h2>${member.name}</h2>
      <p>📍 ${member.address} &nbsp;|&nbsp; 📞 ${member.phone}</p>
      <a href="${member.website}" target="_blank" rel="noopener">${member.website}</a>
    </div>
    <span class="membership-badge ${cls}">${label}</span>
  `;
  return item;
}

let currentMembers = [];
let currentView = 'grid';

const container = document.getElementById('members-container');
const gridBtn   = document.getElementById('grid-btn');
const listBtn   = document.getElementById('list-btn');

function renderMembers() {
  container.innerHTML = '';
  container.className = currentView === 'grid' ? 'grid-view' : 'list-view';

  currentMembers.forEach(member => {
    const el = currentView === 'grid'
      ? createGridCard(member)
      : createListItem(member);
    container.appendChild(el);
  });
}

gridBtn.addEventListener('click', () => {
  currentView = 'grid';
  gridBtn.classList.add('active');
  listBtn.classList.remove('active');
  renderMembers();
});

listBtn.addEventListener('click', () => {
  currentView = 'list';
  listBtn.classList.add('active');
  gridBtn.classList.remove('active');
  renderMembers();
});

async function loadMembers() {
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();
    currentMembers = data;
    renderMembers();
  } catch (error) {
    console.error('Error al cargar miembros:', error);
    container.innerHTML = '<p style="color:red;">No se pudo cargar el directorio. Intenta de nuevo.</p>';
  }
}

loadMembers();