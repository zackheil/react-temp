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
  media: MediaQueries;
};

export type MediaQueries = {
  xs: string;
  s: string;
  m: string;
  l: string;
  xl: string;
  xxl: string;
  op: string;
  ol: string;
  sp: string;
  sl: string;
  mp: string;
  ml: string;
};

export type StyleCollection =
  | {
      light: ColorTheme;
      dark: ColorTheme;
    }
  | {
      default: ColorTheme;
    };

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

export const DefaultMediaQueries: MediaQueries = {
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
    media: DefaultMediaQueries,
  },
} satisfies StyleCollection;

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
    media: DefaultMediaQueries,
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
    media: DefaultMediaQueries,
  },
} satisfies StyleCollection;
