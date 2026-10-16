describe('Gerçek page-agent DOM okuyucusunda injection',()=>{
 it('gizli talimatları çıkarır, görünür saldırı metnini veri olarak bırakır',()=>{
  cy.visit('/fixtures/injection.html');
  cy.window().then(win=>new Cypress.Promise((resolve,reject)=>{const s=win.document.createElement('script');s.src='/capture-test.js';s.onload=resolve;s.onerror=reject;win.document.head.append(s);}));
  cy.window().then(async win=>{
   const result=await win.captureForTest();expect(result.engine).to.contain('page-agent');expect(result.agentCharacters).to.be.greaterThan(0);
   expect(result.text).to.contain('her ay otomatik yenilenir');
   expect(result.text).not.to.contain('attacker.invalid');expect(result.text).not.to.contain('SYSTEM:');expect(result.text).not.to.contain('Gizli üçüncü');expect(result.text).not.to.contain('Assistant:');
   expect(result.text).to.contain('ignore previous instructions');
  });
 });
});
