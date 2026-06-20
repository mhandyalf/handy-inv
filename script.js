const cover = document.querySelector('#cover');
const main = document.querySelector('#invitation');
const openButton = document.querySelector('#openInvitation');
const nav = document.querySelector('#bottomNav');
const music = document.querySelector('#music');
const musicToggle = document.querySelector('#musicToggle');
const toast = document.querySelector('#toast');

const guest = new URLSearchParams(window.location.search).get('to');
if (guest) {
  document.querySelectorAll('[data-guest]').forEach((element) => {
    element.textContent = guest.trim().slice(0, 70);
  });
}

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => toast.classList.remove('show'), 2200);
}

openButton.addEventListener('click', async () => {
  cover.classList.add('open');
  main.classList.add('active');
  main.setAttribute('aria-hidden', 'false');
  nav.classList.add('active');
  musicToggle.classList.add('active');
  document.body.classList.remove('locked');
  try {
    await music.play();
    musicToggle.classList.add('playing');
    musicToggle.setAttribute('aria-label', 'Jeda musik');
  } catch (_) {
    notify('Ketuk tombol musik untuk memutar lagu');
  }
});

musicToggle.addEventListener('click', async () => {
  if (music.paused) {
    await music.play();
    musicToggle.classList.add('playing');
    musicToggle.setAttribute('aria-label', 'Jeda musik');
  } else {
    music.pause();
    musicToggle.classList.remove('playing');
    musicToggle.setAttribute('aria-label', 'Putar musik');
  }
});

const eventTime = new Date('2026-06-13T08:00:00+07:00').getTime();
function updateCountdown() {
  const distance = Math.max(0, eventTime - Date.now());
  const values = {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance / 3600000) % 24),
    minutes: Math.floor((distance / 60000) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
  Object.entries(values).forEach(([id, value]) => {
    document.querySelector(`#${id}`).textContent = String(value).padStart(2, '0');
  });
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal:not(.visible)').forEach((element) => revealObserver.observe(element));

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(button.dataset.copy);
    notify('Nomor rekening berhasil disalin');
  });
});

const wishForm = document.querySelector('#wishForm');
const wishList = document.querySelector('#wishList');
const savedWishes = JSON.parse(localStorage.getItem('wedding-wishes') || '[]');

function renderWishes() {
  wishList.innerHTML = '';
  savedWishes.slice().reverse().forEach((wish) => {
    const item = document.createElement('article');
    item.className = 'wish-item';
    const name = document.createElement('strong');
    const message = document.createElement('span');
    const attendance = document.createElement('small');
    name.textContent = wish.name;
    message.textContent = wish.message;
    attendance.textContent = ` — ${wish.attendance}`;
    item.append(name, message, attendance);
    wishList.append(item);
  });
}
renderWishes();

wishForm.addEventListener('submit', (event) => {
  event.preventDefault();
  savedWishes.push({
    name: document.querySelector('#wishName').value.trim(),
    attendance: document.querySelector('#attendance').value,
    message: document.querySelector('#wishMessage').value.trim(),
  });
  localStorage.setItem('wedding-wishes', JSON.stringify(savedWishes));
  renderWishes();
  wishForm.reset();
  notify('Terima kasih, ucapanmu sudah tersimpan');
});
