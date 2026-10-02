const params = new URLSearchParams(location.search);
const tripId = params.get('tripId') || '1';

const box = document.getElementById('chat-box');

async function renderMessages() {
  const messages = await DB.get('messages', { tripId });

  if (!Array.isArray(messages)) {
    box.innerHTML = '<p>Ошибка загрузки сообщений.</p>';
    return;
  }

  box.innerHTML = messages
    .map(
      m => `
    <div class="msg ${m.user === 'me' ? 'me' : 'them'}">${m.text}</div>
  `
    )
    .join('');
  box.scrollTop = box.scrollHeight;
}

async function loadTripTitle() {
  const trips = await DB.get('trips');
  if (!Array.isArray(trips)) return;

  const trip = trips.find(t => String(t.id) === String(tripId));
  if (trip) {
    document.getElementById('chat-title').textContent =
      `Диалог: ${trip.from} → ${trip.to} (${trip.date})`;
  }
}

document.getElementById('chat-form').addEventListener('submit', async e => {
  e.preventDefault();
  const input = e.target.text;
  const text = input.value.trim();
  if (!text) return;

  await DB.add('messages', { tripId, user: 'me', text });
  input.value = '';
  await renderMessages();
});

loadTripTitle();
renderMessages();

// Автообновление раз в 5 секунд
setInterval(renderMessages, 5000);
