import styled, { useTheme } from 'styled-components';
import { ColorTheme } from '../../library/index.js';
import { Title } from '../../elements/nav-bar/index.js';
import { UserIcon } from '../../elements/nav-bar/user-icon.js';

type Props = {
  title?: string | (({ color }: { color?: string }) => JSX.Element);
  color?: string;
  themeKey?: keyof ColorTheme;
  menus?: (({ color }: { color?: string }) => JSX.Element)[];
};
export const NavBar: React.FC<Props> = ({ title, color, themeKey, menus }) => {
  const theme = useTheme() as ColorTheme | undefined;
  return (
    <Container color={color} themeKey={themeKey}>
      {title ? typeof title === 'string' ? <Title>{title}</Title> : title({ color: theme?.contrast }) : null}
      <MenuContainer>
        {menus?.map((Menu, index) => <Menu key={index} color={theme?.contrast} />) ?? (
          <UserIcon
            size={28}
            color={theme?.contrast}
            src={
              'https://avatars.githubusercontent.com/u/57419337?s=400&u=0dcd61e62159b8b7744a924e90ed4c523cf561b5&v=4'
            }
          />
        )}
      </MenuContainer>
    </Container>
  );
};

const Container = styled.div<{ color?: string; themeKey?: keyof ColorTheme }>`
  margin: 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(props) =>
    props.color?.length || props.theme?.[props.themeKey || 'primary']
      ? `background-color: ${props.color || props.theme?.[props.themeKey || 'primary']};`
      : ''}
  height: 65px;
`;

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  max-width: fit-content;
`;

export default NavBar;
