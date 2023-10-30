import { BsPersonCircle, BsCaretDownFill } from 'react-icons/bs';
import styled from 'styled-components';

export const UserIcon = ({
  size,
  color,
  src,
  render,
}: {
  size?: number;
  color?: string;
  src?: string;
  render?: (props: { size?: number; color?: string }) => JSX.Element;
}) => {
  const content = render ? (
    render({ size, color })
  ) : (
    <>
      <IconWrapper size={size}>
        {src ? <ImgContainer size={size} src={src} draggable="false" role="presentation" /> : null}
        <Icon size={size} color={color} />
      </IconWrapper>
      <BsCaretDownFill color={color} size={size ? size / 3 : undefined} />
    </>
  );

  return <Container size={size}>{content}</Container>;
};

const Container = styled.div<{ size?: number }>`
  width: ${({ size }) => (size || 32) * 1.4}px;
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

const Icon = styled(BsPersonCircle)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ImgContainer = styled.img<{ size?: number }>`
  position: absolute;
  pointer-events: none;
  user-select: none;
  width: ${({ size }) => (size || 32) - 2}px;
  height: ${({ size }) => (size || 32) - 2}px;
  border-radius: 50%;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
