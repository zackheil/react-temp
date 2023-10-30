import styled from 'styled-components';
import { Page } from '../components';
import { HiMagnifyingGlassCircle } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

export const Default404 = () => {
  return (
    <PageWrapper trackingIdentifier="404">
      <Icon size={128} />
      <TitleText>Page Not Found</TitleText>
      <DescriptionText>
        We couldn't find that page. Click <Link to={'/'}>here</Link> to return to the home page.
      </DescriptionText>
    </PageWrapper>
  );
};

const PageWrapper = styled(Page)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 100px 0;
  background-color: ${({ theme }) => theme.background};
`;

const Icon = styled(HiMagnifyingGlassCircle)`
  color: ${({ theme }) => theme.text};
`;

const TitleText = styled.h2`
  font-size: 1.5em;
`;

const DescriptionText = styled.p`
  margin-top: 30px;
  text-align: center;
`;
