import {FC, useCallback, useMemo, useState} from 'react';
import {styled} from 'styled-components';
import {useLocation, useParams} from 'wouter';

import {minusIcon} from '@shared-web/components/icons/minus_icon';
import {accountPlusIcon} from '@shared-web/components/icons/mui/account_plus_icon';
import {arrowLeftIcon} from '@shared-web/components/icons/mui/arrow_left_icon';
import {diceIcon} from '@shared-web/components/icons/mui/dice_icon';
import {plusIcon} from '@shared-web/components/icons/plus_icon';

import {CustomButton} from '@src/components/custom_buttons';
import {PlayerForm} from '@src/components/player_form';
import {TopBar} from '@src/components/top_bar';
import {addPlayer, Player, useGames} from '@src/lib/stores';
import {
  fontSizes,
  pastilleBackgroundColor,
  spacing,
  topBarBackgroundColor,
  topBarButtonWidth,
  topBarColor,
} from '@src/lib/theme';

interface RandomTeamsProps {}

export const RandomTeamsPage: FC<RandomTeamsProps> = () => {
  const setLocation = useLocation()[1];
  const gameId = parseFloat(useParams()['gameId'] ?? '');

  const [games] = useGames();
  const game = games.find(g => g.id === gameId);
  const [teamCount, setTeamCount] = useState(2);

  const [shuffledIndexes, setShuffledIndexes] = useState<number[]>(() =>
    [...new Array(100)].map(() => 0)
  );

  const handleShufflePress = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    setShuffledIndexes([...new Array(100)].map((_, i) => i).sort(() => Math.random() - 0.5));
  }, []);

  const teams = useMemo(() => {
    if (!game) {
      return [];
    }
    const players = [...game.players];
    const teams: Player[][] = [...new Array(teamCount)].map(() => []);
    const playersByTeam = Math.floor(players.length / teamCount) + 1;
    const firstTeamWithOneLessPlayer = players.length - (playersByTeam - 1) * teamCount;
    let index = 0;
    let currentTeamIndex = 0;
    while (players.length > 0) {
      const currentTeam = teams[currentTeamIndex];
      const randIndex = shuffledIndexes[index];
      if (randIndex === undefined || !currentTeam) {
        return teams;
      }
      if (currentTeamIndex < firstTeamWithOneLessPlayer && currentTeam.length >= playersByTeam) {
        currentTeamIndex++;
        continue;
      } else if (
        currentTeamIndex >= firstTeamWithOneLessPlayer &&
        currentTeam.length >= playersByTeam - 1
      ) {
        currentTeamIndex++;
        continue;
      }
      const [nextPlayer] = players.splice(randIndex % players.length, 1);
      if (nextPlayer === undefined) {
        return teams;
      }
      currentTeam.push(nextPlayer);
      index++;
    }
    return teams;
  }, [game, shuffledIndexes, teamCount]);

  const handleCancelPress = useCallback(() => {
    setLocation(`/edit/${gameId}`);
  }, [gameId, setLocation]);

  const handleAddPlayerPress = useCallback(() => {
    if (!game) {
      return;
    }
    addPlayer(game);
  }, [game]);

  const handleIncreaseTeamCount = useCallback(() => {
    setTeamCount(teamCount + 1);
  }, [teamCount]);
  const handleDecreaseTeamCount = useCallback(() => {
    setTeamCount(Math.max(2, teamCount - 1));
  }, [teamCount]);

  const handleConfirm = useCallback(() => {
    if (game === undefined) {
      return;
    }
    setLocation(`/edit/${gameId}`);
  }, [game, gameId, setLocation]);

  if (!game) {
    return <></>;
  }

  return (
    <>
      <TopBar
        left={
          <CustomButton
            icon={arrowLeftIcon}
            text="Retour"
            onClick={handleCancelPress}
            iconSizeRatio={1.2}
            width={topBarButtonWidth}
          />
        }
        middle={<Titre>{`Équipes`}</Titre>}
        right={<CustomButton text="Valider" onClick={handleConfirm} width={topBarButtonWidth} />}
      />
      <StyledScrollView>
        <TeamCountWrapper key="team-count">
          <TeamCountLabel>Nombre d'équipes</TeamCountLabel>
          <CustomButton icon={minusIcon} onClick={handleDecreaseTeamCount} />
          <TeamCountValue>{teamCount}</TeamCountValue>
          <CustomButton icon={plusIcon} onClick={handleIncreaseTeamCount} />
        </TeamCountWrapper>
        <TeamsWrapper>
          {teams.map((team, teamIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <TeamWrapper key={teamIndex}>
              <TeamName>{`ÉQUIPE ${teamIndex + 1}`}</TeamName>
              {team.map(player => (
                <PlayerForm key={player.id} game={game} player={player} />
              ))}
            </TeamWrapper>
          ))}
        </TeamsWrapper>
      </StyledScrollView>
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
          <CustomButton icon={diceIcon} text="Mélanger" onClick={handleShufflePress} size="large" />
        </ButtonWrapper>
      </ButtonsWrapper>
    </>
  );
};
RandomTeamsPage.displayName = 'RandomTeamsPage';

const TeamsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 32px;
`;

const TeamWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing}px;
`;

const TeamName = styled.div`
  font-weight: 500;
  padding: 0 ${spacing}px;
`;

const TeamCountWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  background-color: ${pastilleBackgroundColor};
  margin: 0 -${spacing}px;
  padding: ${spacing}px;
`;

const TeamCountLabel = styled.div`
  font-size: ${fontSizes.large}px;
  flex-grow: 1;
`;

const TeamCountValue = styled.div`
  font-size: ${fontSizes.large}px;
  width: 48px;
  text-align: center;
  font-weight: 500;
`;

const Titre = styled.div`
  font-size: ${fontSizes.medium}px;
  flex-grow: 1;
  text-align: center;
  color: ${topBarColor};
`;

const StyledScrollView = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${spacing}px;
`;

const ButtonWrapper = styled.div`
  margin: ${spacing}px;
  margin-bottom: 0;
  background-color: transparent;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${topBarBackgroundColor};
  padding-bottom: 32px;
`;
