/* kasam.net v6 improvements loaded by the service worker.
   Keeps the simple UI, fixes quick-entry semantics, and migrates legacy local data. */
(() => {
  const NEW_KEY = 'kasamNetProV1';
  const OLD_KEY = 'kasamNetV1';
  const BRANCHES = ['Soli', 'Çağdaşkent'];

  const read = key => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } };
  const write = value => localStorage.setItem(NEW_KEY, JSON.stringify(value));
  const uid = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  const today = () => new Date().toISOString().slice(0, 10);
  const toast = (message, error = false) => {
    const node = document.getElementById('toast');
    if (!node) return;
    node.textContent = message;
    node.classList.toggle('err', error);
    node.classList.remove('hidden');
    setTimeout(() => node.classList.add('hidden'), 2600);
  };

  function migrate() {
    if (read(NEW_KEY)) return;
    const old = read(OLD_KEY);
    if (!old) return;
    const state = { employees: [], customers: [], sales: [], materials: [], cash: [], pos: [], audit: [] };
    const copy = (source, target, mapper) => (Array.isArray(old[source]) ? old[source] : []).forEach(item => state[target].push(mapper(item)));
    copy('employees', 'employees', x => ({ id: x.id || uid(), name: x.name || x.n || '', role: x.role || x.job || '', phone: x.phone || '', branch: x.branch || 'Soli', date: x.date || today(), status: 'aktif' }));
    copy('customers', 'customers', x => ({ id: x.id || uid(), name: x.name || x.n || '', phone: x.phone || '', note: x.note || '', branch: x.branch || 'Soli', date: x.date || today(), status: 'aktif' }));
    copy('sales', 'sales', x => ({ id: x.id || uid(), date: x.date || today(), branch: x.branch || 'Soli', customer: x.customer || x.name || '', product: x.product || x.item || '', total: Number(x.total || x.amount || 0), status: x.status || 'aktif' }));
    copy('materials', 'materials', x => ({ id: x.id || uid(), date: x.date || today(), branch: x.branch || 'Soli', product: x.product || x.name || '', qty: Number(x.qty || x.quantity || 0), cost: Number(x.cost || 0), status: x.status || 'aktif' }));
    copy('cash', 'cash', x => ({ id: x.id || uid(), date: x.date || today(), branch: x.branch || 'Soli', type: x.type || x.ty || 'giriş', amount: Number(x.amount || 0), note: x.note || '', status: x.status || 'aktif' }));
    state.audit.push({ id: uid(), date: today(), user: 'Sistem', action: 'Eski veriler yeni sürüme aktarıldı' });
    write(state);
  }

  function parseAmount(text) {
    const match = text.match(/([0-9]{1,3}(?:[. ][0-9]{3})*(?:,[0-9]{1,2})?|[0-9]+(?:[.,][0-9]{1,2})?)\s*(?:tl|₺)/i);
    if (!match) return 0;
    return Number(match[1].replace(/[. ]/g, '').replace(',', '.')) || 0;
  }

  function installQuickEntry() {
    const button = document.getElementById('quickBtn');
    const input = document.getElementById('quick');
    if (!button || !input || button.dataset.v6Bound) return;
    button.dataset.v6Bound = '1';
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const text = input.value.trim();
      const amount = parseAmount(text);
      if (!text || !amount) return toast('Tutar bulunamadı. Örnek: Ahmet’e 2.200 TL ödeme yaptım', true);
      const low = text.toLocaleLowerCase('tr-TR');
      const state = read(NEW_KEY) || { employees: [], customers: [], sales: [], materials: [], cash: [], pos: [], audit: [] };
      const user = (() => { try { return JSON.parse(localStorage.getItem('kasamNetProSession') || 'null'); } catch { return null; } })();
      const branch = user?.role === 'branch' ? user.branch : 'Soli';
      const employee = (state.employees || []).find(x => low.includes(String(x.name || '').toLocaleLowerCase('tr-TR')));
      const customer = (state.customers || []).find(x => low.includes(String(x.name || '').toLocaleLowerCase('tr-TR')));
      let type = low.includes('giriş') || low.includes('gelir') ? 'giriş' : 'çıkış';
      let note = text;
      if (employee && (low.includes('ödeme') || low.includes('avans') || low.includes('maaş'))) {
        state.cash.push({ id: uid(), date: today(), branch: employee.branch || branch, type: 'çıkış', amount, note: `Personel ödemesi: ${employee.name}. ${note}`, status: 'aktif' });
      } else if (customer && (low.includes('tahsilat') || low.includes('aldım') || low.includes('ödedi'))) {
        state.cash.push({ id: uid(), date: today(), branch: customer.branch || branch, type: 'giriş', amount, note: `Müşteri tahsilatı: ${customer.name}. ${note}`, status: 'aktif' });
      } else if (low.includes('kasa') || low.includes('giriş') || low.includes('çıkış') || low.includes('gelir') || low.includes('gider')) {
        state.cash.push({ id: uid(), date: today(), branch, type, amount, note, status: 'aktif' });
      } else {
        return toast('İşlem türü anlaşılmadı. “kasa giriş”, “kasa çıkış”, “Ahmet’e ödeme” veya “Müşteri tahsilatı” yazın.', true);
      }
      state.audit = state.audit || [];
      state.audit.unshift({ id: uid(), date: today(), user: user?.name || 'Sistem', action: `Hızlı işlem: ${text}` });
      write(state);
      input.value = '';
      if (typeof window.render === 'function') window.render();
      toast('Hızlı işlem güvenli biçimde kaydedildi');
    }, true);
  }

  function addSearch() {
    if (document.getElementById('v6Search') || !document.getElementById('content')) return;
    const box = document.createElement('div');
    box.className = 'panel';
    box.innerHTML = '<div class="field" style="margin:0"><label>Listede ara</label><input id="v6Search" placeholder="Müşteri, ürün, not veya şube..." autocomplete="off"></div>';
    document.getElementById('content').prepend(box);
    document.getElementById('v6Search').addEventListener('input', event => {
      const query = event.target.value.toLocaleLowerCase('tr-TR');
      document.querySelectorAll('#content tbody tr').forEach(row => { row.style.display = !query || row.innerText.toLocaleLowerCase('tr-TR').includes(query) ? '' : 'none'; });
    });
  }

  migrate();
  installQuickEntry();
  if (document.getElementById('content')) addSearch();
  new MutationObserver(() => { installQuickEntry(); addSearch(); }).observe(document.body, { childList: true, subtree: true });
})();
