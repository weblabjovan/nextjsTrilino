
describe('My First Test', function() {
	beforeEach(()=>{
		cy.visit(Cypress.env().URL);
	})
  it('changes the language', function() {
  	cy.get('h1').contains('Ovo je naslovna stranica');
    cy.get('button.btn-secondary').click();
    cy.get('.dropdown-menu button:nth-of-type(2)').click();
    cy.url(`${Cypress.env().URL}/?language=en`);
    cy.get('h1').contains('This is Home Page');
    cy.get('.footerWrapper ul li:nth-of-type(1)').contains('Login');
    cy.get('.footerWrapper ul li:nth-of-type(2)').contains('Search');
    cy.get('.footerWrapper ul li:nth-of-type(3)').contains('FAQ');
    cy.get('.footerWrapper ul li:nth-of-type(4)').contains('Partnership');
    cy.get('.footerWrapper ul li:nth-of-type(5)').contains('Contact');
    cy.get('button.btn-secondary').click();
    cy.get('.dropdown-menu button:nth-of-type(1)').click();
    cy.url(`${Cypress.env().URL}/?language=sr`);
    cy.get('h1').contains('Ovo je naslovna stranica');
    cy.get('.footerWrapper ul li:nth-of-type(1)').contains('Prijava');
    cy.get('.footerWrapper ul li:nth-of-type(2)').contains('Pretraga');
    cy.get('.footerWrapper ul li:nth-of-type(3)').contains('Najčešća pitanja');
    cy.get('.footerWrapper ul li:nth-of-type(4)').contains('Saradnja');
    cy.get('.footerWrapper ul li:nth-of-type(5)').contains('Kontakt');
  })
})