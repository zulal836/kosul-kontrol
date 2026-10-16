import 'dotenv/config';import {readFile,mkdir,writeFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
import {analyze} from '../server/llm.mjs';
const cases=JSON.parse(await readFile('eval/cases.json','utf8')),live=process.argv.includes('--live');
if(live&&!process.env.LLM_API_KEY)throw new Error('Canlı eval için .env dosyasında kendi LLM_API_KEY değerinizi tanımlayın.');
// Deliberately simple and fixed lexical baseline. NOT the extension's LLM, not a claimed model result.
function baseline(text){const out=[];if(/automatically renew/i.test(text))out.push('auto_renewal');if(/cancel|widerrufen/i.test(text))out.push('cancellation_fee');if(/refunds are only/i.test(text))out.push('refund_limit');return out;}
const rows=[];let tp=0,fp=0,fn=0;
for(const c of cases){
 const response=live?await analyze(c.text):null,predicted=live?[...new Set(response.risks.filter(x=>x.confidence>=.75).map(x=>x.category))]:baseline(c.text);
 const caught=c.gold.filter(x=>predicted.includes(x)),missed=c.gold.filter(x=>!predicted.includes(x)),falseAlarms=predicted.filter(x=>!c.gold.includes(x));
 tp+=caught.length;fn+=missed.length;fp+=falseAlarms.length;
 const {text:sourceExcerpt,...meta}=c;
 rows.push({...meta,sha256:createHash('sha256').update(c.text).digest('hex'),predicted,caught,missed,falseAlarms,...(response?{response}:{})});
}
const result={mode:live?'live-llm-short-excerpts':'lexical-baseline-short-excerpts',timestamp:new Date().toISOString(),model:live?process.env.LLM_MODEL||'gpt-4.1-mini':null,scope:'5 gerçek ToS kaynağından kısa kesit. Tam sözleşme değerlendirmesi değildir. Gold yalnızca bu kesitler için.',tp,fp,fn,precision:tp+fp?tp/(tp+fp):null,recall:tp+fn?tp/(tp+fn):null,rows};
await mkdir('artifacts',{recursive:true});const name=live?'live-eval':'baseline-eval';await writeFile(`artifacts/${name}.json`,JSON.stringify(result,null,2));
const fmt=a=>a.length?a.join(', '):'—';
const md=`# Mini eval — ${result.mode}\n\n${result.scope}\n\nSonuclar baslikta belirtilen calisma moduna aittir. Etiketler taslaktir; uzman onayi yoktur.\n\n| Kaynak | Yakalanan | Kaçırılan | Yanlış alarm |\n|---|---|---|---|\n`+rows.map(r=>`| ${r.name} | ${fmt(r.caught)} | ${fmt(r.missed)} | ${fmt(r.falseAlarms)} |`).join('\n')+`\n\nTP=${tp}, FP=${fp}, FN=${fn}. Precision=${result.precision?.toFixed(3)}, recall=${result.recall?.toFixed(3)}.\n\nÖlçüm birimi: kesit başına kategori; negatif örnek risk içermeyen cayma hakkıdır. Tam metin recall veya hukuki doğruluk çıkarılamaz.\n\nBaseline ve gercek LLM raporlari ayri dosyalardadir. Karsilastirma yalnizca bu kisa kesitler kapsaminda yapilmalidir.\n`;
await writeFile(`artifacts/${name}.md`,md);console.log(md);
