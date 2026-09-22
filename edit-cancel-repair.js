/* Legacy UI repair layer: safely edits records and cancels them without deleting history. */
(() => {
  const KEY = 'kasamNetV1';
  const EDIT_WORDS = ['düzenle', 'duzenle', 'edit'];
  const CANCEL_WORDS = ['iptal', 'sil'];

  const readDb = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
  };
  const writeDb = db => localStorage.setItem(KEY, JSON.stringify(db));
  const notify = message => {
    if (typeof window.toast === 'function') window.toast(message);
    else window.alert(message);
  };
  const toNumber = value => Number(String(value ?? '').replace(/\./g, '').replace(',', '.')) || 0;

  function getTableKey(button) {
    if (button.dataset.key) return button.dataset.key;
    const text = (button.closest('.panel')?.innerText || button.closest('table')?.innerText || '').toLocaleLowerCase('tr-TR');
    const map = [
      ['personel', 'employees'], ['çalışan', 'employees'], ['müşteri', 'customers'],
      ['satış', 'sales'], ['kasa', 'cash'], ['malzeme', 'materials'],
      ['pos', 'pos'], ['kurye', 'couriers'], ['reçete', 'recipes'],
      ['hesap', 'employeeTx']
    ];
    return map.find(([word]) => text.includes(word))?.[1] || null;
  }

  function getIndex(button) {
    if (button.dataset.index !== undefined) return Number(button.dataset.index);
    const row = button.closest('tr');
    if (!row) return -1;
    const rows = [...row.parentElement.children];
    return rows.indexOf(row) - 1;
  }

  function editRecord(button) {
    const key = getTableKey(button);
    const index = getIndex(button);
    const db = readDb();
    if (!key || !Array.isArray(db[key]) || !db[key][index]) return notify('Kayıt bağlantısı bulunamadı. Sayfayı yenileyin.');
    const original = db[key][index];
    const updated = { ...original };
    const editable = Object.keys(original).filter(name => !['id', 'createdAt', 'created_at', 'updatedAt', 'cancelledAt', 'iptalTarihi', 'status'].includes(name));
    for (const name of editable) {
      const value = window.prompt(`${name} değerini güncelleyin`, original[name] ?? '');
      if (value === null) return;
      updated[name] = typeof original[name] === 'number' ? toNumber(value) : value;
    }
    updated.updatedAt = new Date().toISOString();
    db[key][index] = updated;
    writeDb(db);
    notify('Kayıt güncellendi. Geçmiş korundu.');
    window.location.reload();
  }

  function cancelRecord(button) {
    const key = getTableKey(button);
    const index = getIndex(button);
    const db = readDb();
    if (!key || !Array.isArray(db[key]) || !db[key][index]) return notify('Kayıt bağlantısı bulunamadı. Sayfayı yenileyin.');
    if (!window.confirm('Kayıt iptal edilsin mi? Kayıt silinmeyecek, geçmiş korunacak.')) return;
    const now = new Date().toISOString();
    db[key][index] = { ...db[key][index], status: 'iptal', cancelledAt: now, iptalTarihi: now };
    writeDb(db);
    notify('Kayıt iptal edildi; geçmiş korundu.');
    window.location.reload();
  }

  window.editRecord = editRecord;
  window.cancelRecord = cancelRecord;
  document.addEventListener('click', event => {
    const button = event.target.closest('button, a');
    if (!button) return;
    const label = (button.textContent || '').trim().toLocaleLowerCase('tr-TR');
    if (EDIT_WORDS.some(word => label === word || label.includes(word))) {
      event.preventDefault(); event.stopImmediatePropagation(); editRecord(button);
    } else if (CANCEL_WORDS.some(word => label === word || label.includes(word))) {
      event.preventDefault(); event.stopImmediatePropagation(); cancelRecord(button);
    }
  }, true);
})();
