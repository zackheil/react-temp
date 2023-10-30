import { render, screen } from '@utils/testing';
import { NavBar } from './nav-bar';

describe('Simple working test', () => {
  it('the title is visible', () => {
    render(<NavBar title={'Hello'} />);
    expect(screen.getByText(/Hello/i)).toBeInTheDocument();
  });

  // it('should increment count on click', async () => {
  //   render(<App />);
  //   userEvent.click(screen.getByRole('button'));
  //   expect(await screen.findByText(/count is: 1/i)).toBeInTheDocument();
  // });
});
