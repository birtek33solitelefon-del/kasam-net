# Edit / İptal düzeltmesi

`edit-cancel-repair.js` legacy statik arayüz için güvenli bir onarım katmanıdır.

- Düzenleme mevcut kaydı günceller.
- İptal kaydı silmez; `status: iptal`, `cancelledAt` ve `iptalTarihi` alanlarını ekler.
- Değişiklikler `kasamNetV1` localStorage verisine yazılır.
- Service Worker v3 eski önbelleği temizleyip onarım dosyasını cache'ler.

## Güncelleme görünmüyorsa

1. Canlı siteyi açın.
2. Android Chrome'da site ayarlarından önbelleği temizleyin.
3. Siteyi tamamen kapatıp tekrar açın.
4. Gerekirse gizli sekmede deneyin.

Gerçek sunucu veritabanı kullanılmadığı için bu onarım yalnızca aynı cihaz ve tarayıcıdaki localStorage kayıtlarını etkiler.
