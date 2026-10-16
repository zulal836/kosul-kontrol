import {demoText} from './fixtures.mjs';
import {labels} from './schema.mjs';
const $=id=>document.getElementById(id),isExtension=location.protocol==='chrome-extension:';
let captured=null,lastReport=null,targetId;
function status(s){$('status').textContent=s;}
function render(r){
 lastReport=r;$('results').hidden=false;$('score').textContent=r.score===null?'—':`${r.score}/100`;
 $('verdict').textContent=r.status==='review'?'İnsan incelemesi gerekli':'Doğrulanmış bulgular';
 $('score-note').textContent='Bu puan risk olasılığı değildir. Sabit kategori ağırlıklarının toplamıdır; düşük güvenli bulgular dahil edilmez.';
 $('mode').textContent=r.mode==='fixture-demo'?'TEST VERİSİ · Gerçek LLM analizi değil':'CANLI LLM · Alıntılar kodla doğrulandı';
 $('risks').replaceChildren();
 for(const risk of r.risks){const card=document.createElement('article');card.className='risk';
  const title=document.createElement('h3');title.textContent=labels[risk.category]||risk.category;
  const confidence=document.createElement('small');confidence.textContent=`Model güveni: %${Math.round(risk.confidence*100)} · ${risk.confidence<0.75?'Skora dahil değil':'Alıntı eşleşti'}`;
  const quote=document.createElement('blockquote');quote.textContent=risk.quote;
  const explanation=document.createElement('p');explanation.textContent=risk.explanation;
  card.append(title,confidence,quote,explanation);$('risks').append(card);
 }
 $('uncertainties').replaceChildren();for(const u of r.uncertainties){const li=document.createElement('li');li.textContent=u;$('uncertainties').append(li);}
 $('warning-box').hidden=!r.uncertainties.length;$('download').hidden=false;
}
async function init(){
 if(isExtension){$('demo-tools').hidden=true;$('settings').hidden=false;$('mode').textContent='Sayfa metni henüz LLM sağlayıcısına gönderilmedi.';
  const settings=await chrome.storage.local.get(['localToken']);$('token').value=settings.localToken||'';
  ({targetTabId:targetId}=await chrome.storage.session.get(['targetTabId']));
  chrome.runtime.onMessage.addListener((message,sender)=>{
   if(sender.tab?.id!==targetId)return;
   if(message.type==='capture-result'){captured=message.result;showCapture();}
   if(message.type==='capture-error')status('Bu sayfadan metin alınamadı. Normal bir web sayfasında yeniden deneyin.');
  });
  try{await chrome.scripting.executeScript({target:{tabId:targetId},files:['capture.js']});}catch{status('Sayfayı yeniden açıp uzantı simgesine tıklayın. Chrome iç sayfaları ve PDF desteklenmiyor.');}
 }else{captured={text:demoText,title:'Örnek Abonelik Koşulları',scope:'Sentetik test metni',url:'Yerel demo'};$('mode').textContent='TEST VERİSİ · Gerçek LLM analizi değil';showCapture();}
}
function showCapture(){
 $('source').textContent=`${captured.title} · ${captured.text.length} karakter`;
 $('preview').textContent=captured.text;$('scope').textContent=captured.scope+(captured.truncated?' · Metin kesildi.':'');
 $('analyze').disabled=false;status('Metin hazır. Önizlemeyi kontrol edip gönderime izin verin.');
}
$('analyze').addEventListener('click',async()=>{
 if(!$('consent').checked){status('Önce metnin LLM sağlayıcısına gönderilmesine izin verin.');return;}
 $('analyze').disabled=true;$('results').hidden=true;$('download').hidden=true;lastReport=null;status('Metin inceleniyor; alıntılar doğrulanıyor…');
 try{
  const token=$('token').value;if(isExtension)await chrome.storage.local.set({localToken:token});
  const response=await fetch(isExtension?'http://127.0.0.1:8787/api/analyze':'/api/analyze',{method:'POST',signal:AbortSignal.timeout(300000),headers:{'Content-Type':'application/json',...(isExtension?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify({text:captured.text,scenario:$('scenario').value})});
  const data=await response.json();if(!response.ok)throw new Error(data.error||'Analiz başarısız.');
  if(captured.truncated){data.uncertainties.push('Tarayıcı metin sınırına ulaştı; kaynak tamamlanmadı.');data.truncated=true;data.status='review';}
  render(data);status('Rapor hazır. Alıntının eşleşmesi, yorumun hukuken doğru olduğunu kanıtlamaz.');
 }catch(e){status(e.name==='AbortError'?'İstek zaman aşımına uğradı. Yeniden deneyin.':e.message==='Failed to fetch'?'Yerel sunucuya bağlanılamadı. npm start komutunu çalıştırın.':e.message);}finally{$('analyze').disabled=false;}
});
$('download').addEventListener('click',()=>{if(!lastReport)return;const blob=new Blob([JSON.stringify({...lastReport,source:captured.url},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='kosul-kontrol-rapor.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
init();
