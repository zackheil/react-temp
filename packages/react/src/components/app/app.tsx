/* eslint-disable @typescript-eslint/no-explicit-any */

import { PropsWithChildren, ReactNode, createElement } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { IAppLayout, DefaultLayout as InternalDefaultLayout } from './default-layout.js';
import { StyleCollection } from '../../library/index.js';
import { AppThemeProvider, AppThemeProviderProps } from './theme-provider.js';
import { AppReduxProviderProps, ReduxProvider } from './redux-provider.js';
import { _themeSlice } from './redux-slices/theme.js';
import { _userEventsSlice, userEventSliceInitialState } from './redux-slices/user-event.js';
import { Api } from '@reduxjs/toolkit/dist/query/apiTypes';
import { useEventSliceUploader, useCollectPassiveUserEvents } from '../../hooks';

export type RouteLocation = ('nav' | 'footer')[] | 'hidden';

export type InternalRoute = {
  type: 'internal';
  location: RouteLocation;
  component: React.ReactNode;
  name: string;
  path: string;
};
export type ExternalRoute = {
  type: 'external';
  location: RouteLocation;
  name: string;
  url: string;
};
export type Route = InternalRoute | ExternalRoute;

// TODO: this would probably be better done with a discriminated union to better illustrate the types 
// needed for the underlying providers: state, style, context, other (other being type 'any')
export type ProviderT = {
  element: (props: PropsWithChildren<Partial<Record<string, any>>>) => ReactNode;
  props?: PropsWithChildren<Partial<Record<string, any>>>;
  type: 'state' | 'style' | 'context' | 'other';
};

export type AppProps = {
  title?: string;
  globalPreOutlet?: ReactNode;
  globalPostOutlet?: ReactNode;
  defaultLayout?: IAppLayout;
  providers?: (provided: ProviderT[]) => ProviderT[];
  routerOverride?: React.FC<any>;
  routes?: Route[];
  api?: Api<any, any, any, any, any>;
  forceTheme?: 'light' | 'dark';
  theme?: StyleCollection;
  devTools?: boolean;
  analyticsEndpoint?: string;
  disablePersist?: boolean;
  persistSecret?: string;
};
const App = ({
  title,
  providers,
  routerOverride,
  globalPreOutlet,
  globalPostOutlet,
  defaultLayout,
  routes = [],
  api,
  forceTheme,
  theme,
  devTools,
  analyticsEndpoint,
  disablePersist,
  persistSecret,
}: AppProps) => {
  // Build up the default providers
  const defaultProviders: ProviderT[] = [
    {
      element: ReduxProvider,
      props: {
        devTools,
        slices: [_themeSlice, _userEventsSlice],
        preloadedState: {
          '_user-events': userEventSliceInitialState,
        },
        disablePersist,
        persistSecret,
        rtkApi: api,
      } satisfies AppReduxProviderProps,
      type: 'state',
    },
    {
      element: AppThemeProvider,
      props: { themeOverride: forceTheme, theme } satisfies AppThemeProviderProps,
      type: 'style',
    },
  ];

  // Determine props vs defaults to use
  const parsedProviders = providers ? providers(defaultProviders) : defaultProviders;
  const Router = routerOverride ?? BrowserRouter;
  const Layout = defaultLayout ?? InternalDefaultLayout;

  // Build the routes
  const router = (
    <Routes>
      {(routes.filter(({ type }) => type === 'internal') as InternalRoute[]).map((route: InternalRoute, index) => (
        <Route element={route.component} path={route.path} key={index} />
      ))}
    </Routes>
  );

  // Build component tree
  const content = (
    <Router>
      {globalPreOutlet || null}
      <LayoutWrapper analyticsEndpoint={analyticsEndpoint} >
        <Layout title={title} router={router} />
      </LayoutWrapper>
      {globalPostOutlet || null}
    </Router>
  );

  console.log('rerender');

  const ProviderWrapper = parsedProviders.reduceRight(
    (inner, { element, props }) => createElement(element, props, inner),
    content
  );

  return ProviderWrapper;
};

export const LayoutWrapper = ({ children, analyticsEndpoint }: PropsWithChildren<{analyticsEndpoint?: string;}>) => {
  useEventSliceUploader(analyticsEndpoint);
  useCollectPassiveUserEvents();
  return <>{children}</>;
};

App.displayName = 'App';

export { App };
export default App;
