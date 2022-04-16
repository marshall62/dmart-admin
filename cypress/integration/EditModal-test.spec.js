

describe("EditModal", () => {
  before(() => {
    cy.visit('/');
  })

  it('has setting for making Artwork inactive', () => {
    cy.findByTestId("addArtwork").click();
    cy.get('form')
      .findByLabelText(/active/i);
  } )
})