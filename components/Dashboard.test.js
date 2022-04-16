import React from "react";
import { unmountComponentAtNode} from "react-dom";
import { fireEvent, render, screen, cleanup, waitForElement, waitForElementToBeRemoved} from '@testing-library/react'
import Dashboard from "./Dashboard";
import {ArtworksService, SillyService} from '@services/artworks'
import {RecoilRoot} from 'recoil';
import {configState} from '@state/config'
import {artworksState} from '@state/artworks'
import {tagsState} from '@state/tags'
import { act } from "react-dom/test-utils";

let container = null;

// const dummy = function MockEditModal ({ artwork, show, handleClose, handleSave }) {
//   return (
//     show && (
//       <>
//         <div data-testid="modalDiv" id='xxx'>Mock Edit Modal</div>
//         <button data-testid="editModalClose" onClick={() => { document.getElementById('xxx').style.display = 'none';  handleClose();}}>Close</button>
//         <button data-testid="editModalSave" onClick={handleSave}>Save Changes</button>
//       </>
//     )
//   )
// }

// jest.mock('./modals/EditModal', () => {
//   return dummy;
// });

describe('Dashboard', () => {

  const artwork= {_id: "work1", title: "Flowers", year: 2010, width:10, height: 15, price:500, media:"oil on muslin panel", imagePath:"david_marshall_42.jpg", tags:['still life']}


  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  
  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
    cleanup();
  });

  afterAll(() => {
    jest.resetAllMocks();
  })

  it('displays the name of the artist and one row containing artwork', () => {
    const testComponent = render(
      <RecoilRoot initializeState={(snap) => 
       {
         snap.set(configState, {filename: 'david_marshall_', artist: "David Marshall"});
         snap.set(tagsState, ['still life', 'landscape']);
         snap.set(artworksState, [artwork]);
       }
      }>
        <Dashboard  />
      </RecoilRoot>);
    const title = testComponent.getByText("David Marshall Admin");
    expect(title).not.toBeNull();
    expect(testComponent.getByText(artwork.title)).toBeDefined()
    expect(testComponent.getByText(`${artwork.width} x ${artwork.height}` )).toBeDefined()
    expect(testComponent.getByText(artwork.price)).toBeDefined()
    expect(testComponent.getByText(artwork.year)).toBeDefined()
    expect(testComponent.getByText(artwork.media)).toBeDefined()
    expect(testComponent.getByText(artwork.imagePath)).toBeDefined()
  })

  it('launching the Edit Modal for an artwork works', () => {
    const testComponent = render(
      <RecoilRoot initializeState={(snap) => 
       {
         snap.set(configState, {filename: 'david_marshall_', artist: "David Marshall"});
         snap.set(tagsState, ['still life', 'landscape']);
         snap.set(artworksState, [artwork]);
       }
      }>
        <Dashboard  />
      </RecoilRoot>);
      const openEditButton = testComponent.getAllByRole('button')[1];  // first button following the + button
      expect(testComponent.queryByText('Mock Edit Modal')).toBeNull();
      fireEvent.click(openEditButton);
      expect(testComponent.getByText('Mock Edit Modal')).toBeVisible();
      const closeButton = testComponent.getByTestId('editModalClose');
      fireEvent.click(closeButton);
      expect(testComponent.queryByText('Mock Edit Modal')).toBeNull();
  })

  fit('edited artwork correctly updates in table', async () => {
    // Dashboard loads with some initial artworks (test some values in the row)
    // Open the EditModal and submit.
    // The artwork service is mocked and returns a fake edited artwork.
    // we then make sure the row in the table is correctly changed to reflect the edits

    const editedArtwork = {...artwork, title: "Daisies", year: 2020, imagePath: "david_marshall_100.jpg" };

    const mockResult = {artwork: editedArtwork, status: 200}
    const asyncMockResult = Promise.resolve(mockResult);

    const mockUpdateArtwork = jest
      .spyOn(ArtworksService, "updateArtwork")
      .mockImplementation(() =>  asyncMockResult );

    const testComponent = render(      
      <RecoilRoot initializeState={(snap) => 
       {
         snap.set(configState, {filename: 'david_marshall_', artist: "David Marshall"})
         snap.set(artworksState, [artwork])
         snap.set(tagsState, new Set(['still life', 'landscape']))
       }
      }>
        <Dashboard  />
      </RecoilRoot>);

    expect(testComponent.getByText(artwork.title)).toBeInTheDocument()
    expect(testComponent.getByText(artwork.year)).toBeInTheDocument()
    expect(testComponent.getByText(artwork.imagePath)).toBeInTheDocument()
    const openEditButton = testComponent.getAllByRole('button')[1];  // first button following the + button
    fireEvent.click(openEditButton);

    const editModalSubmitButton = testComponent.getByTestId('submit');
    expect(editModalSubmitButton).toBeVisible();

    const titleInput = testComponent.getByTestId('title');
    expect(titleInput).toBeVisible();

    fireEvent.click(editModalSubmitButton); // triggers async call to mock service updateArtwork

    // test that the EditModal is no longer showing.
    // this happens after the updateArtwork completes.
    await waitForElementToBeRemoved(testComponent.getByTestId('title'))
    // ...Now go on testing the state of the dashboard is updated.
      
    // Dont need to check this but it proves the mock service was called and returned
    // the fake data. This is inherently tested in the expectations about the table changes below
    expect(mockUpdateArtwork).toHaveBeenCalled();
    const updateRes = await mockUpdateArtwork.mock.results[0].value;
    expect(updateRes).toStrictEqual({artwork: editedArtwork, status: 200})
    // no need to check above. mocks results will be tested below 

    // Check that the original values have been replaced by the edited values
    expect(testComponent.queryByText(artwork.title)).toBeNull()
    expect(testComponent.queryByText(artwork.year)).toBeNull()
    expect(testComponent.queryByText(artwork.imagePath)).toBeNull()

    expect(testComponent.getByText(editedArtwork.title)).toBeInTheDocument();
    expect(testComponent.getByText(editedArtwork.year)).toBeInTheDocument();
    expect(testComponent.getByText(editedArtwork.imagePath)).toBeInTheDocument();

  })

  // possible test: if the tags in the dialog add to the global tags


})