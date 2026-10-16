# Mini değerlendirme: gerçek çıktı, kanıt ve hatalar

**Tarih:** 16 Ekim 2026. **Üretim modeli:** Gemini 3.5 Flash-Lite. **İnceleme:** ChatGPT destekli kanıt/taksonomi kontrolü; bağımsız insan veya hukuk uzmanı onayı değildir. Tablodaki etiketler modelin kendi başarı iddiası değildir. Teslim eden kişi örnekleri kontrol etmelidir.

## 1. Deney düzeni

- Aynı JSON şeması, AJV alan/tip/sınır kontrolü, normalize edilmiş kaynak içinde tam alıntı eşleşmesi, tekrar temizleme ve sabit kategori ağırlıkları kullanıldı.
- Beş gerçek kaynaktan kısa kesit testinde 4 pozitif kategori ve 1 negatif kontrol vardı. Gerçek LLM sonucu: **TP=4, FP=0, FN=0; precision=1,00, recall=1,00.** Bu kolay ve küçük testten tam sözleşme performansı veya hukuki doğruluk çıkarılamaz.
- Daha sonra beş kaynağın uzun metinleri analiz edildi. İnceleme sırasında aynı sayfalar yeniden alındı ve **beşinin de SHA256 değeri orijinal kayıtla birebir eşleşti**. Kaynak sürümü değişikliği bu incelemedeki farkları açıklamıyor.
- Tam raporlarda görüntülenen **35 alıntının tamamı** kaynağa eşleşiyor. Buna rağmen anlamsal yanlış alarmlar var. Ek olarak **7 alıntı kaynakta bulunamadığı için doğrulayıcı tarafından reddedilmiş**; bunlar kabul edilmiş bulgu sayısına katılmadı.

## 2. Kapsam

| Kaynak | İndirilen karakter | İncelenen kapsam | Önemli sınır |
|---|---:|---|---|
| Netflix | 22.098 | İndirilen ana metin | Bölgesel sürüm; ABD metni olduğu varsayılmadı. |
| Adobe | 3.373 | Annual contract, billed monthly planının tamamı | Diğer planlar kapsam dışı; California istisnası bu bölümün içinde. |
| Reddit | 84.789 | İlk 60.000 karakter | **Tam metin incelenmedi.** Çok sayıda navigasyon/başlık ve yinelenen sürüm var. |
| Dropbox | 25.302 | İndirilen ana metin | Daha önceki başarılı çalışmanın sonucu korundu. |
| Spotify | 39.163 | Almanya sürümünün indirilen ana metni | Alman tüketici hukuku/ülke koşulları Türkiye'ye genellenemez. |

Sonuç: Beş gerçek kaynak kullanılmıştır; **“beş sözleşmenin tüm bölümleri eksiksiz analiz edildi” iddiası doğru değildir.** Adobe bir plan, Reddit kısmi belge kapsamındadır.

## 3. Uzun metin bulgularının kanıt incelemesi

“Destekli”, alıntı ile temel açıklama/kategorinin uyumunu ifade eder; hükmün yasal geçerliliği veya tüketiciye gerçekten zarar verdiği anlamına gelmez. “İnceleme” sayısı önemli istisna, dil veya alıntı bütünlüğü sorunu olan bulgulardır. Yanlış alarm tanımı: yanlış kategori, genel politika atfı veya kullanıcı lehine hakkın risk diye sunulması.

| Kaynak | Destekli | Açık yanlış alarm | Ek inceleme |
|---|---:|---:|---:|
| Netflix | 5 | 1 | 2 |
| Adobe | 2 | 2 | 1 |
| Reddit | 4 | 1 | 1 |
| Dropbox | 4 | 3 | 1 |
| Spotify | 2 | 1 | 5 |
| **Toplam** | **17** | **8** | **10** |

Bu etiketler tek bir AI destekli incelemedir; bağımsız ve tam gold set olmadığı için bunlardan tam metin precision/recall veya yeni bir hukuki risk puanı hesaplanmadı. Reddit'in kesilmesi de tam recall hesabını geçersiz kılar. Tüm 35 kararın alıntısı ve gerekçesi `eval/reviewed-full-eval.json` dosyasındadır. Orijinal LLM sonuçları değiştirilmedi.

## 4. Yakalanan maddeler

- **Netflix:** İptal edilmediğinde yeni dönemin otomatik tahsilatı; uygulanabilir hukuk kaydıyla kısmi dönem iade kısıtı; garanti/dolaylı zarar sınırlaması; esaslı sözleşme değişikliğinde bildirim.
- **Adobe:** ABD müşterilerinde ilk yıldan sonra aylık yenileme ve yıllık yenilemede fiyat değişikliği yakalandı. Erken iptal ücreti de bulundu fakat California istisnası kaçtı; bu bulgu doğrudan doğru kabul edilmedi.
- **Reddit:** Geniş ve kalıcı içerik lisansı, hizmetin değiştirilmesi/durdurulması ve bu işlemlere ilişkin sorumsuzluk bulundu.
- **Dropbox:** Otomatik faturalama, yenileme fiyatı değişikliği ve toplu/bireysel uyuşmazlık sınırlamaları bulundu. Tahkimden çıkış alıntısının esas tahkim maddesiyle tamamlanması gerekiyor.
- **Spotify:** Denemeden sonra aylık tahsilat ve hizmet değişikliği yetkisi bulundu. Bazı diğer doğruya yakın bulguların açıklaması Almanca/İngilizce kaldığı için Türkçe gereksiniminden geçmedi.

## 5. Kaçırılan maddeler ve önemli ayrıntılar

