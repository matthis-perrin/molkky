import {FC, useCallback} from 'react';
import {styled} from 'styled-components';
import {useLocation, useParams} from 'wouter';

import {homeIcon} from '@shared-web/components/icons/home_icon';
import {pencilIcon} from '@shared-web/components/icons/mui/pencil_icon';
import {undoIcon} from '@shared-web/components/icons/mui/undo_icon';

import {CustomButton} from '@src/components/custom_buttons';
import {PlayerView} from '@src/components/player_view';
import {TopBar} from '@src/components/top_bar';
import {createNewGame, loadingPreviousPlay, useGames} from '@src/lib/stores';
import {
  bannerBackgroundColor,
  bannerColor,
  fontSizes,
  spacing,
  topBarBackgroundColor,
  topBarButtonWidth,
  topBarColor,
} from '@src/lib/theme';

export const GamePage: FC = () => {
  const setLocation = useLocation()[1];
  const gameId = parseFloat(useParams()['gameId'] ?? '');
  const [games] = useGames();

  const game = games.find(g => g.id === gameId);

  const handleHomePagePress = useCallback(() => setLocation('/'), [setLocation]);
  const handleEditPagePress = useCallback(
    () => setLocation(`/edit/${gameId}`),
    [gameId, setLocation]
  );
  const handleCancelLastTurnPress = useCallback(() => {
    if (game === undefined) {
      return;
    }
    loadingPreviousPlay(game);
  }, [game]);
  const handleRematchPress = useCallback(() => createNewGame(game?.players ?? []), [game?.players]);

  if (game === undefined) {
    return <></>;
  }
  return (
    <>
      <TopBar
        left={
          <CustomButton
            text="Accueil"
            icon={homeIcon}
            onClick={handleHomePagePress}
            width={topBarButtonWidth}
          />
        }
        middle={<Titre>{`Partie`}</Titre>}
        right={
          <CustomButton
            text="Edition"
            icon={pencilIcon}
            onClick={handleEditPagePress}
            width={topBarButtonWidth}
          />
        }
      />
      <PlayerScrollView>
        <LastPlay>
          <TextLastPlay>{game.lastPlay}</TextLastPlay>
        </LastPlay>
        <CustomButton
          text="Annuler le dernier lancé"
          icon={undoIcon}
          size="large"
          onClick={handleCancelLastTurnPress}
          hidden={game.lastGame === undefined}
        />
        {game.players.map(p => (
          <PlayerView
            key={p.id}
            gameId={game.id}
            playerId={p.id}
            isCurrentPlayer={p.id === game.currentPlayerId}
          />
        ))}
      </PlayerScrollView>
      <ButtonsWrapper>
        <ButtonWrapper>
          <CustomButton
            // icon="dice-3"
            text="Revanche !"
            onClick={handleRematchPress}
            size="large"
          />
        </ButtonWrapper>
      </ButtonsWrapper>
    </>
  );
};
GamePage.displayName = 'Game';

const Titre = styled.div`
  font-size: ${fontSizes.medium}px;
  flex-grow: 1;
  text-align: center;
  color: ${topBarColor};
`;

const LastPlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: ${bannerBackgroundColor};
  padding: ${spacing}px;
  margin: 0 -${spacing}px;
`;

const PlayerScrollView = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${spacing}px;
  overflow-y: scroll;
  overflow-x: hidden;
  gap: ${spacing}px;
  height: 100%;
`;

const TextLastPlay = styled.div`
  color: ${bannerColor};
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${topBarBackgroundColor};
  padding-bottom: 32px;
`;

const ButtonWrapper = styled.div`
  margin: ${spacing}px;
  margin-bottom: 0;
  background-color: transparent;
`;
