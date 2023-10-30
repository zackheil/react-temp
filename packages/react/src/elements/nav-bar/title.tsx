import styled from 'styled-components';

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: lighter;
  margin-left: 20px;
  ${({ theme }) => (theme?.contrast ? `color: ${theme.contrast};` : '')}
`;
