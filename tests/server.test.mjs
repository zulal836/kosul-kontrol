import test from 'node:test';import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import {demoText} from '../src/fixtures.mjs';
test('canlı API bağlantı kodu ister; anahtarsız başarı taklidi yapmaz',async()=>{
 const port=19000+Math.floor(Math.random()*1000),base=`http://127.0.0.1:${port}`;
 const server=spawn(process.execPath,['server/index.mjs'],{env:{...process.env,PORT:String(port),DEMO_MODE:'0',LOCAL_TOKEN:'local-test-code',LLM_API_KEY:''},stdio:'ignore'});
 try{
  let ready=false;for(let i=0;i<60;i++){try{if((await fetch(base+'/health')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,50));}assert.ok(ready);
  const send=token=>fetch(base+'/api/analyze',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify({text:demoText})});
  assert.equal((await send()).status,401);assert.equal((await send('wrong')).status,401);
  const authorized=await send('local-test-code');assert.equal(authorized.status,502);assert.match((await authorized.json()).error,/LLM_API_KEY/);
 }finally{server.kill();}
});
