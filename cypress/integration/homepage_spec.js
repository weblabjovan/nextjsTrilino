
describe('Home page layout test', function() {
    beforeEach(()=>{
        cy.visit('http://localhost:3000');
    })
  it('changes the language', function() {
    cy.get('button.btn-secondary').click();
    cy.get('.dropdown-menu button:nth-of-type(2)').click();
    cy.url(`http://localhost:3000/?language=en`);
    cy.get('.footerWrapper ul li:nth-of-type(1)').contains('Login');
    cy.get('.footerWrapper ul li:nth-of-type(2)').contains('Search');
    cy.get('.footerWrapper ul li:nth-of-type(3)').contains('Terms of service');
    cy.get('.footerWrapper ul li:nth-of-type(4)').contains('Partnership');
    cy.get('.footerWrapper ul li:nth-of-type(5)').contains('Contact');
    cy.get('button.btn-secondary').click();
    cy.get('.dropdown-menu button:nth-of-type(1)').click();
    cy.url(`http://localhost:3000/?language=sr`);
    cy.get('.footerWrapper ul li:nth-of-type(1)').contains('Prijava');
    cy.get('.footerWrapper ul li:nth-of-type(2)').contains('Pretraga');
    cy.get('.footerWrapper ul li:nth-of-type(3)').contains('Uslovi korišćenja');
    cy.get('.footerWrapper ul li:nth-of-type(4)').contains('Saradnja');
    cy.get('.footerWrapper ul li:nth-of-type(5)').contains('Kontakt');
  })
})