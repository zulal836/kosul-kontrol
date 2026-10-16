import 'dotenv/config';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
import {analyze} from '../server/llm.mjs';
const cases=JSON.parse(await readFile('eval/cases.json','utf8'));
if(!process.env.LLM_API_KEY)throw new Error('Tam metin eval icin LLM_API_KEY gerekli.');
const directory='artifacts/full-eval';await mkdir(directory,{recursive:true});
const summary=[];
for(const c of cases){
 const output=`${directory}/${c.id}.json`;
 // Preserve completed runs unless explicitly forced; never overwrite their annotations on a normal retry.
 if(!process.argv.includes('--force')){
  try{const old=JSON.parse(await readFile(output,'utf8'));
   if(old.result&&old.characters>=1500){
    console.log(`${c.id}: onceki tamamlanmis sonuc korundu.`);
    summary.push({id:c.id,status:'model-run-complete-needs-human-annotation',cached:true,characters:old.characters,truncated:old.result.truncated});continue;
   }
  }catch{}
 }
 console.log(`${c.id}: kaynak okunuyor...`);
 try{
  // Public first-party fragment linked by Adobe's legal page; ordinary page is only a JavaScript shell.
  const sourceURL=c.id==='adobe'?'https://www.adobe.com/cc-shared/fragments/legal/subscription/full-content.plain.html':c.url;
  const response=await fetch(sourceURL,{signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw new Error(`Kaynak HTTP ${response.status}`);
  const html=await response.text(),$=load(html);
  $('script,style,nav,header,footer,noscript,[hidden],[aria-hidden="true"]').remove();
  const root=$('main').first().length?$('main').first():$('body');
  let text=root.text().replace(/\s+/g,' ').trim();
  if(text.length<1500)throw new Error('Kaynak metni yetersiz; tarayicidan okumak gerekli.');
  let scope='Indirilen ana icerik';
  if(c.id==='adobe'){
   // Evaluate one complete plan, not a 160 KB mix of unrelated subscription plans.
   const hs=$('h1,h2,h3,h4,h5,h6').toArray();
   const h=hs.find(el=>{const t=$(el).text().toLowerCase();return t.includes('annual')&&t.includes('monthly');});
   if(h){
    const title=$(h).text().replace(/\s+/g,' ').trim();
    const level=Number(h.tagName.slice(1)),start=text.indexOf(title);
    const next=hs.slice(hs.indexOf(h)+1).find(el=>Number(el.tagName.slice(1))<=level);
    const nextTitle=next?$(next).text().replace(/\s+/g,' ').trim():null;
    const end=nextTitle?text.indexOf(nextTitle,start+title.length):-1;
    const section=start>=0?text.slice(start,end>=0?end:undefined).trim():'';
    if(section.length>=1500){text=section;scope='Adobe: annual / monthly plan bolumunun tamami; diger planlar kapsam disi.';}
   }
  }
  console.log(`${c.id}: ${text.length} karakter, model analizi...`);
  const result=await analyze(text,{onProgress:p=>console.log(`${c.id}: parca ${p.chunk}/${p.total}${p.retry?' — gecici HTTP '+p.status+', tekrar '+p.retry:''}`)});
  const item={id:c.id,source:response.url,sourcePage:c.url,scope,model:process.env.LLM_MODEL,fetched_at:new Date().toISOString(),sha256:createHash('sha256').update(text).digest('hex'),characters:text.length,result,review:result.risks.map(r=>({category:r.category,quote:r.quote,label:'UNREVIEWED',note:''})),missed:[],annotationStatus:'UNREVIEWED: tam metin gold etiketleme olmadan precision/recall hesaplanmaz.'};
  await writeFile(output,JSON.stringify(item,null,2));
  summary.push({id:c.id,status:'model-run-complete-needs-human-annotation',characters:text.length,truncated:result.truncated,scope});
  console.log(`${c.id}: KAYDEDILDI. Insan incelemesi bekliyor.`);
 }catch(e){console.log(`${c.id}: HATA: ${e.message}`);summary.push({id:c.id,status:'FAILED',error:e.message});}
 await writeFile(`${directory}/summary.json`,JSON.stringify(summary,null,2));
}
console.log(summary);if(summary.some(x=>x.status==='FAILED'))process.exitCode=1;
