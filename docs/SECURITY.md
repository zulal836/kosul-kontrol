# Güvenlik ve gözlenen testler

Model: Gemini 3.5 Flash-Lite. Sayfa ve model cevabı güvenilmeyen girdidir. API anahtarı yerel sunucunun `.env` ortamında kalır, Chrome sayfasına veya prompta aktarılmaz. Canlı API 127.0.0.1'e bağlıdır, LOCAL_TOKEN ile korunur. CORS yalnızca Chrome uzantı origin'lerine izin verir. Metin kullanıcı onayından sonra gönderilir; sağlayıcının kendi veri politikası ayrıca geçerlidir.

## Sınırlar

1. Sayfa Chrome ISOLATED world içinde gerçek `@page-agent/page-controller` ile okunur; tam PageAgent eylem döngüsü yoktur. Sayfaya tıklama, script yürütme, dış URL açma veya model aracı verilmez.
2. Gizli/script/form metinleri capture filtresinde çıkarılır. Görünür saldırı talimatları veri olarak kalabilir; promptta user rolünde JSON document alanına konur. Sabit system mesajını değiştirmez.
3. Strict JSON schema + AJV tip/enum/alan/boyut kontrolleri + kaynak alıntı eşleşmesi + tekrar temizleme uygulanır. Dinamik AJV derlemesi yalnızca sunucudadır; Chrome capture paketinden çıkarılmıştır.
4. Model metni UI'da textContent ile çizilir; HTML çalıştırılmaz. Key loglanmaz. Sunucu ham sözleşmeyi diske yazmaz. Eval çıktıları açık komutla yerel dosyalara yazılır.
5. Bir alıntının bulunması, yorumun anlamsal veya hukuki doğruluğunu kanıtlamaz. Olumlu hakkın risk sayılması ve yanlış kategori örnekleri gerçek evalde görülmüştür.

## Gözlenen kanıt

- 9 Node testi yerel geliştirme ortamında geçti: şema, alıntı, skor, düşük güven, kesilme, dedup, bozuk JSON/yarım çıktı, prompt rol ayrımı ve API yetkilendirme.
- Playwright Chromium: gerçek DOM capture motorunda gizli talimatların çıkarılması, görünür talimatın veri olarak kalması; UI mutlu yol ve belirsizlik.
- Gerçek LLM: `artifacts/live-injection.json` saldırısız kontrol true ve üç görünür saldırıda 3/3. Bu testler Gemini'ye yapılan gerçek çağrılardır; genel güvenlik garantisi değildir.
- Uzun metin raporlarında 7 kaynak dışı alıntı otomatik reddedildi. Buna rağmen kabul edilen 35 bulguda açık yanlış alarmlar görüldü; `docs/EVAL.md` bunları inceler.
- Cypress dosyaları repoda bulunur. Test/video çıktısı görülmeden “Cypress geçti” iddia edilmez. Bir replay videosu, kaydedilmiş çıktıyı gösterir; yeni LLM isteği veya Chrome uzantısının tam uçtan uca testi değildir.

## Kapsam dışı

Makinedeki zararlı yazılım, başka yetkili uzantılar, hesabın ele geçirilmesi ve sağlayıcı güvenliği kapsam dışı. Iframe/PDF/OCR/kapalı alanlar desteklenmez. Yerel bağlantı kodu API anahtarı değildir. İnceleme yapmadan risk puanına dayanarak karar verilmez.
