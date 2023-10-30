import styled from 'styled-components';
import NavBar from '../nav-bar/nav-bar';
import Footer from '../footer/footer';

export type IAppLayout = (props: { title?: string; router: React.ReactElement }) => React.ReactElement;

export const DefaultLayout: IAppLayout = ({ title, router }) => {
  return (
    <Container>
      <TopContentAlignedFlex>
        <NavBar title={title} />
        {router}
      </TopContentAlignedFlex>
      <Footer />
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
`;

const TopContentAlignedFlex = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
