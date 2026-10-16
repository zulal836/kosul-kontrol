import {build} from 'esbuild';import {mkdir,copyFile,cp} from 'node:fs/promises';
for(const dir of ['dist/extension','dist/web']){
 await mkdir(dir,{recursive:true});
 await build({entryPoints:['src/ui.mjs'],bundle:true,format:'esm',outfile:`${dir}/ui.js`});
 for(const file of ['index.html','style.css'])await copyFile(`src/${file}`,`${dir}/${file}`);
}
await build({entryPoints:['src/capture.mjs'],bundle:true,format:'iife',outfile:'dist/extension/capture.js',target:'chrome120'});
await cp('extension','dist/extension',{recursive:true});
console.log('Chrome: dist/extension | Demo: dist/web');
