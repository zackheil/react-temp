import type { Story } from '@ladle/react';
import { ColorTheme } from '../../../library/index.js';
import { NavBar } from '../nav-bar.js';

export const Default: Story<{
  title: string;
  color: string;
  themeKey: keyof ColorTheme;
}> = ({ title, color, themeKey }) => <NavBar title={title} color={color} themeKey={themeKey} />;

Default.args = {
  title: 'ACME Corp',
  color: '',
};
Default.argTypes = {
  // title: {
  //   description: 'The title of the nav bar',
  // },
  themeKey: {
    defaultValue: undefined,
    control: { type: 'select' },
    description: 'The key of the color theme to use',
    options: ['primary', 'secondary', 'danger', 'success', 'warning', 'info', 'disabled'],
  },
};
