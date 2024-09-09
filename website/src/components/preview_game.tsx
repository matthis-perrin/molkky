import {FC} from 'react';
import {styled} from 'styled-components';

import {UnthemedNavLink} from '@shared-web/components/core/button';
import {SvgIcon} from '@shared-web/components/core/svg_icon';
import {checkIcon} from '@shared-web/components/icons/check_icon';
import {syncIcon} from '@shared-web/components/icons/mui/sync_icon';

import {PlayerFailIcon} from '@src/components/player_fail_icon';
import {formatDate} from '@src/lib/format';
import {isDone, useGames} from '@src/lib/stores';
import {
  borderRadius,
  fontSizes,
  pastilleBackgroundColor,
  pastilleColor,
  spacing,
} from '@src/lib/theme';

const maxFail = 3;
const WINNER_SCORE = 50;

interface PreviewGameProps {
  gameId: number;
}

export const PreviewGame: FC<PreviewGameProps> = ({gameId}) => {
  const [games] = useGames();
  const game = games.find(g => g.id === gameId);

  if (game === undefined) {
    return <></>;
  }

  const sortedPlayer = [...game.players];
  sortedPlayer.sort((p1, p2) => p2.score - p1.score);

  return (
    <PreviewGameWrapper to={`/play/${gameId}`}>
      <Wrapper>
        <WrapperDate>
          <CreationTime>{formatDate(game.creationTime)}</CreationTime>
          <SvgIcon
            key="icon"
            icon={isDone(game) ? checkIcon : syncIcon}
            size={fontSizes.large}
            color={pastilleColor}
          />
        </WrapperDate>
        {sortedPlayer.map(p => (
          <WrapperPlayer key={p.id}>
            <Name>{`${p.score === WINNER_SCORE ? '🏆 ' : ''}${p.name}`}</Name>
            {isDone(game) ? <></> : <PlayerFailIcon player={p} maxFail={maxFail} />}
            <Score>{p.score}</Score>
          </WrapperPlayer>
        ))}
      </Wrapper>
    </PreviewGameWrapper>
  );
};
PreviewGame.displayName = 'PreviewGame';

const PreviewGameWrapper = styled(UnthemedNavLink)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${spacing}px;
  background-color: ${pastilleBackgroundColor};
  border-radius: ${borderRadius * 2}px;
  color: ${pastilleColor};
`;

const WrapperDate = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const CreationTime = styled.div`
  flex-grow: 1;
  text-align: left;
  font-size: ${fontSizes.medium}px;
  color: ${pastilleColor};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: ${spacing}px;
`;

const WrapperPlayer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const Name = styled.div`
  flex-shrink: 1;
  flex-grow: 1;
  font-size: ${fontSizes.medium}px;
  color: ${pastilleColor};
`;

const Score = styled.div`
  width: 40px;
  flex-shrink: 0;
  font-size: ${fontSizes.large}px;
  font-weight: 500;
  text-align: right;
  color: ${pastilleColor};
`;
