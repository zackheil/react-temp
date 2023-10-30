import styled from 'styled-components';
import { PropsWithChildren } from 'react';
import { ColorTheme } from '../../library/index.js';
import { Title } from '../../elements/nav-bar/index.js';
import { UserIcon } from '../../elements/nav-bar/user-icon.js';
import { Link } from 'react-router-dom';
import { useInRouter } from '../../hooks/index.js';
import { ThemeIcon } from '../../elements/nav-bar/theme-icon.js';

// TODO: fix colors here
type Props = {
  title?: string | (({ color }: { color?: string }) => JSX.Element);
  color?: string;
  themeKey?: keyof ColorTheme;
  menus?: (({ color }: { color?: string }) => JSX.Element)[];
};
export const NavBar: React.FC<Props> = ({ title, color, themeKey, menus }) => {
  const inRouter = useInRouter();

  return (
    <Container color={color} themeKey={themeKey}>
      <ConditionalLinkWrapper inRouter={inRouter}>
        <>{title ? typeof title === 'string' ? <Title>{title}</Title> : title({ color: '#ffffff' }) : null}</>
      </ConditionalLinkWrapper>
      <MenuContainer>
        {menus?.map((Menu, index) => <Menu key={index} color={'#ffffff'} />) ?? (
          <>
            <ThemeIcon size={28} color={'#ffffff'} />
            <UserIcon
              size={28}
              color={'#ffffff'}
              // src={
              //   'https://avatars.githubusercontent.com/u/57419337?s=400&u=0dcd61e62159b8b7744a924e90ed4c523cf561b5&v=4'
              // }
            />
          </>
        )}
      </MenuContainer>
    </Container>
  );
};

const Container = styled.div<{ color?: string; themeKey?: keyof ColorTheme }>`
  margin: 0;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(props) =>
    props.color?.length || props.theme?.[props.themeKey || 'primary']
      ? `background-color: ${props.color || props.theme?.[props.themeKey || 'primary']};`
      : ''}
  height: 65px;
`;

const StylelessLink = styled(Link)`
  color: unset;
  text-decoration: unset;
  :hover {
    text-decoration: unset;
    color: unset;
  }
  :visited {
    text-decoration: unset;
    color: unset;
  }
`;

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  max-width: fit-content;
`;

const ConditionalLinkWrapper = ({ inRouter, children }: PropsWithChildren<{ inRouter: boolean; }>) => {
  if (inRouter) return <StylelessLink to="/">{children}</StylelessLink>;
  return <>{children}</>;
};

export default NavBar;
