import styled from 'styled-components';

export const Footer = () => {
  return (
    <FooterContainer>
      <Line />
      <ContentContainer>
        <p>© {new Date().getFullYear()} ACME Technology</p>
      </ContentContainer>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  height: 100px;
  background-color: ${({ theme }) => theme.background};
`;

const Line = styled.hr`
  width: 80%;
  margin: -1px auto;
  color: ${({ theme }) => theme.disabled};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export default Footer;
