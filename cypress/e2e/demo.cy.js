describe('Koşul Kontrol · fixture demo (canlı LLM değildir)',()=>{
 it('kanıtlı mutlu yolu ve dürüst belirsizliği gösterir',()=>{
  cy.visit('/');cy.contains('Hukuki tavsiye değildir.').should('be.visible');
  cy.contains('Gerçek LLM analizi değil').should('be.visible');
  cy.contains('Gönderilecek metni göster').click();cy.get('#preview').should('contain','otomatik yenilenir');cy.wait(1500);
  cy.get('#consent').check();cy.get('#analyze').click();cy.get('#score').should('have.text','35/100');
  cy.get('.risk').should('have.length',2);cy.get('blockquote').first().should('contain','her ay otomatik yenilenir');cy.wait(3500);
  cy.get('#scenario').select('uncertain');cy.get('#analyze').click();
  cy.contains('İnsan incelemesi gerekli').should('be.visible');cy.get('#score').should('have.text','—');
  cy.get('#uncertainties').should('contain','kesin sonuç veremiyorum');cy.get('.risk').should('have.length',0);cy.wait(3500);
 });
});
