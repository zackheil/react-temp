import styled from 'styled-components';

export const WireframeViewer = styled.div<{ name?: string; color?: string }>`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ color }) => (import.meta.env.DEV ? `border: 1px dotted ${color || 'black'};` : '')}
  :hover {
    ${({ color }) => (import.meta.env.DEV ? `border: 1px solid ${color || 'black'};` : '')}
    :after {
      ${import.meta.env.DEV ? `text-decoration: underline;` : ''}
    }
  }
  :after {
    /* content: '${({ name }) => (import.meta.env.DEV ? name || 'Wireframe' : '')}'; */
    ${({ name }) => (import.meta.env.DEV ? `content: '${name || 'Wireframe'}';` : '')}
  }
`;

