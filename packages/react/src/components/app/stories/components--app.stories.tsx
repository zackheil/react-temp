import type { Story } from '@ladle/react';
// import { useLadleContext } from '@ladle/react';
import { App, Route } from '../app.js';
import { Link, MemoryRouter } from 'react-router-dom';
import { Default404 } from '../../../pages/default-404.js';
import Page from '../../page/page.js';
import styled from 'styled-components';

const PageWrapper = styled(Page)`
  background-color: ${({ theme }) => theme.background};
  a {
    color: ${({ theme }) => theme.text};
  }
`;

const routes: Route[] = [
  {
    type: 'internal',
    component: (
      <PageWrapper trackingIdentifier="landing">
        <Link to={'/not-found'}>Not Found</Link>
        <br />
        <Link to={'/test'}>Test</Link>
      </PageWrapper>
    ),
    name: 'Test',
    location: ['nav'],
    path: '/',
  },
  {
    type: 'internal',
    component: <Default404 />,
    name: '404',
    location: ['nav'],
    path: '*',
  },
];

export const Test: Story<{
  title: string;
}> = ({ title }) => {
  return (
    <App
      title={title}
      routes={routes}
      routerOverride={MemoryRouter}
      analyticsEndpoint="/wsp"
      disablePersist
    />
  );
};

Test.args = {
  title: 'Test App',
};
