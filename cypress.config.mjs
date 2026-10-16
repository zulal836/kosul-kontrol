import {defineConfig} from 'cypress';
export default defineConfig({video:true,videoCompression:24,viewportWidth:1280,viewportHeight:900,e2e:{baseUrl:'http://127.0.0.1:8787',supportFile:false,specPattern:'cypress/e2e/*.cy.js'},defaultCommandTimeout:10000});
