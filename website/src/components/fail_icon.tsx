import {FC} from 'react';
import {styled} from 'styled-components';

import {fontSizes} from '@src/lib/theme';

interface FailIconProps {
  failDesign: string;
  disable: boolean;
}

export const FailIcon: FC<FailIconProps> = ({disable, failDesign}) => (
  <FailIconWrapper>
    <Icon style={disable ? {opacity: 0.3} : {}}>{failDesign}</Icon>
  </FailIconWrapper>
);
FailIcon.displayName = 'FailIcon';

const FailIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.div`
  font-size: ${fontSizes.large}px;
`;
