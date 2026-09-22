# Üretim geliştirme planı

Bu dosya, canlı uygulamaya geçişte izlenecek güvenli sırayı kaydeder.

## Tamamlanan temel sürüm

- Tek sayfa mobil arayüz
- Şube bazlı demo görünümü
- Kasa, satış, stok, POS, personel ve müşteri işlemleri
- Yazdırılabilir rapor ve JSON yedek
- GitHub Pages yayını

## Sonraki güvenli aşamalar

1. Supabase Auth ile demo girişlerini değiştirmek.
2. PostgreSQL tablolarını oluşturmak.
3. Row Level Security ile admin/şube erişimini sunucu tarafında uygulamak.
4. `localStorage` yerine gerçek veritabanı bağlantısı eklemek.
5. İşlem iptali, audit log ve günlük raporları sunucu tarafında tutmak.
6. Sadece server-side proxy üzerinden AI hızlı giriş eklemek.
7. Test, yedekleme ve erişim kurtarma prosedürlerini tamamlamak.

Üretim erişim anahtarları repository'ye yazılmamalıdır.
