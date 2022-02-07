import React from "react";
import { unmountComponentAtNode} from "react-dom";
import { render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EditModal from "../../components/modals/EditModal";


// N.B. jest.config.js testEnvironment set to jdom for this to work

// to run: npm test -- ./test/components/EditModal
// using jest as the test runner
// using react testing library for the helper functions
// using userEvent for clicks


let container = null;
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
});

describe("Editing existing artwork",() => {

  const artwork= {
    title: "Space Invaders",
    width: 100,
    height: 40,
    price: 1000,
    media: "oil on canvas",
    tags: ["landscape"],
    imagePath: "david_marshall_4",
    year: 2020,
    isSold: true
  }

  it("all form fields are populated correctly", () => {
    // TODO tags not checked b/c its a Typeahead
    const onClose = jest.fn();
    const onSave = jest.fn();
    render(<EditModal config={{}} artwork={artwork} allTags={["landscape", "still life"]} show={true} handleClose={onClose}
       handleSave={onSave} />);
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
    render(<EditModal config={{}} artwork={{}} allTags={[]} show={true} handleClose={onClose}
       handleSave={onSave} />);
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
  
  xit("calls close callback", () => {
    const onClose = jest.fn();
  
    render(<EditModal show={true} handleClose={onClose}/>);
    // N.B. the Modal.Header Close renders out as <button >
    const button = screen.getByRole("button", {name: "Close"});
    expect(button).toHaveAttribute('aria-label', 'Close');
    userEvent.click(button);
    expect(onClose).toHaveBeenCalled();
  })
})
