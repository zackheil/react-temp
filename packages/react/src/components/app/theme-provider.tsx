import { useEffect, useRef } from 'react';
import { ThemeProvider as _ThemeProvider } from 'styled-components';
import { ComplexTheme, StyleCollection, useAppThemeStateReducer, useGetAppThemeState } from '../../index.js';
import { DefaultGlobalStyles, ThemedGlobalStyles } from '../../elements/providers/style.js';

export type AppThemeProviderProps = {
  children?: React.ReactNode;
  themeOverride?: 'light' | 'dark';
  theme?: StyleCollection;
};


export const AppThemeProvider = ({ children, themeOverride, theme }: AppThemeProviderProps) => {
  const { setTheme, setThemeSystem } = useAppThemeStateReducer();
  const themeState = useGetAppThemeState() ?? { theme: 'light', usingSystemTheme: false };
  const providerTheme = theme ?? ComplexTheme;
  const sysThemeRef = useRef(themeState.usingSystemTheme);

  useEffect(() => {
    sysThemeRef.current = themeState.usingSystemTheme;
  }, [themeState.usingSystemTheme]);

  useEffect(() => {
    // If a user is using the system theme, we need to listen for changes
    const handleThemeChange = () => {
      if (sysThemeRef.current) setThemeSystem();
    };

    // Handles the theme override that is passed into the App component
    if (themeOverride) {
      setTheme(themeOverride);
      return;
    }

    const mediaMatch = window.matchMedia('(prefers-color-scheme: dark)');
    mediaMatch.addEventListener('change', handleThemeChange);
    return () => mediaMatch.removeEventListener('change', handleThemeChange);
  }, [themeOverride]);

  const usedTheme = 'default' in providerTheme ? providerTheme.default : providerTheme[themeState.theme];

  return (
    <_ThemeProvider theme={usedTheme}>
      <DefaultGlobalStyles />
      <ThemedGlobalStyles />
      {children}
    </_ThemeProvider>
  );
};
