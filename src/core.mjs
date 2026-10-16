import Ajv from 'ajv';
import {schema,weights} from './schema.mjs';
const validate = new Ajv({allErrors:true,strict:true}).compile(schema);
export const normalize = s => s.normalize('NFKC').replace(/\s+/gu,' ').trim();
export function verify(candidate,source){
 if(!validate(candidate)) throw new Error('JSON şeması geçersiz; rapor reddedildi.');
 const text=normalize(source),risks=[],rejected=[];
 for(const r of candidate.risks){
  const quote=normalize(r.quote),start=text.indexOf(quote);
  if(start<0){rejected.push({category:r.category,reason:'Alıntı kaynakta yok'});continue;}
  if(risks.some(x=>x.category===r.category&&x.quote===quote))continue;
  risks.push({...r,quote,start,end:start+quote.length});
 }
 return {risks,rejected,uncertainties:[...candidate.uncertainties,...(rejected.length?['Kaynakta bulunamayan alıntılar reddedildi.']:[])]};
}
export function report(parts,{truncated=false,chunks=1}={}){
 const risks=[],rejected=[],uncertainties=[];
 for(const p of parts){for(const r of p.risks)if(!risks.some(x=>x.category===r.category&&x.quote===r.quote))risks.push(r);rejected.push(...p.rejected);uncertainties.push(...p.uncertainties);}
 const confirmed=risks.filter(x=>x.confidence>=0.75);
 if(risks.some(x=>x.confidence<0.75))uncertainties.push('Düşük güvenli maddeler skora katılmadı; bağlamı inceleyin.');
 if(truncated)uncertainties.push('Metin sınırı aşıldı; belgenin tamamı incelenmedi.');
 if(!risks.length)uncertainties.push('Doğrulanmış bulgu çıkmadı. Bu, belgenin risksiz olduğunu göstermez.');
 const score=confirmed.length?[...new Set(confirmed.map(x=>x.category))].reduce((s,c)=>s+weights[c],0):null;
 return {version:1,score,status:uncertainties.length?'review':'complete',risks,rejected,uncertainties:[...new Set(uncertainties)],chunks,truncated,disclaimer:'Hukuki tavsiye değildir. Bilgilendirme amaçlıdır; önemli kararlar için bir hukuk uzmanına danışın.'};
}
export function chunkText(text,size=10000,overlap=400){
 const s=normalize(text),out=[];for(let i=0;i<s.length;i+=size-overlap){out.push(s.slice(i,i+size));if(i+size>=s.length)break;}return out;
}
