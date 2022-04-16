import React from "react";
import { unmountComponentAtNode} from "react-dom";
import {fireEvent, render, screen} from '@testing-library/react'
import ImageModal from "@components/modals/ImageModal";

// N.B. jest.config.js testEnvironment set to jdom for this to work

// to run: npm test -- ./test/components/ImageModal
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

it("renders an img tag", () => {
  const onClose = jest.fn();
  render(<ImageModal url="a/test/image.jpg" show={true} onClose={onClose}/>);
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('src', 'a/test/image.jpg');
})

fit("calls close callback", () => {
  const onClose = jest.fn();

  render(<ImageModal url="a/test/image.jpg" show={true} handleClose={onClose}/>);
  // N.B. the Modal.Header Close renders out as <button >
  const button = screen.getByRole("button");
  expect(button).toHaveAttribute('aria-label', 'Close');
  fireEvent.click(button);
  expect(onClose).toHaveBeenCalled();
})