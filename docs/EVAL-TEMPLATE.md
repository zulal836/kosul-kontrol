# Tam metin değerlendirme — teslim öncesi doldurun

Durum: HENÜZ GERÇEK LLM İLE ÇALIŞTIRILMADI. Aşağıdaki boşluklar sonuç değildir.

Model / sürüm: … | Prompt git commit: … | Tarih: … | İnceleyen: …

Her kaynağın ülkesini, planını, SHA256 değerini ve incelenen karakter sayısını `artifacts/full-eval` çıktısıyla eşleyin. Kaynak değiştiyse etiketi yenileyin. Belge kesilmişse tam metin recall raporlamayın.

| Kaynak | Ülke / plan | Yakalanan madde + kanıt | Kaçırılan madde + kanıt | Yanlış alarm + gerekçe | İstisna / belirsizlik |
|---|---|---|---|---|---|
| Netflix | … | … | … | … | … |
| Adobe | … | … | … | … | … |
| Reddit | … | … | … | … | … |
| Dropbox | … | … | … | … | … |
| Spotify | … | … | … | … | … |

Madde düzeyinde TP: doğru kategori ve anlamı destekleyen alıntı. FP: alıntı var ama risk yorumu yanlış, kullanıcı lehine hak risk sayılmış veya istisna göz ardı edilmiş. FN: gold listesinde olan fakat raporda bulunmayan madde. Aynı maddeyi birden fazla bulgu diye saymayın. İkinci insan incelemesiyle anlaşmazlıkları kaydedin.

Precision = TP / (TP + FP), Recall = TP / (TP + FN). Gold etiketlenmeyen yeni bulgu otomatik FP değildir. 5 metin küçük örneklemdir; genelleme yapmayın.
