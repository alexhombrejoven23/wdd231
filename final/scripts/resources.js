import { initNav } from './app.js';

function handleForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);
    const params = new URLSearchParams();
    data.forEach((val, key) => params.append(key, val));

    window.location.href = `thankyou.html?${params.toString()}`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  handleForm();
});
