# kasam.net

Mobil uyumlu, yerel ön muhasebe uygulaması.

## Canlı adres

https://birtek33solitelefon-del.github.io/kasam-net/

## Mevcut özellikler

- Yönetici ve şube kullanıcıları
- Soli ve Çağdaşkent şube filtresi
- Personel ve müşteri kartları
- Personel ödeme/hakediş ve müşteri tahsilat/veresiye hareketleri
- Satış, malzeme, kasa, Cep POS, kurye ve reçete/maliyet ekranları
- Tarih seçimi, yazdırılabilir rapor ve JSON yedekleme
- PWA manifesti ve service worker

## Demo girişleri

- `admin / admin123`
- `soli / soli123`
- `cagdaskent / cagdas123`

## Önemli güvenlik notu

Bu sürüm GitHub Pages üzerinde statik çalışır ve verileri tarayıcı `localStorage` alanında tutar. Bu nedenle cihazlar arasında otomatik senkronizasyon ve gerçek sunucu tarafı yetkilendirme yoktur. Gerçek üretim için Supabase/Auth/Postgres ve şube bazlı RLS ayrıca kurulmalıdır. Gizli API anahtarlarını frontend'e veya bu repository'ye eklemeyin.

## Yayın

GitHub Pages kaynağı `main` dalı ve kök klasör olarak ayarlanmıştır. `main` dalına gönderilen değişiklikler Pages tarafından yayınlanır. Yayının tamamlanması birkaç dakika sürebilir.
