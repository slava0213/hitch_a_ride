function renderTripList(container, filter = {}) {
    const trips = DB.get('trips').filter(t => t.status === 'active');
    const filtered = trips.filter(t => {
      return (!filter.from || t.from.toLowerCase().includes(filter.from.toLowerCase()))
          && (!filter.to   || t.to.toLowerCase().includes(filter.to.toLowerCase()))
          && (!filter.date || t.date === filter.date);
    });
  
    if (!filtered.length) {
      container.innerHTML = '<p>Поездок не найдено.</p>';
      return;
    }
  
    container.innerHTML = filtered.map(t => `
      <div class="card">
        <div class="route">${t.from} → ${t.to}</div>
        <div class="meta">📅 ${t.date} в ${t.time} · 💺 свободно: ${t.seats - t.taken} из ${t.seats} · 💰 ${t.price} ₽</div>
        <div class="meta">🚗 ${t.driver} · ${t.car}</div>
        <p>${t.comment || ''}</p>
        <button onclick="applyToTrip(${t.id})">Оставить заявку</button>
        <a href="chat.html?tripId=${t.id}"><button class="secondary">Чат</button></a>
      </div>
    `).join('');
  }
  
  function applyToTrip(tripId) {
    const apps = DB.get('applications');
    const trips = DB.get('trips');
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
  
    if (trip.taken >= trip.seats) {
      alert('Свободных мест нет.');
      return;
    }
  
    apps.push({ id: Date.now(), tripId, user: 'me', status: 'pending' });
    trip.taken += 1;
    DB.set('applications', apps);
    DB.set('trips', trips);
    alert('Заявка отправлена!');
    location.reload();
  }