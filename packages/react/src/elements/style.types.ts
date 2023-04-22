import { ColorTheme } from '../index.js';

declare module 'styled-components' {
  export interface DefaultTheme extends ColorTheme {}
}
