import styled from 'styled-components';
import { SimpleTheme, hexChangeShade, invertColor } from '../../library/index.js';

export const Button = styled.button<{ color?: string }>`
  border: none;
  border-radius: 0.5rem;
  ${(props) => (props.color || props.theme?.primary ? `background-color: ${props.color || props.theme?.primary};` : '')}
  ${(props) => (props.theme?.text ? `color: ${invertColor(props.theme.text)};` : '')}
  padding: 0.75rem;
  cursor: pointer;
  &:hover {
    background-color: ${({theme}) => hexChangeShade(theme.primary ?? SimpleTheme.default.primary, 8)};
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({theme}) => hexChangeShade(theme.primary ?? SimpleTheme.default.primary, 32)};
    background-color: ${({theme}) => hexChangeShade(theme.primary ?? SimpleTheme.default.primary, 8)};
  }
`;

export default Button;
