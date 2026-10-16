import {PageController} from '@page-agent/page-controller';
import {normalize} from './text.mjs';
export async function capture(){
 // Alibaba page-agent's real DOM engine, locally bundled; no LLM key or action agent in the page.
 const controller=new PageController({viewportExpansion:-1,highlightOpacity:0,highlightLabelOpacity:0});
 let state;
 try{state=await controller.getBrowserState();}finally{await controller.cleanUpHighlights();}
 // Supplement original visible prose for verbatim citations (agent output can add index markup).
 const root=document.querySelector('main,article,[role="main"]')||document.body;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;const segments=[];
 while((node=walker.nextNode())){
  const el=node.parentElement;
  if(!el||el.closest('script,style,noscript,textarea,input,select,[hidden],[aria-hidden="true"]'))continue;
  let hidden=false;
  for(let a=el;a;a=a.parentElement){const s=getComputedStyle(a);if(s.display==='none'||s.visibility==='hidden'||s.visibility==='collapse'||Number(s.opacity)===0){hidden=true;break;}}
  if(hidden||!el.getClientRects().length)continue;
  if(node.textContent.trim())segments.push(node.textContent);
 }
 const text=normalize(segments.join(' '));
 return {text:text.slice(0,100000),truncated:text.length>100000,url:location.origin+location.pathname,title:document.title,engine:'alibaba/page-agent PageController 1.12.4',agentCharacters:state.content.length,scope:'Görünür ana içerik; iframe, kapalı açılır alanlar, PDF ve görsel metni dahil değil.'};
}
if(typeof chrome!=='undefined'&&chrome.runtime?.id){capture().then(result=>chrome.runtime.sendMessage({type:'capture-result',result})).catch(()=>chrome.runtime.sendMessage({type:'capture-error'}));}
