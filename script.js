document.getElementById('last-mod').textContent = document.lastModified;
 
const themeBtn = document.getElementById('theme-btn');
 
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeBtn.textContent = document.body.classList.contains('dark') ? '🌙' : '☀';
});
 
const menuBtn = document.getElementById('menu-btn');
const mainNav = document.getElementById('main-nav');
 
menuBtn.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', isOpen);
  menuBtn.textContent = isOpen ? '✕' : '☰';
});
 
 
async function loadWeather() {
  try {
    const lat = -16.5;
    const lon = -68.15;
 
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,weathercode` +
      `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
      `&timezone=America/La_Paz&forecast_days=5`;
 
    const response = await fetch(url);
    if (!response.ok) return;
 
    const data  = await response.json();
    const cur   = data.current;
    const daily = data.daily;

    function wmoLabel(code) {
      if (code === 0)  return { icon: '☀',  desc: 'Clear Sky' };
      if (code <= 2)   return { icon: '⛅', desc: 'Partly Cloudy' };
      if (code <= 3)   return { icon: '☁',  desc: 'Overcast' };
      if (code <= 48)  return { icon: '🌫', desc: 'Foggy' };
      if (code <= 55)  return { icon: '🌦', desc: 'Drizzle' };
      if (code <= 65)  return { icon: '🌧', desc: 'Rain' };
      if (code <= 77)  return { icon: '❄',  desc: 'Snow' };
      if (code <= 82)  return { icon: '🌨', desc: 'Rain Showers' };
      if (code <= 99)  return { icon: '⛈', desc: 'Thunderstorm' };
      return { icon: '🌡', desc: 'Variable' };
    }
 
    const curW = wmoLabel(cur.weathercode);
 
    document.getElementById('weather-icon').textContent = curW.icon;
    document.getElementById('weather-temp').textContent =
      Math.round(cur.temperature_2m) + '° C';
    document.getElementById('weather-desc').textContent = curW.desc;
    document.getElementById('weather-details').innerHTML =
      `<li>High: <strong>${Math.round(daily.temperature_2m_max[0])}°C</strong></li>` +
      `<li>Low: <strong>${Math.round(daily.temperature_2m_min[0])}°C</strong></li>` +
      `<li>Humidity: <strong>${cur.relative_humidity_2m}%</strong></li>`;
 
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
 
    document.getElementById('forecast-list').innerHTML =
      daily.time.map((dateStr, i) => {
        const date  = new Date(dateStr + 'T12:00:00');
        const label = i === 0 ? 'Today' : dayNames[date.getDay()];
        const w     = wmoLabel(daily.weathercode[i]);
        return `<li class="forecast-item">
          <span class="day">${label}</span>
          <span>${w.icon}</span>
          <span class="temp">${Math.round(daily.temperature_2m_max[i])}°C</span>
        </li>`;
      }).join('');
 
  } catch (err) {
    console.warn('Weather fetch failed:', err);
  }
}
 
loadWeather();