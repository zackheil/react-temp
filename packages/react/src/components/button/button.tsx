import styled from 'styled-components';
import { hexChangeShade, invertColor } from '../../library/index.js';

export const Button = styled.button<{ color?: string }>`
  border: none;
  border-radius: 0.5rem;
  ${(props) => (props.color || props.theme?.primary ? `background-color: ${props.color || props.theme?.primary};` : '')}
  ${(props) => (props.theme?.text ? `color: ${invertColor(props.theme.text)};` : '')}
  padding: 0.75rem;
  cursor: pointer;
  &:hover {
    background-color: ${hexChangeShade('#186faf', 32)};
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #62b0e8;
    background-color: ${hexChangeShade('#186faf', -32)};
  }
`;

export default Button;
