import { RTKProvider } from './redux/provider';
import { ThemeProvider } from './style';

export const Providers = ({
  children,
  themeOverride,
}: {
  children: React.ReactNode;
  themeOverride?: 'light' | 'dark';
}) => {
  return (
    <RTKProvider>
      <ThemeProvider themeOverride={themeOverride}>{children}</ThemeProvider>
    </RTKProvider>
  );
};
