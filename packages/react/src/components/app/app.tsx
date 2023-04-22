/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { BrowserRouter, Route, RouteObject, Routes } from 'react-router-dom';
import { NavBar } from '../index.js';
import { ThemeProvider } from '../../elements/providers/style.js';
import { AppLayoutComponent, DefaultLayout } from './default-layout.js';
import { ThemeCollection } from '../../library/index.js';
import { AppThemeProvider, AppThemeProviderProps } from './theme-provider.js';

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

export type ProviderT = {
  element: React.FC<any>;
  props?: Record<string, any>;
  type: 'state' | 'style' | 'context' | 'other'; 
};

export type AppProps = {
  title?: string;
  globalPreOutlet?: React.ReactNode;
  globalPostOutlet?: React.ReactNode;
  layout?: AppLayoutComponent;
  providers?: (provided: ProviderT[]) => ProviderT[];
  routerOverride?: React.FC<any>;
  routes?: Route[];
  forceTheme?: 'light' | 'dark';
  theme?: ThemeCollection;
};
const App = ({ title, providers, routerOverride, globalPreOutlet, globalPostOutlet, layout, routes = [], forceTheme, theme }: AppProps) => {
  // Build up the default providers
  const defaultProviders: ProviderT[] = [
    {
      element: AppThemeProvider,
      props: { themeOverride: forceTheme, theme } satisfies Omit<AppThemeProviderProps, 'children'>,
      type: 'style',
    },
  ];

  // Determine props vs defaults to use
  const parsedProviders = providers ? providers(defaultProviders) : defaultProviders;
  const Router = routerOverride ?? BrowserRouter;
  const Layout = layout ?? DefaultLayout;

  // Build the routes
  const router = (
    <Router>
      <Routes>
        {(routes.filter(({ type }) => type === 'internal') as InternalRoute[]).map((route: InternalRoute, index) => (
          <Route element={route.component} path={route.path} key={index} />
        ))}
      </Routes>
    </Router>
  ); 

  // Build component tree
  const content = (
    <>
      {globalPreOutlet || null}
      <Layout title={title} router={router} />
      {globalPostOutlet || null}
    </>
  );

  const ProviderWrapper = parsedProviders.reduceRight(
    (inner, {element, props}) => React.createElement(element, props, inner),
    content
  );
  
  return ProviderWrapper;
};

App.displayName = 'App';

export { App };
export default App;
