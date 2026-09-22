/* Repair layer for the legacy static UI.
   Adds safe edit/cancel behavior without deleting historical records. */
(() => {
  const KEY = 'kasamNetV1';
  const CANCELLED = 'iptal';
  const EDIT_WORDS = ['düzenle', 'duzenle', 'edit'];
  const CANCEL_WORDS = ['iptal', 'sil'];

  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
  };
  const write = value => localStorage.setItem(KEY, JSON.stringify(value));
  const notify = message => {
    if (typeof window.toast === 'function') window.toast(message);
    else window.alert(message);
  };
  const number = value => Number(String(value ?? '').replace(/\./g, '').replace(',', '.')) || 0;

  function keyForTable(table) {
    const text = (table?.innerText || '').toLocaleLowerCase('tr-TR');
    const candidates = [
      ['personel', 'employees'], ['çalışan', 'employees'], ['müşteri', 'customers'],
      ['satış', 'sales'], ['kasa', 'cash'], ['malzeme', 'materials'],
      ['pos', 'pos'], ['kurye', 'couriers'], ['reçete', 'recipes'],
      ['hesap', 'employeeTx']
    ];
    return candidates.find(([word]) => text.includes(word))?.[1] || null;
  }

  function rowIndex(row) {
    const rows = [...(row?.parentElement?.children || [])];
    return rows.indexOf(row) - 1;
  }

  function editRow(button) {
    const row = button.closest('tr');
    const table = button.closest('table');
    const key = button.dataset.key || keyForTable(table);
    const index = Number(button.dataset.index ?? rowIndex(row));
    const db = read();
    if (!key || !Array.isArray(db[key]) || !db[key][index]) {
      notify('Bu kayıt için düzenleme bağlantısı bulunamadı. Sayfayı yenileyip tekrar deneyin.');
      return;
    }
    const record = db[key][index];
    const fields = Object.keys(record).filter(k => !['id', 'createdAt', 'created_at', 'cancelledAt', 'iptalTarihi'].includes(k));
    const changes = {};
    for (const field of fields) {
      const value = window.prompt(`${field} değerini güncelleyin`, record[field] ?? '');
      if (value === null) return;
      changes[field] = typeof record[field] === 'number' ? number(value) : value;
    }
    db[key][index] = { ...record, ...changes, updatedAt: new Date().toISOString() };
    write(db);
    notify('Kayıt güncellendi. Geçmiş korunmuştur.');
    window.location.reload();
  }

  function cancelRow(button) {
    const row = button.closest('tr');
    const table = button.closest('table');
    const key = button.dataset.key || keyForTable(table);
    const index = Number(button.dataset.index ?? rowIndex(row));
    const db = read();
    if (!key || !Array.isArray(db[key]) || !db[key][index]) {
      notify('Bu kayıt için iptal bağlantısı bulunamadı. Sayfayı yenileyip tekrar deneyin.');
      return;
    }
    if (!window.confirm('Kayıt iptal edilecek. Geçmiş korunacak ve kayıt silinmeyecek. Devam edilsin mi?')) return;
    db[key][index] = { ...db[key][index], cancelledAt: new Date().toISOString(), iptalTarihi: new Date().toISOString(), status: CANCELLED };
    write(db);
    notify('Kayıt iptal edildi; geçmişten silinmedi.');
    window.location.reload();
  }

  window.editRecord = editRow;
  window.cancelRecord = cancelRow;

  document.addEventListener('click', event => {
    const button = event.target.closest('button, a');
    if (!button) return;
    const label = (button.textContent || '').trim().toLocaleLowerCase('tr-TR');
    if (EDIT_WORDS.some(word => label === word || label.includes(word))) {
      event.preventDefault();
      editRow(button);
    } else if (CANCEL_WORDS.some(word => label === word || label.includes(word))) {
      event.preventDefault();
      cancelRow(button);
    }
  }, true);
})();
