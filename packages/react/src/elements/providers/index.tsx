import { ThemeProvider } from './style';

export const Providers = ({
  children,
  themeOverride,
}: {
  children: React.ReactNode;
  themeOverride?: 'light' | 'dark';
}) => {
  return <ThemeProvider themeOverride={themeOverride}>{children}</ThemeProvider>;
};
