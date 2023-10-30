import styled from 'styled-components';
import { BsSunFill, BsMoonFill, BsFillExclamationTriangleFill } from 'react-icons/bs';
import { useAppThemeStateReducer, useGetAppThemeState } from '../../hooks';
import { ReactElement } from 'react';

export type ThemeIconRenderProps = {
  size?: number;
  color?: string;
  hasError: boolean;
};

export const ThemeIcon = ({
  size,
  color,
  render,
}: {
  size?: number;
  color?: string;
  render?: (props: ThemeIconRenderProps) => ReactElement | null;
}) => {
  // This themeState will be undefined if not in the redux provider. If this is the case, there isn't a way to toggle the theme.
  const themeState = useGetAppThemeState();
  const { toggleTheme } = useAppThemeStateReducer();
  const content = render ? (
    render({ size, color, hasError: !themeState })
  ) : (
    <>
      <IconWrapper size={size}>
        {themeState ? (
          themeState.theme === 'light' ? (
            <LightIcon size={size} color={color} onClick={() => toggleTheme()} />
          ) : (
            <DarkIcon size={size ? size - 4 : undefined} color={color} onClick={() => toggleTheme()} />
          )
        ) : (
          // Display an error icon if the themeState is undefined
          <ErrorIcon />
        )}
        {themeState?.usingSystemTheme ? (
          <IconBadge>
            <span>OS</span>
          </IconBadge>
        ) : null}
      </IconWrapper>
    </>
  );

  return <Container size={size}>{content}</Container>;
};

const Container = styled.div<{ size?: number }>`
  width: ${({ size }) => size || 32}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin-inline: 10px;
`;

const IconWrapper = styled.div<{ size?: number }>`
  position: relative;
  width: ${({ size }) => size || 32}px;
  height: ${({ size }) => size || 32}px;
`;

const LightIcon = styled(BsSunFill)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const DarkIcon = styled(BsMoonFill)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ErrorIcon = styled(BsFillExclamationTriangleFill)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const IconBadge = styled.div`
  position: absolute;
  height: 12px;
  width: 12px;
  background-color: ${({ theme }) => theme.contrast};
  bottom: 0;
  right: 0;
  border-radius: 50%;
  font-size: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-align: center;
  pointer-events: none;
  user-select: none;
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
`;
