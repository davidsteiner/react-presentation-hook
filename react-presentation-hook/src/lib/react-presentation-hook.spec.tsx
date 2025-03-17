import { render } from '@testing-library/react';

import ReactPresentationHook from './react-presentation-hook';

describe('ReactPresentationHook', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactPresentationHook />);
    expect(baseElement).toBeTruthy();
  });
});
