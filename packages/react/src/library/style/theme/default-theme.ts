// https://dribbble.com/shots/10677452-Color-Library-for-Dark-and-Light-Mode

import { hexChangeShade } from '../utils.js';

export type ColorTheme = {
  type: 'light' | 'dark';
  primary: string;
  secondary: string;
  info: string;
  success: string;
  warning: string;
  danger: string;
  disabled: string;
  text: string;
  background: string;
  contrast: string;
};

export type ThemeCollection =
  | {
      light: ColorTheme;
      dark: ColorTheme;
    }
  | {
      default: ColorTheme;
    };

export const SimpleTheme = {
  default: {
    type: 'light',
    primary: '#1976d2',
    secondary: '#ba68c8',
    info: '#00e5ff',
    success: '#2e7d32',
    warning: '#ed6c02',
    danger: '#d32f2f',
    disabled: '#f5f5f5',
    text: '#000000',
    background: '#ffffff',
    contrast: '#ffffff',
  },
} satisfies ThemeCollection;

export const ComplexTheme = {
  light: {
    type: 'light',
    primary: '#1976d2',
    secondary: '#ba68c8',
    info: '#00e5ff',
    success: '#2e7d32',
    warning: '#ed6c02',
    danger: '#d32f2f',
    disabled: '#f5f5f5',
    text: '#000000',
    background: '#ffffff',
    contrast: '#ffffff',
  },
  dark: {
    type: 'dark',
    primary: hexChangeShade('#1976d2', -64),
    secondary: hexChangeShade('#ba68c8', -64),
    info: hexChangeShade('#00e5ff', -64),
    success: hexChangeShade('#2e7d32', -64),
    warning: hexChangeShade('#ed6c02', -64),
    danger: hexChangeShade('#d32f2f', -64),
    disabled: hexChangeShade('#f5f5f5', -64),
    text: '#eeeeee',
    background: '#222222',
    contrast: '#ffffff',
  },
} satisfies ThemeCollection;
