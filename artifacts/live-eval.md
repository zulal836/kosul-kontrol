# Mini eval — live-llm-short-excerpts

5 gerçek ToS kaynağından kısa kesit. Tam sözleşme değerlendirmesi değildir. Gold yalnızca bu kesitler için.

Sonuclar baslikta belirtilen calisma moduna aittir. Etiketler taslaktir; uzman onayi yoktur.

| Kaynak | Yakalanan | Kaçırılan | Yanlış alarm |
|---|---|---|---|
| Netflix | auto_renewal | — | — |
| Adobe | cancellation_fee | — | — |
| Reddit | content_license | — | — |
| Dropbox | refund_limit | — | — |
| Spotify | — | — | — |

TP=4, FP=0, FN=0. Precision=1.000, recall=1.000.

Ölçüm birimi: kesit başına kategori; negatif örnek risk içermeyen cayma hakkıdır. Tam metin recall veya hukuki doğruluk çıkarılamaz.

Baseline, Reddit lisansını kaçırır; iptal etme hakkını ücret sanarak Dropbox/Spotify üzerinde yanlış alarm üretebilir. LLM ile karşılaştırma için npm run eval:live çalıştırın.
