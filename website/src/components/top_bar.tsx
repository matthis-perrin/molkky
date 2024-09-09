import {FC, ReactNode} from 'react';
import {styled} from 'styled-components';

import {buttonHeight, elevations, spacing, topBarBackgroundColor} from '@src/lib/theme';

interface TopBarProps {
  left?: ReactNode;
  middle?: ReactNode;
  right?: ReactNode;
  children?: never;
}

export const TopBar: FC<TopBarProps> = props => {
  const {left, middle, right} = props;
  const insetsTop = 0;
  return (
    <TopBarWrapper
      style={{
        ...elevations.medium,
        height: buttonHeight.medium + spacing + insetsTop,
        paddingTop: spacing + insetsTop,
      }}
    >
      <Left>{left}</Left>
      <Middle>{middle}</Middle>
      <Right>{right}</Right>
    </TopBarWrapper>
  );
};
TopBar.displayName = 'TopBar';

const TopBarWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-shrink: 0;
  background-color: ${topBarBackgroundColor};
  padding: ${spacing}px;
`;

const Left = styled.div`
  flex-shrink: 0;
`;
const Middle = styled.div`
  flex-grow: 1;
`;
const Right = styled.div`
  flex-shrink: 0;
`;
