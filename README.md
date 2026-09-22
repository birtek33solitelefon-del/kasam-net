# kasam.net

Mobil uyumlu, yerel ön muhasebe başlangıç uygulaması.

## Kullanım

- `index.html` dosyasını açın veya GitHub Pages/Vercel ile yayınlayın.
- Demo girişleri: `admin / admin123`, `soli / soli123`, `cagdaskent / cagdas123`.
- Yönetici iki şubeyi görür; şube kullanıcıları yalnızca kendi şubesini görür.
- Tarih seçerek eski kayıt girebilirsiniz.
- Personel ve müşteri kartı oluşturup hesap hareketi, ödeme ve tahsilat ekleyebilirsiniz.
- Raporlar ekranından yazdırma penceresiyle PDF kaydedebilir, JSON yedek indirebilirsiniz.
- Telefon tarayıcısında “Ana ekrana ekle” ile uygulama gibi kullanılabilir.

## Önemli

Bu ilk yayın sürümü verileri tarayıcının localStorage alanında tutar; cihazlar arasında otomatik senkronizasyon ve gerçek sunucu tarafı yetkilendirme henüz bağlı değildir. Üretim kullanımı için Supabase Auth/Postgres ve sunucu tarafı AI anahtarı eklenmelidir. NVIDIA/API anahtarını HTML içine koymayın.
