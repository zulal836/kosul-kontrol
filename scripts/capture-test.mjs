import {build} from 'esbuild';
await build({stdin:{contents:`import {capture} from './src/capture.mjs'; window.captureForTest=capture;`,resolveDir:process.cwd(),sourcefile:'test-entry.mjs'},bundle:true,format:'iife',outfile:'dist/web/capture-test.js'});
