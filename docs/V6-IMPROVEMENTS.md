# v6 geliştirmeleri

- Eski `kasamNetV1` kayıtları ilk açılışta `kasamNetProV1` yapısına aktarılır.
- Hızlı işlem tutar ayrıştırması düzeltildi: `2.200 TL`, `2200 TL` ve `2200,50 TL` desteklenir.
- Hızlı işlem artık ödeme/tahsilat/kasa giriş-çıkış ayrımını kontrol eder; anlaşılmayan metni kaydetmez.
- Menü listelerine arama alanı eklendi.
- Service Worker v6 eski cache'leri temizler ve geliştirme dosyasını HTML'e bağlar.
