// URL веб-приложения Apps Script (уже подставлен твой)
const API_URL =
  'https://script.google.com/macros/s/AKfycbyZ13OD8fketTCAZZDQkDlGq2nYxUC8ctrjjyOx3eIatDTfb-pxbnkvcVXtJGh9J6DGm4g/exec';

const DB = {
  // Получить все записи листа (или с фильтром по tripId)
  async get(sheet, params = {}) {
    const url = new URL(API_URL);
    url.searchParams.set('sheet', sheet);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) {
        url.searchParams.set(k, v);
      }
    });

    const r = await fetch(url.toString());
    return r.json();
  },

  // Добавить запись
  async add(sheet, data) {
    const r = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ sheet, data }),
    });
    return r.json();
  },
};