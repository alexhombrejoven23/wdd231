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

const API_KEY = 'bc6393a7e10d0c165f86414ed5ed09f3';
const CITY_ID = '3908967'; 
const UNITS   = 'metric';

function getWeatherEmoji(code) {
  if (code >= 200 && code < 300) return '⛈';
  if (code >= 300 && code < 400) return '🌦';
  if (code >= 500 && code < 600) return '🌧';
  if (code >= 600 && code < 700) return '❄️';
  if (code >= 700 && code < 800) return '🌫';
  if (code === 800)               return '☀️';
  if (code > 800)                 return '⛅';
  return '🌡';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getDayName(timestamp) {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return days[new Date(timestamp * 1000).getDay()];
}

async function loadCurrentWeather() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${CITY_ID}&units=${UNITS}&lang=es&appid=${API_KEY}`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error('Error al obtener clima');
    const data = await res.json();

    document.getElementById('weather-icon').textContent = getWeatherEmoji(data.weather[0].id);
    document.getElementById('weather-temp').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('weather-desc').textContent = capitalize(data.weather[0].description);
    document.getElementById('weather-humidity').textContent = `💧 Humedad: ${data.main.humidity}%`;
    document.getElementById('weather-wind').textContent = `💨 Viento: ${Math.round(data.wind.speed)} m/s`;

  } catch (err) {
    console.error('Weather error:', err);
    document.getElementById('weather-temp').textContent = 'No disponible';
  }
}

async function loadForecast() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?id=${CITY_ID}&units=${UNITS}&lang=es&appid=${API_KEY}`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error('Error al obtener pronóstico');
    const data = await res.json();

    const today = new Date().getDate();
    const seen  = new Set();
    const days  = [];

    for (const item of data.list) {
      const date    = new Date(item.dt * 1000);
      const dayNum  = date.getDate();
      const hour    = date.getHours();

      if (dayNum === today) continue;
      if (seen.has(dayNum)) continue;
      if (hour >= 11 && hour <= 14) {
        seen.add(dayNum);
        days.push(item);
        if (days.length === 3) break;
      }
    }

    if (days.length < 3) {
      seen.clear();
      days.length = 0;
      for (const item of data.list) {
        const dayNum = new Date(item.dt * 1000).getDate();
        if (dayNum === today) continue;
        if (seen.has(dayNum)) continue;
        seen.add(dayNum);
        days.push(item);
        if (days.length === 3) break;
      }
    }

    const list = document.getElementById('forecast-list');
    list.innerHTML = '';

    days.forEach(item => {
      const li = document.createElement('li');
      li.classList.add('forecast-item');
      li.innerHTML = `
        <span class="day">${getDayName(item.dt)}</span>
        <span>${getWeatherEmoji(item.weather[0].id)}</span>
        <span class="temp">${Math.round(item.main.temp)}°C</span>
        <span class="forecast-desc">${capitalize(item.weather[0].description)}</span>
      `;
      list.appendChild(li);
    });

  } catch (err) {
    console.error('Forecast error:', err);
    document.getElementById('forecast-list').innerHTML = '<li>No disponible</li>';
  }
}

async function loadSpotlights() {
  try {
    const res     = await fetch('data/members.json');
    if (!res.ok) throw new Error('Error al cargar miembros');
    const members = await res.json();

    const eligible = members.filter(m => m.membershipLevel >= 2);

    for (let i = eligible.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
    }

    const count    = Math.random() < 0.5 ? 2 : 3;
    const selected = eligible.slice(0, count);

    const container = document.getElementById('spotlights-container');
    container.innerHTML = '';

    selected.forEach(member => {
      const badgeText  = member.membershipLevel === 3 ? '🥇 Oro' : '🥈 Plata';
      const badgeClass = member.membershipLevel === 3 ? 'badge-3' : 'badge-2';

      const card = document.createElement('div');
      card.classList.add('spotlight-card');
      card.innerHTML = `
        <img src="images/${member.image}" alt="Logo de ${member.name}" loading="lazy"
             onerror="this.src='images/placeholder.jpg'">
        <h3>${member.name}</h3>
        <p class="spot-phone">📞 ${member.phone}</p>
        <p class="spot-address">📍 ${member.address}</p>
        <a class="spot-link" href="${member.website}" target="_blank" rel="noopener">🌐 Visitar sitio</a>
        <span class="membership-badge ${badgeClass}">${badgeText}</span>
      `;
      container.appendChild(card);
    });

  } catch (err) {
    console.error('Spotlights error:', err);
  }
}

loadCurrentWeather();
loadForecast();
loadSpotlights();