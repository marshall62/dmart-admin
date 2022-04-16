describe("complete e to e test", () => {
  before(() => {
    cy.visit("/");
  });

  describe("Can Add an artwork", () => {

    afterEach(() => {

      // cy.contains('td', "TESTING:New Artwork")  // gives you the cell 
      //   .siblings()                            // gives you all the other cells in the row
      //   .find('[data-testid="deleteButton"]')   // class is the only way to distinguish from edit
      //   .click()


    })

    it('has correct title', () => {
      cy.contains("David Marshall");
    })

    it('has a column indicating active status of artworks', () => {
      cy.get('th')
        .getByText(/active/i)
    })

     
    // can't rely on this test because it adds artworks and I don't know a nice way to call the API
    // to delete whats created in these.
    xit("Can add an artwork", () => {
      cy.findByTestId("addArtwork").click();
      cy.get('form')
        .findByPlaceholderText('Enter title').type("TESTING:New Artwork");
      cy.get('form')
        .findByRole("button", {name: /save/i}).click();
    });
  });
});
