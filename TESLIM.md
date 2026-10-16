# Teslim öncesi

1. Bu ZIP'in içeriğini mevcut `kosul-kontrol` klasörüne kopyalayın; aynı adlı dosyaları değiştirin. `.env` bu pakette yoktur, anahtarınız korunur. Tekrar npm run build çalıştırırsanız sonuclar dosyaları korunur; kaynak build yalnızca kendi dosyalarını yazar.
2. Cypress kurulduktan sonra `node scripts/record-results.mjs` komutuyla gerçek deney çıktılarının replay videosunu kaydedin. Video: `cypress/videos/sonuclar.cy.js.mp4`. Süresini kontrol edin (≤90 sn). Bu video önceden kaydedilmiş gerçek JSON raporlarını gösterir; yeni canlı LLM/uzantı uçtan uca kanıtı değildir. Ekranda bu durum açıkça yazılıdır.
3. Canlı uzantı için `npm start` terminali açıkken Chrome uzantı kartını yenileyin; Dropbox sayfasında uzantıyı açın, yerel bağlantı kodunu ve onayı verip gerçek raporu alın. Bu canlı doğrulamayı yapmadan “uzantı uçtan uca geçti” yazmayın.
4. `docs/EVAL.md` ve `eval/reviewed-full-eval.json` içindeki örnekleri okuyun. İnceleme AI desteklidir; bağımsız insan/hukuk değerlendirmesi olarak sunmayın. Reddit kısmi ve Adobe plan bazlı kapsam açıkça belirtilmiştir. Yanlış alarm/kaçırma örnekleri korunmuştur.
5. GitHub'a `.env`, `node_modules`, `sonuclar.zip` ve kişisel ekran görüntülerini yüklemeyin. Kaynak kod, README, docs, eval ve güvenli artifacts sonuçları yüklenir. Video ayrı Classroom eki veya repo Releases olabilir. GitHub linkini ve hocanın istediği dosyaları Classroom'a ekleyip teslim düğmesini kullanıcı tamamlar.

## Bu pakette neler var?

Güncel README ve güvenlik/eval raporu, 35 bulgunun karar gerekçeleri, beş kaynak için eşleşen hash kayıtları, tamamlanmış tüm kayıtları içeren düzeltilmiş summary, gerçek kısa deney sonuçları için açıkça etiketlenmiş Cypress replay ekranı/testi/kayıt komutu. API anahtarı veya .env yoktur. Orijinal model bulguları silinmemiş veya iyileşmiş gibi değiştirilmemiştir.
