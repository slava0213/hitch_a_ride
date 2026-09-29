// Временное хранилище. Позже заменяется на API + БД.
const DB = {
    get(key, fallback = []) {
      try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
  };
  
  // Начальные демо-данные при первом запуске
  function seedIfEmpty() {
    if (!localStorage.getItem('trips')) {
      DB.set('trips', [
        {
          id: 1,
          from: 'Москва',
          to: 'Санкт-Петербург',
          date: '2025-06-01',
          time: '08:00',
          seats: 3,
          taken: 1,
          price: 1500,
          driver: 'Алексей',
          car: 'Kia Rio',
          comment: 'Выезд от метро ВДНХ, багаж небольшой.',
          status: 'active',
        },
        {
          id: 2,
          from: 'Казань',
          to: 'Самара',
          date: '2025-06-03',
          time: '14:30',
          seats: 4,
          taken: 0,
          price: 800,
          driver: 'Мария',
          car: 'Lada Vesta',
          comment: 'С остановкой на кофе.',
          status: 'active',
        },
      ]);
    }
  
    if (!localStorage.getItem('applications')) {
      DB.set('applications', []);
    }
  
    if (!localStorage.getItem('messages')) {
      DB.set('messages', [
        { id: 1, tripId: 1, user: 'them', text: 'Добрый день! Есть свободное место?' },
        { id: 2, tripId: 1, user: 'me', text: 'Да, одно место свободно.' },
      ]);
    }
  
    if (!localStorage.getItem('reviews')) {
      DB.set('reviews', [
        { id: 1, driver: 'Алексей', rating: 5, text: 'Отличная поездка, всё вовремя.' },
      ]);
    }
  
    if (!localStorage.getItem('profile')) {
      DB.set('profile', {
        name: 'Иван Петров',
        email: 'ivan@example.com',
        phone: '+7 (900) 000-00-00',
        car: 'Hyundai Solaris',
        about: 'Езжу по маршруту Москва — Тверь по выходным.',
        rating: 4.8,
      });
    }
  }
  seedIfEmpty();