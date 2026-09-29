const params = new URLSearchParams(location.search);
const tripId = Number(params.get('tripId')) || 1;

const trips = DB.get('trips');
const trip = trips.find(t => t.id === tripId);
if (trip) {
  document.getElementById('chat-title').textContent =
    `Диалог: ${trip.from} → ${trip.to} (${trip.date})`;
}

const box = document.getElementById('chat-box');

function renderMessages() {
  const messages = DB.get('messages').filter(m => m.tripId === tripId);
  box.innerHTML = messages.map(m => `
    <div class="msg ${m.user === 'me' ? 'me' : 'them'}">${m.text}</div>
  `).join('');
  box.scrollTop = box.scrollHeight;
}
renderMessages();

document.getElementById('chat-form').addEventListener('submit', e => {
  e.preventDefault();
  const input = e.target.text;
  const text = input.value.trim();
  if (!text) return;

  const messages = DB.get('messages');
  messages.push({ id: Date.now(), tripId, user: 'me', text });
  DB.set('messages', messages);
  input.value = '';
  renderMessages();

  // Имитация ответа собеседника
  setTimeout(() => {
    const m2 = DB.get('messages');
    m2.push({ id: Date.now() + 1, tripId, user: 'them', text: 'Хорошо, договорились!' });
    DB.set('messages', m2);
    renderMessages();
  }, 1200);
});