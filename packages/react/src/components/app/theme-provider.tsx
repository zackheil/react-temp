import { useEffect, useState } from 'react';
import { ThemeProvider as _ThemeProvider } from 'styled-components';
import { ComplexTheme, ThemeCollection } from '../../index.js';
import { DefaultGlobalStyles, ThemedGlobalStyles } from '../../elements/providers/style.js';

export type AppThemeProviderProps = {
  children: React.ReactNode;
  themeOverride?: 'light' | 'dark';
  theme?: ThemeCollection;
};

export const AppThemeProvider = ({
  children,
  themeOverride,
  theme,
}: AppThemeProviderProps) => {
  const providerTheme = theme ?? ComplexTheme;

  const [userPreferredTheme, setUserPreferredTheme] = useState<
    "light" | "dark"
  >(
    themeOverride ? themeOverride :
       window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
  );

  useEffect(() => {
    // Handles the theme override that is passed into the App component
    if (themeOverride) {
      setUserPreferredTheme(themeOverride);
      return;
    }

    // If no override is passed in, then we can listen for changes to the user's OS/browser theme
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      setUserPreferredTheme(e.matches ? 'dark' : 'light');
    });

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', (e) => {
        setUserPreferredTheme(e.matches ? 'dark' : 'light');
      });
    };
  }, [themeOverride]);

  const usedTheme = ('default' in providerTheme) ? providerTheme['default'] : providerTheme[userPreferredTheme]

  return (
    <_ThemeProvider theme={usedTheme}>
      <DefaultGlobalStyles />
      <ThemedGlobalStyles />
      {children}
    </_ThemeProvider>
  );
};
