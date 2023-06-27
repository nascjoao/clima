describe('Navigation', () => {
  it('should navigate to the about page', () => {
    cy.visit('http://localhost:3000/');
    cy.get('a[href*="docs"]').click();
    cy.origin('https://nextjs.org/*', () => {
      cy.on('uncaught:exception', () => {
        return false;
      });
      cy.url().should('include', '/docs');
      cy.get('h1').contains('Introduction');
    });
  });
});

export {};
