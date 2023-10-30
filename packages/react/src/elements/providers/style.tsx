import { useState, createContext, useEffect, useContext } from 'react';
import { createGlobalStyle, ThemeProvider as _ThemeProvider } from 'styled-components';
import '../style.types.js';
import { ComplexTheme } from '../../index.js';

// https://meyerweb.com/eric/tools/css/reset/
export const DefaultGlobalStyles = createGlobalStyle`
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, 
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  body, h1, h2, h3, h4, h5, h6  {
    font-family: Arial, Helvetica, sans-serif ;
  };
`;

export const ThemedGlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    margin: 0;
    padding: 0;
  };
  a {
    color: ${({ theme }) => theme.text};
    :hover {
      color: ${({ theme }) => theme.text}
    };
    :visited {
      color: ${({ theme }) => theme.text}
    };
  }
`;

// for use with @media ${(props) => props.theme.media.medium} { ... }
const breakpoints = {
  // Wearables
  xs: 1,
  // Phones
  s: 320,
  // Tablets
  m: 768,
  // Laptop Screens/Large Tablets
  l: 1024,
  // Desktop Screens
  xl: 1440,
  // Large Monitors
  xxl: 2560,
};

const SCREEN = 'only screen and ';
const MIN_WIDTH = (val: number) => `(min-width: ${val}px)`;
const MAX_WIDTH = (val: number) => `(max-width: ${val}px)`;
const WIDTH_BETWEEN = (min: number, max: number) => `${MIN_WIDTH(min)} and ${MAX_WIDTH(max)}`;
const PORTRAIT = `(orientation: portrait)`;
const LANDSCAPE = `(orientation: landscape)`;

export const defaultTheme = {
  media: {
    xs: SCREEN + WIDTH_BETWEEN(breakpoints.xs, breakpoints.s - 1),
    s: SCREEN + WIDTH_BETWEEN(breakpoints.s, breakpoints.m - 1),
    m: SCREEN + WIDTH_BETWEEN(breakpoints.m, breakpoints.l - 1),
    l: SCREEN + WIDTH_BETWEEN(breakpoints.l, breakpoints.xl - 1),
    xl: SCREEN + WIDTH_BETWEEN(breakpoints.xl, breakpoints.xxl - 1),
    xxl: SCREEN + MIN_WIDTH(breakpoints.xxl),
    op: SCREEN + PORTRAIT,
    ol: SCREEN + LANDSCAPE,
    sp: SCREEN + WIDTH_BETWEEN(breakpoints.s, breakpoints.m - 1) + ` and ${PORTRAIT}`,
    sl: SCREEN + WIDTH_BETWEEN(breakpoints.s, breakpoints.m - 1) + ` and ${LANDSCAPE}`,
    mp: SCREEN + WIDTH_BETWEEN(breakpoints.m, breakpoints.l - 1) + ` and ${PORTRAIT}`,
    ml: SCREEN + WIDTH_BETWEEN(breakpoints.m, breakpoints.l - 1) + ` and ${LANDSCAPE}`,
  },
} as const;

export type CustomTheme = typeof defaultTheme;

// https://betterprogramming.pub/how-to-use-media-queries-programmatically-in-react-4d6562c3bc97
export type MediaQueryParameters = {
  xs: string;
  s: string;
  m: string;
  l: string;
  xl: string;
  xxl: string;
  op: string;
  ol: string;
};

const defaultValue: MediaQueryParameters = {
  xs: defaultTheme.media.xs,
  s: defaultTheme.media.s,
  m: defaultTheme.media.m,
  l: defaultTheme.media.l,
  xl: defaultTheme.media.xl,
  xxl: defaultTheme.media.xxl,
  op: defaultTheme.media.op,
  ol: defaultTheme.media.ol,
};

export const MediaListenContext = createContext(defaultValue);

type props = {
  children: React.ReactNode;
  queries: MediaQueryParameters;
};

type MediaQueryCollection = {
  [key in keyof MediaQueryParameters]: MediaQueryList;
};

type MediaQueryResults = {
  [key in keyof MediaQueryParameters]?: boolean;
};

export const MediaListenProvider = (props: props) => {
  const [queryMatch, setQueryMatch] = useState<MediaQueryResults>({});

  useEffect(() => {
    const mediaQueryLists: Partial<MediaQueryCollection> = {};
    const keys = Object.keys(props.queries);
    let isAttached = false;

    // if (process.env.NODE_ENV === 'test') {
    //   return;
    // }

    const handleQueryListener = () => {
      const updatedMatches = keys.reduce((acc: MediaQueryResults, media) => {
        acc[media as keyof MediaQueryResults] = !!(
          mediaQueryLists[media as keyof MediaQueryParameters] &&
          mediaQueryLists[media as keyof MediaQueryParameters]!.matches
        );
        return acc;
      }, {});
      setQueryMatch(updatedMatches);
    };

    if (window && window.matchMedia) {
      const matches: MediaQueryResults = {};
      keys.forEach((media) => {
        if (typeof props.queries[media as keyof MediaQueryParameters] === 'string') {
          mediaQueryLists[media as keyof MediaQueryParameters] = window.matchMedia(
            props.queries[media as keyof MediaQueryParameters]
          );
          matches[media as keyof MediaQueryParameters] = mediaQueryLists[media as keyof MediaQueryParameters]!.matches;
        } else {
          matches[media as keyof MediaQueryParameters] = false;
        }
      });

      setQueryMatch(matches);
      isAttached = true;
      keys.forEach((media) => {
        if (typeof props.queries[media as keyof MediaQueryParameters] === 'string') {
          mediaQueryLists[media as keyof MediaQueryParameters]!.addListener(handleQueryListener);
        }
      });
    }

    return () => {
      if (isAttached) {
        keys.forEach((media) => {
          if (typeof props.queries[media as keyof MediaQueryParameters] === 'string') {
            mediaQueryLists[media as keyof MediaQueryParameters]!.removeListener(handleQueryListener);
          }
        });
      }
    };
  }, [props.queries]);

  return (
    <MediaListenContext.Provider value={queryMatch as unknown as MediaQueryParameters}>
      {props.children}
    </MediaListenContext.Provider>
  );
};

const queries: MediaQueryParameters = {
  xs: defaultTheme.media.xs,
  s: defaultTheme.media.s,
  m: defaultTheme.media.m,
  l: defaultTheme.media.l,
  xl: defaultTheme.media.xl,
  xxl: defaultTheme.media.xxl,
  op: defaultTheme.media.op,
  ol: defaultTheme.media.ol,
};

export const ThemeProvider = ({
  children,
  themeOverride,
}: {
  children: React.ReactNode;
  themeOverride?: 'light' | 'dark';
}) => {
  console.log('theme override', themeOverride);
  return (
    <_ThemeProvider theme={ComplexTheme[themeOverride || 'light']}>
      <MediaListenProvider queries={queries}>
        <DefaultGlobalStyles />
        {children}
      </MediaListenProvider>
    </_ThemeProvider>
  );
};

// TODO: move?
export const useMediaListen = (): MediaQueryResults => {
  const context = useContext(MediaListenContext);

  return context as unknown as MediaQueryResults;
};
