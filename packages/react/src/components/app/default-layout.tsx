import styled from 'styled-components';
import NavBar from "../nav-bar/nav-bar";

export type AppLayoutComponent = (props: { title?: string; router: JSX.Element }) => React.ReactElement;

export const DefaultLayout: AppLayoutComponent = ({title, router}) => {
  return (
    <Container>
      <NavBar title={title} />
      {router}
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  border: 1px solid red;
  position: relative; 
`;

const NotFound = styled.div`
  height: 100%;
`;