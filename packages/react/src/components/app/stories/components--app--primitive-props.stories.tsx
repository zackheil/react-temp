import type { Story } from '@ladle/react';
import { useLadleContext } from '@ladle/react';
import { App, Route } from '../app.js';
import { MemoryRouter } from 'react-router-dom';
import { Default404 } from '../../../pages/default-404.js';

const routes: Route[] = [
  {
    type: 'internal',
    component: <Default404 />,
    name: 'Test',
    location: ['nav'],
    path: '/'
  }
]

export const DemoPrimitiveProps: Story<{
  title: string;
}> = ({ title }) => {
  const ladleTheme = useLadleContext().globalState.theme;
  const forceTheme = ladleTheme === 'dark' ? 'dark' : 'light';

  return <App title={title} routes={routes} routerOverride={MemoryRouter} forceTheme={forceTheme} />
};

DemoPrimitiveProps.args = {
  title: 'Test App',
};

