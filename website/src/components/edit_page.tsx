/* eslint-disable react/jsx-no-bind */
import {FC, Fragment, useCallback} from 'react';
import {styled} from 'styled-components';
import {useLocation, useParams} from 'wouter';

import {homeIcon} from '@shared-web/components/icons/home_icon';
import {accountPlusIcon} from '@shared-web/components/icons/mui/account_plus_icon';
import {diceIcon} from '@shared-web/components/icons/mui/dice_icon';
import {playIcon} from '@shared-web/components/icons/mui/play_icon';
import {swapVerticalIcon} from '@shared-web/components/icons/mui/swap_vertical';
import {trashCanOutlineIcon} from '@shared-web/components/icons/mui/trash_can_outline_icon';

import {CustomButton} from '@src/components/custom_buttons';
import {PlayerForm} from '@src/components/player_form';
import {TopBar} from '@src/components/top_bar';
import {addPlayer, movePlayerDown, Player, removeGame, setGame, useGames} from '@src/lib/stores';
import {
  fontSizes,
  spacing,
  topBarBackgroundColor,
  topBarButtonWidth,
  topBarColor,
} from '@src/lib/theme';

export const EditPage: FC = () => {
  const setLocation = useLocation()[1];
  const gameId = parseFloat(useParams()['gameId'] ?? '');
  const [games] = useGames();

  const game = games.find(g => g.id === gameId);

  const handleDeletePress = useCallback(() => {
    if (game === undefined) {
      return;
    }
    // eslint-disable-next-line no-restricted-globals
    const confirmed = confirm('Voulez-vous supprimer la partie ?');
    if (confirmed) {
      setLocation('/');
      removeGame(gameId);
    }
  }, [game, gameId, setLocation]);

  const handleAddPlayerPress = useCallback(() => {
    if (game === undefined) {
      return;
    }
    addPlayer(game);
  }, [game]);

  const handleRandomTeamPress = useCallback(() => {
    setLocation(`/random-teams/${gameId}`);
  }, [gameId, setLocation]);

  const handlePlayPress = useCallback(() => {
    if (game === undefined) {
      return;
    }
    setGame(game);
    setLocation(`/play/${game.id}`);
  }, [game, setLocation]);

  const handleHomePress = useCallback(() => {
    setLocation(`/`);
  }, [setLocation]);

  const handleSwapPress = (player: Player): void => {
    if (game === undefined) {
      return;
    }
    movePlayerDown(player, game);
  };

  const sortedPlayer = [...(game?.players ?? [])];
  sortedPlayer.sort((p1, p2) => p2.score - p1.score);
  if (game === undefined) {
    return <></>;
  }

  const scrollViewContent: JSX.Element[] = [];
  for (const [index, p] of sortedPlayer.entries()) {
    scrollViewContent.push(
      <PlayerForm key={p.id} game={game} player={p} />,
      index === game.players.length - 1 ? (
        <Fragment key={index} />
      ) : (
        <WrapperSwap key={index}>
          <CustomButton
            icon={swapVerticalIcon}
            onClick={() => handleSwapPress(p)}
            iconSizeRatio={1.2}
          />
        </WrapperSwap>
      )
    );
  }

  return (
    <>
      <TopBar
        left={
          <CustomButton
            icon={homeIcon}
            text="Accueil"
            onClick={handleHomePress}
            width={topBarButtonWidth}
          />
        }
        middle={<Titre>{`Edition`}</Titre>}
        right={
          <CustomButton
            icon={trashCanOutlineIcon}
            text="Supprimer"
            onClick={handleDeletePress}
            iconSizeRatio={1.2}
            width={topBarButtonWidth}
          />
        }
      />
      <StyledScrollView>{scrollViewContent}</StyledScrollView>
      <ButtonsWrapper>
        <ButtonWrapper>
          <CustomButton
            icon={accountPlusIcon}
            text="Ajouter joueur"
            onClick={handleAddPlayerPress}
            size="large"
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <CustomButton
            icon={diceIcon}
            text="Tirer les équipes au hasard"
            onClick={handleRandomTeamPress}
            size="large"
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <CustomButton icon={playIcon} text="Jouer !" onClick={handlePlayPress} size="large" />
        </ButtonWrapper>
      </ButtonsWrapper>
    </>
  );
};
EditPage.displayName = 'EditPage';

const StyledScrollView = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${spacing}px;
`;

const Titre = styled.div`
  font-size: ${fontSizes.medium}px;
  flex-grow: 1;
  text-align: center;
  color: ${topBarColor};
`;

const ButtonWrapper = styled.div`
  margin: ${spacing}px;
  margin-bottom: 0;
  background-color: transparent;
  flex-shrink: 0;
`;

const WrapperSwap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${-spacing / 2}px 0;
  z-index: 2;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${topBarBackgroundColor};
  padding-bottom: 32px;
`;

/* eslint-enable react/jsx-no-bind */
