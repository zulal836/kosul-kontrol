# Mini eval — lexical-baseline-short-excerpts

5 gerçek ToS kaynağından kısa kesit. Tam sözleşme değerlendirmesi değildir. Gold yalnızca bu kesitler için.

Sonuclar baslikta belirtilen calisma moduna aittir. Etiketler taslaktir; uzman onayi yoktur.

| Kaynak | Yakalanan | Kaçırılan | Yanlış alarm |
|---|---|---|---|
| Netflix | auto_renewal | — | — |
| Adobe | cancellation_fee | — | — |
| Reddit | — | content_license | — |
| Dropbox | refund_limit | — | cancellation_fee |
| Spotify | — | — | cancellation_fee |

TP=3, FP=2, FN=1. Precision=0.600, recall=0.750.

Ölçüm birimi: kesit başına kategori; negatif örnek risk içermeyen cayma hakkıdır. Tam metin recall veya hukuki doğruluk çıkarılamaz.

Baseline, Reddit lisansını kaçırır; iptal etme hakkını ücret sanarak Dropbox/Spotify üzerinde yanlış alarm üretebilir. LLM ile karşılaştırma için npm run eval:live çalıştırın.
