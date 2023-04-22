import styled from 'styled-components';
import { Page } from '../components';

export const Default404 = () => {
  return (
    <Page>
      <ContentWrapper>
        <p>Test</p>
      </ContentWrapper>
    </Page>
  );
};

const ContentWrapper = styled.div`
  height: 100%;
  border: 1px solid blue;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

`;
