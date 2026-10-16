import 'dotenv/config';
import express from 'express';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {analyze} from './llm.mjs';
import {report,verify} from '../src/core.mjs';
import {demoText,demoCandidate} from '../src/fixtures.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const app=express(),demo=process.env.DEMO_MODE==='1';
const token=process.env.LOCAL_TOKEN||randomBytes(24).toString('hex');
if(!process.env.LOCAL_TOKEN&&!demo)console.log('Yerel bağlantı kodu (uzantı ayarına yazın):',token);
app.use((req,res,next)=>{
 const origin=req.headers.origin;
 if(origin&&/^chrome-extension:\/\/[a-p]{32}$/.test(origin)){
  res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Headers','Authorization, Content-Type');res.setHeader('Access-Control-Allow-Methods','POST, GET, OPTIONS');
 }
 if(req.method==='OPTIONS')return res.sendStatus(204);
 next();
});
app.use(express.json({limit:'450kb'}));
app.get('/health',(_,res)=>res.json({ok:true,mode:demo?'fixture-demo':'live'}));
let busy=false;
app.post('/api/analyze',async(req,res)=>{
 if(!demo){const got=Buffer.from(req.headers.authorization||''),expected=Buffer.from(`Bearer ${token}`);if(got.length!==expected.length||!timingSafeEqual(got,expected))return res.status(401).json({error:'Yerel bağlantı kodu hatalı.'});}
 if(busy)return res.status(429).json({error:'Bir analiz sürüyor; tamamlanmasını bekleyin.'});
 if(typeof req.body.text!=='string'||req.body.text.length<30||req.body.text.length>100000)return res.status(400).json({error:'30–100.000 karakter arasında sayfa metni gerekli.'});
 busy=true;try{
  if(demo){if(req.body.text!==demoText)return res.status(400).json({error:'Demo yalnızca sabit test metnini kabul eder. Gerçek sayfa için canlı modu başlatın.'});
   const candidate=req.body.scenario==='uncertain'?{risks:[],uncertainties:['Bu kesit iptal ücretinin tutarını ve istisnalarını açıklamıyor; kesin sonuç veremiyorum.']}:demoCandidate;
   return res.json({...report([verify(candidate,demoText)]),mode:'fixture-demo'});
  }
  return res.json({...await analyze(req.body.text),mode:'live'});
 }catch(e){res.status(502).json({error:e.message});}finally{busy=false;}
});
app.use(express.static(path.join(root,'dist/web')));
app.use('/fixtures',express.static(path.join(root,'demo')));
app.use((error,req,res,next)=>res.status(400).json({error:'İstek okunamadı veya boyut sınırı aşıldı.'}));
app.listen(Number(process.env.PORT||8787),'127.0.0.1',()=>console.log(`Koşul Kontrol: http://127.0.0.1:${process.env.PORT||8787} (${demo?'SABİT TEST VERİSİ':'CANLI LLM'})`));
