import { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { useLogPageView } from '../../hooks';

type Props = {
  className?: string;
  trackingIdentifier: string;
};
export const Page = ({ className, children, trackingIdentifier }: PropsWithChildren<Props>) => {
  useLogPageView(trackingIdentifier);
  return <PageWrapper className={className}>{children}</PageWrapper>;
};

const PageWrapper = styled.main`
  flex-grow: 1;
`;

export default Page;
