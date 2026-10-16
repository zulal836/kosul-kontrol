describe('Kaydedilmiş GERÇEK Gemini sonuçları — canlı istek yok',()=>{
 it('başarılı alıntı akışını ve dürüst belirsizliği kaydeder',()=>{
  cy.visit('/sonuclar.html');cy.contains('Hukuki tavsiye değildir.').should('be.visible');
  cy.contains('CANLI İSTEK YOK').should('be.visible');cy.get('#score').should('have.text','15/100');
  cy.get('blockquote').should('contain','automatically renew');cy.wait(3500);
  cy.get('#scenario').select('spotify');cy.get('#verdict').should('have.text','İnsan incelemesi gerekli');
  cy.get('#score').should('have.text','—');cy.get('#score-note').should('contain','risksiz olduğu anlamına gelmez');
  cy.get('#uncertainties').should('be.visible');cy.wait(3500);
 });
});
