import {spawn} from 'node:child_process';
let server,proc;
try{
 let ready=false;
 try{ready=(await fetch('http://127.0.0.1:8787/health',{signal:AbortSignal.timeout(1000)})).ok;}catch{}
 if(!ready){server=spawn(process.execPath,['server/index.mjs'],{env:{...process.env,DEMO_MODE:'1'},stdio:'inherit'});for(let i=0;i<40;i++){try{if((await fetch('http://127.0.0.1:8787/health')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,250));}}
 if(!ready)throw new Error('Yerel sunucu baslamadi.');
 if(!(await fetch('http://127.0.0.1:8787/sonuclar.html')).ok)throw new Error('Replay dosyasi bulunamadi. Teslim eklerini proje kokune kopyalayin.');
 proc=spawn(process.execPath,['node_modules/cypress/bin/cypress','run','--browser','electron','--spec','cypress/e2e/sonuclar.cy.js'],{stdio:'inherit'});
 process.exitCode=await new Promise(resolve=>{proc.on('exit',code=>resolve(code??1));proc.on('error',()=>resolve(1));});
}finally{server?.kill();}
