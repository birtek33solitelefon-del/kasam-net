# Düzenle / İptal düzeltmesi

Düzenle ve İptal onarım katmanı eklendi. Service Worker v4, legacy `index.html` içine `edit-cancel-repair.js` dosyasını otomatik olarak ekler; böylece ana dosyanın tamamını yeniden yazmadan güncel arayüzde çalışır.

- Düzenle mevcut localStorage kaydını günceller.
- İptal kaydı silmez; `status: iptal`, `cancelledAt` ve `iptalTarihi` alanlarını ekler.
- Eski cache sürümleri silinip v4 cache kullanılmaya başlanır.

Güncelleme görünmezse siteyi kapatın, Chrome site ayarlarından cache'i temizleyin ve canlı adresi yeniden açın.
