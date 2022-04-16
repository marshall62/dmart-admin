import React from 'react';
import TestComponent from './TestComponent';
import { fireEvent, render, screen} from '@testing-library/react'

describe('<TestComponent />', () => {
  let wrapper;
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState')
  useStateSpy.mockImplementation((init) => [init, setState]);

  beforeEach(() => {
    wrapper = render(<TestComponent />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Count Up', () => {
    it('calls setCount with count + 1', () => {
      const up = wrapper.getByTestId('count-up')
      fireEvent.click(up);
      expect(setState).toHaveBeenCalledWith(1);
    });
  });

  describe('Count Down', () => {
    it('calls setCount with count - 1', () => {
      const down = wrapper.getByTestId('count-down')
      fireEvent.click(down)
      expect(setState).toHaveBeenCalledWith(-1);
    });
  });

  describe('Zero', () => {
    it('calls setCount with 0', () => {
        const z = wrapper.getByTestId('zero-count')
        
        fireEvent.click(z)
      expect(setState).toHaveBeenCalledWith(0);
      expect(setState).toHaveBeenCalledWith(true);
    });
  });
});