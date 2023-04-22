import { render, screen } from '@utils/testing';
import App from './app.js';

describe('Simple working test', () => {
  it('the title is visible', () => {
    render(<App title="Hello" />);
    expect(screen.getByText(/Hello/i)).toBeInTheDocument();
  });
});
