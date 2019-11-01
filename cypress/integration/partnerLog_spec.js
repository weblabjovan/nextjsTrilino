
describe('Partner login page layout test', function() {
    beforeEach(()=>{
        cy.visit('http://localhost:3000/partnershipLogin?language=sr&page=register');
    })

  it('has all necessary fields', function(){
  	cy.get('input[placeholder="Naziv lokala"]');
  	cy.get('input[placeholder="PIB"]');
  	cy.get('.logInput div').contains('Grad');
  	cy.get('input[placeholder="Kontakt osoba"]');
  	cy.get('input[placeholder="Kontakt email"]');
  	cy.get('input[placeholder="Kontakt telefon"]');
  	cy.get('#loginRedirection').click();
  	cy.url().should('eq', 'http://localhost:3000/partnershipLogin?language=sr&page=login');
  	cy.get('input[placeholder="PIB"]');
  	cy.get('input[placeholder="Lozinka"]');
  })

  it('changes the language serbian and english', function(){
  	cy.get('button.btn-secondary').click();
    cy.get('.dropdown-menu button:nth-of-type(2)').click();
    cy.url().should('eq', 'http://localhost:3000/partnershipLogin?language=en&page=register');
  	cy.get('input[placeholder="Venue name"]');
  	cy.get('input[placeholder="Tax identification number"]');
  	cy.get('.logInput div').contains('City');
  	cy.get('input[placeholder="Contact person"]');
  	cy.get('input[placeholder="Contact email"]');
  	cy.get('input[placeholder="Contact phone"]');
  	cy.get('#loginRedirection').click();
  	cy.url().should('eq', 'http://localhost:3000/partnershipLogin?language=en&page=login');
  	cy.get('input[placeholder="Tax identification number"]');
  	cy.get('input[placeholder="Password"]');
  	cy.get('button.btn-secondary').click();
    cy.get('.dropdown-menu button:nth-of-type(1)').click();
    cy.url().should('eq', 'http://localhost:3000/partnershipLogin?language=sr&page=login');
    cy.get('input[placeholder="PIB"]');
  	cy.get('input[placeholder="Lozinka"]');
  	cy.get('#registrationRedirection').click();
  	cy.url().should('eq', 'http://localhost:3000/partnershipLogin?language=sr&page=register');
  	cy.get('input[placeholder="Naziv lokala"]');
  	cy.get('input[placeholder="PIB"]');
  	cy.get('.logInput div').contains('Grad');
  	cy.get('input[placeholder="Kontakt osoba"]');
  	cy.get('input[placeholder="Kontakt email"]');
  	cy.get('input[placeholder="Kontakt telefon"]');
  })
 
})