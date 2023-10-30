import { render, screen, waitFor } from '@utils/testing';
import App, { Route } from './app.js';

const routes: Route[] = [
  {
    type: 'internal',
    component: <hr />,
    name: 'Test',
    location: ['nav'],
    path: '/',
  },
];

describe('Simple working test', () => {
  it('the title is visible', async () => {
    render(<App title="Hello" routes={routes} />);
    await waitFor(() => screen.getByText(/Hello/i));

    expect(screen.getByText(/Hello/i)).toBeInTheDocument();
  });
});
