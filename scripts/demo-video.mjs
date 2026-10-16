import {spawn} from 'node:child_process';
const server=spawn(process.execPath,['server/index.mjs'],{env:{...process.env,DEMO_MODE:'1'},stdio:'inherit'});
let proc;
try{
 let ready=false;for(let i=0;i<40;i++){try{const r=await fetch('http://127.0.0.1:8787/health');const data=await r.json();if(data.mode!=='fixture-demo')throw new Error('8787 portunda canlı sunucu çalışıyor; önce durdurun.');ready=true;break;}catch(e){if(e.message.includes('canlı'))throw e;await new Promise(r=>setTimeout(r,250));}}
 if(!ready)throw new Error('Demo sunucusu başlamadı.');
 proc=spawn(process.execPath,['node_modules/cypress/bin/cypress','run','--browser','electron','--spec','cypress/e2e/demo.cy.js'],{stdio:'inherit'});
 process.exitCode=await new Promise(resolve=>proc.on('exit',resolve));
}finally{server.kill();}
