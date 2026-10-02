async function renderTripList(container, filter = {}) {
  container.innerHTML = '<p>Загрузка...</p>';

  let trips;
  try {
    trips = await DB.get('trips');
  } catch (err) {
    container.innerHTML = '<p>Ошибка загрузки данных: ' + err.message + '</p>';
    return;
  }

  if (!Array.isArray(trips)) {
    container.innerHTML = '<p>Ошибка API: ' + JSON.stringify(trips) + '</p>';
    return;
  }

  const filtered = trips.filter(t => {
    return (
      (!filter.from ||
        String(t.from).toLowerCase().includes(filter.from.toLowerCase())) &&
      (!filter.to ||
        String(t.to).toLowerCase().includes(filter.to.toLowerCase())) &&
      (!filter.date || String(t.date) === filter.date)
    );
  });

  if (!filtered.length) {
    container.innerHTML = '<p>Поездок не найдено.</p>';
    return;
  }

  container.innerHTML = filtered
    .map(t => {
      const free = Number(t.seats) - Number(t.taken);
      return `
      <div class="card">
        <div class="route">${t.from} → ${t.to}</div>
        <div class="meta">📅 ${t.date} в ${t.time} · 💺 свободно: ${free} из ${t.seats} · 💰 ${t.price} ₽</div>
        <div class="meta">🚗 ${t.driver}${t.car ? ' · ' + t.car : ''}</div>
        <p>${t.comment || ''}</p>
        <button onclick="applyToTrip(${t.id}, ${free})">Оставить заявку</button>
        <a href="chat.html?tripId=${t.id}"><button class="secondary">Чат</button></a>
      </div>
    `;
    })
    .join('');
}

async function applyToTrip(tripId, freeSeats) {
  if (freeSeats <= 0) {
    alert('Свободных мест нет.');
    return;
  }

  const res = await DB.add('applications', {
    tripId,
    user: 'me',
    status: 'pending',
  });

  if (res.ok) {
    alert('Заявка отправлена!');
  } else {
    alert('Ошибка: ' + (res.error || 'неизвестная'));
  }
}