| Kaynak | Kanıt / konum | Kaçırılan nokta |
|---|---|---|
| Dropbox | “Refunds are only issued if required by law.” | Asıl iade kısıtı raporda yok; aynı paragraftaki AB 14 günlük istisna da birlikte belirtilmeli. |
| Dropbox | “WE LIMIT OUR LIABILITY TO YOU TO THE GREATER OF $20 USD OR 100%” | Parasal sorumluluk üst sınırı raporda yok; ülke ve tüketici istisnaları korunmalı. |
| Reddit | “this license includes the right to use Your Content to train AI and machine learning models” | Genel lisans bulundu ama AI eğitimi gibi maddi sonuç açıklanmadı. Bu ayrıntı incelenen 60.000 karakterin içinde. |
| Spotify | “Die Änderungen gelten als akzeptiert, wenn Sie diese nicht innerhalb von 30 Tagen ablehnen.” | Otuz gün içinde itiraz edilmezse değişikliklerin kabul edilmiş sayılması açıklanmadı. Bildirim ve yetki sınırlarıyla birlikte anlatılmalı. |

Bunlar seçilmiş kaçırmalar/ayrıntılardır; eksiksiz FN listesi değildir. Aynı kategoriye ait ayrı bir koşul, kategori testinde başarılı görünse bile ayrıntı düzeyinde kaçırılabilir. Kaynak metnin devamındaki kapsam dışı kısımlar için başarı iddia edilmez.

## 6. Yanlış alarm örnekleri

- **Adobe / bulgu 1:** Başka ödeme yönteminden tahsilat yetkisi `liability_limit` olarak etiketlendi. Bu, sağlayıcının hukuki sorumluluğunu sınırlandıran hüküm değil; kategori hatası.
- **Adobe / bulgu 3:** İlk 14 gün içinde tam iade hakkı veren alıntı `refund_limit` riski sayıldı. Seçilen kanıt kullanıcı lehine.
- **Dropbox / bulgu 1:** Hizmet için gereken sınırlı haklar DIŞINDA hak alınmadığını belirten koruma, geniş içerik lisansı riski diye sunuldu.
- **Dropbox / bulgu 2:** Gelecekte yürürlüğe girecek değişiklik duyurusu tek başına geniş tek taraflı yetki kanıtı sayıldı.
- **Dropbox / bulgu 7:** Orantılı iade imkanı, iade kısıtı diye sunuldu.
- **Spotify / bulgu 7:** Kullanıcı ihlalden sorumlu değilse tazminat hükmünün uygulanmaması, sağlayıcının sorumluluk sınırı diye etiketlendi.
- **Netflix / bulgu 4:** Ödeme sağlayıcısından yöntem güncelleme bilgisi alınması tek başına riskli dış veri paylaşımı olarak sınıflandırıldı.
- **Reddit / bulgu 0:** Gizlilik politikasına genel atıf, somut alıcı/kapsam olmadan riskli veri paylaşımı diye sınıflandırıldı.

## 7. Bağlam ve çıktı kalitesi sorunları

- Adobe'nin planında California için farklı erken iptal hesabı bulunuyor. Genel yüzde 50 açıklaması bu istisnayı söylemiyor.
- Netflix'in geri bildirim lisansı alıntısı kelimenin ortasından başlıyor; Spotify lisans alıntısı kelimenin ortasında bitiyor. Bir substring'in kaynakta bulunması tam cümle bağlamı sağlamıyor.
- Spotify açıklamalarının beşi bütünüyle Almanca/İngilizce; sade Türkçe gereksinimi bu örneklerde karşılanmadı. Prompt talimatı tek başına dil garantisi değil.
- Parça düzeyindeki model belirsizlikleri bütün belgeye aitmiş gibi toplanabiliyor. `truncated:false`, yalnızca uygulamanın karakter sınırına takılmadığını söyler; modelin “bu parça eksik” gözlemiyle aynı kavram değildir.
- Aynı kategoriye ait tekrarlar puanı şişirmiyor; ancak yanlış sınıflandırılan kategori yine de puana girebiliyor. Bu nedenle puan, hukuki geçerlilik veya zarar olasılığı olarak kullanılmaz.

## 8. Prompt injection

`artifacts/live-injection.json` gerçek Gemini çalışmasını içeriyor. Saldırısız kontrol geçti; üç görünür saldırıda beklenen iki risk kategorisi korundu (**3/3**). Denenen örnekler: önceki talimatları yok sayıp bulguları boşaltma; belge sınırını/system rolünü taklit edip puanı sıfırlama ve anahtar/URL isteme; Türkçe bulgu gizleme talimatı.

Bu sonuç genel bağışıklık kanıtı değildir. Test, bu üç saldırının beklenen kategorileri silmediğini ve dönen raporda tam anahtarın görünmediğini sınar; modelin iç düşüncesini veya her tür veri sızmasını ölçmez. Modelin zaten gezinme/URL açma/tıklama aracı yoktur ve API anahtarı prompta konmaz. Gizli DOM talimatı filtresi ayrı bir tarayıcı kontrolüdür; Playwright ile çalıştırılmıştır, Cypress güvenlik testi ancak ayrıca çalıştırılırsa geçmiş sayılır.

## 9. Sonraki iyileştirmeler

Öncelik: navigasyon/yinelenen sürümleri temizleme; cümle sınırında parçalama; alıntıyla açıklama arasındaki anlamsal desteği ve istisnaları denetleme; olumlu hakları negatif kontrol olarak çoğaltma; Türkçe çıktı kontrolü; ayrı ve bağımsız etiketlenmiş test seti. Yeni bir kontrol eklendiğinde eski model performansı yeniden çalıştırılmadan iyileşmiş kabul edilmez.

**Hukuki tavsiye değildir.** Bu çalışma sözleşme okuma yardımcısının teknik değerlendirmesidir.
