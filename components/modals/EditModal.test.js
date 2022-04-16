import React from "react";
import { unmountComponentAtNode} from "react-dom";
import { fireEvent, render, screen, cleanup} from '@testing-library/react'

import {RecoilRoot} from 'recoil';
import EditModal from '@components/modals/EditModal';
import {configState} from '@state/config'
import {tagsState} from '@state/tags'


// N.B. jest.config.js testEnvironment set to jdom for this to work

// to run: npm test -- ./test/components/EditModal
// using jest as the test runner
// using react testing library for the helper functions
// using userEvent for clicks


let container = null;
const config = {
  filename: "david_marshall_"
}
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

describe("Editing existing artwork",() => {

  let artwork;
  let testComponent;
  const onClose = jest.fn();
  const onSave = jest.fn();

  beforeEach(() => {
    artwork = {
      title: "Space Invaders",
      width: 100,
      height: 40,
      price: 1000,
      media: "oil on canvas",
      tags: ["landscape"],
      imagePath: "david_marshall_4.jpg",
      year: 2020,
      isSold: true,
    };

    testComponent = render(
    <RecoilRoot initializeState={(snap) => 
     {
       snap.set(configState, {filename: 'david_marshall_'})
       snap.set(tagsState, ['still life', 'landscape'])
     }
    }>
      <EditModal artwork={artwork} show={true} handleClose={onClose} handleSave={onSave} />
    </RecoilRoot>);
  });

  afterEach (() => {
    jest.clearAllMocks();
  })

  it("changing the title field works ", () => {
    const title = testComponent.getByTestId('title')
    fireEvent.change(title, {target: {value: 'Las Meninas'}})
    fireEvent.submit(testComponent.getByTestId('submit'), {target: {}})
    expect(onSave).toHaveBeenCalledWith({...artwork, title: 'Las Meninas'});
  })

  it("changing the height and width fields works ", () => {
    const width = testComponent.getByRole('textbox', {name: 'width'})
    const height = testComponent.getByRole('textbox', {name: 'height'})
    fireEvent.change(height, {target: {value: '12'}})
    fireEvent.change(width, {target: {value: '13'}})
    fireEvent.submit(testComponent.getByTestId('submit'), {target: {}})
    expect(onSave).toHaveBeenCalledWith({...artwork, height:12, width:13});
  })

  it("changing the filename works ", () => {
    const filenum = testComponent.getByRole('textbox', {name: 'filenum'})
    fireEvent.change(filenum, {target: {value: '12'}})  
    fireEvent.submit(testComponent.getByTestId('submit'), {target: {}})
    expect(onSave).toHaveBeenCalledWith({...artwork, imagePath: 'david_marshall_12.jpg'});  
  })

  it("clearing tags works ", () => {
    const clearTagsButton = testComponent.getByRole('button', {name: 'Clear'})
    fireEvent.click(clearTagsButton)  
    fireEvent.submit(testComponent.getByTestId('submit'), {target: {}})
    expect(onSave).toHaveBeenCalledWith({...artwork, tags: []});  
  })


  it("all form fields are populated correctly", () => {
    // TODO tags not checked b/c its a Typeahead and I cant gets its controls or values.

    const title = screen.getByTestId('title');
    const width = screen.getByPlaceholderText('width')
    const height = screen.getByPlaceholderText('height')
    // const year = document.querySelector('#year')
    const year = screen.getByTestId('year')
    // name refers to aria-label
    const filenum = screen.getByRole('textbox', {name: 'filenum'})
    const media = screen.getByRole('combobox',{name: 'media'})
    const price = screen.getByTestId('price')
    const isExample = screen.getByRole('checkbox',{name: 'is example'})
    const categoryName = screen.getByRole('textbox',{name: 'category name'})

    expect(title).toHaveValue(artwork.title)
    expect(width).toHaveValue(`${artwork.width}`)
    expect(height).toHaveValue(`${artwork.height}`)
    expect(year).toHaveValue(`${artwork.year}`)
    expect(price).toHaveValue(`${artwork.price}`)
    expect(filenum).toHaveValue('4')
    expect(media).toHaveValue(artwork.media)
    expect(isExample).not.toBeChecked()
    expect(categoryName).toHaveValue('')

  })
})

describe("Create new artwork", () => {

  it("all form fields are empty", () => {
    const onClose = jest.fn();
    const onSave = jest.fn();
    render(<RecoilRoot initializeState={(snap) => 
      {
        snap.set(configState, {filename: 'david_marshall_'})
      }
     }>
      <EditModal artwork={{}} show={true} handleClose={onClose} handleSave={onSave} />
      </RecoilRoot>);
    const title = screen.getByTestId('title');
    const width = screen.getByPlaceholderText('width')
    const height = screen.getByPlaceholderText('height')
    // const year = document.querySelector('#year')
    const year = screen.getByTestId('year')
    // name refers to aria-label
    const filenum = screen.getByRole('textbox', {name: 'filenum'})
    const media = screen.getByRole('combobox',{name: 'media'})
    const price = screen.getByTestId('price')
    const isExample = screen.getByRole('checkbox',{name: 'is example'})
    const categoryName = screen.getByRole('textbox',{name: 'category name'})
    const elements = [title, width, height, year, filenum, media, price, 
      isExample, categoryName]
    elements.forEach(element => expect(element).toContainHTML(''))

  })

  it("Saving an empty artwork form has the title field marked invalid", () => {
    const onSave = jest.fn();
  
    const {getByText, queryByText} = render(<RecoilRoot><EditModal artwork={{}} show={true} handleSave={onSave}/></RecoilRoot>);
    const button = getByText("Save Changes");
    expect(queryByText('title is required')).toBeNull();
    fireEvent.click(button);
    expect(getByText('title is required')).not.toBeNull();
    expect(onSave).not.toHaveBeenCalled();
  })
  
  it("Clicking close calls the close callback", () => {
    const onClose = jest.fn();
  
    const {getAllByRole} = render(<RecoilRoot><EditModal artwork={{}} show={true} handleClose={onClose}/></RecoilRoot>);
    // N.B. the Modal.Header Close renders out as <button > and is the first of 2 with this name
    const button = getAllByRole("button", {name: "Close"})[0];
    fireEvent.click(button);
    expect(onClose).toHaveBeenCalled();
  })
})


