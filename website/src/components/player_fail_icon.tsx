import {FC} from 'react';
import {styled} from 'styled-components';

import {FailIcon} from '@src/components/fail_icon';
import {Player} from '@src/lib/stores';

interface PlayerFailIconProps {
  player: Player;
  maxFail: number;
}

export const PlayerFailIcon: FC<PlayerFailIconProps> = props => {
  const {maxFail, player} = props;
  const spacing = 4;
  const fails: JSX.Element[] = [];
  for (let i = 0; i < maxFail; i++) {
    fails.push(
      <div key={`spacing-${i}`} style={{width: i === 0 ? 0 : spacing}}></div>,
      <FailIcon key={`icon-${i}`} failDesign={player.failDesign} disable={i >= player.fail} />
    );
  }
  return <PlayerFailIconWrapper>{fails}</PlayerFailIconWrapper>;
};
PlayerFailIcon.displayName = 'PlayerFailIcon';

const PlayerFailIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;
`;
