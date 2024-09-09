/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {clearPersistentDataStore, createPersistentDataStore} from '@src/lib/data_store';
export interface Player {
  id: number;
  name: string;
  fail: number;
  failDesign: string;
  score: number;
}

export interface Game {
  id: number;
  creationTime: number;
  players: Player[];
  currentPlayerId: number;
  lastGame?: Game;
  lastPlay: string;
}

const gameDataStore = createPersistentDataStore<Game[]>('games', []);
export const getGames = gameDataStore.getData;
export const setGames = gameDataStore.setData;
export const setGame = (game: Game): void => {
  setGames(
    getGames().map(g => {
      if (g.currentPlayerId === 0) {
        g.currentPlayerId = g.players[0]?.id ?? 0;
      }
      return g.id === game.id ? {...game} : g;
    })
  );
};
export const useGames = gameDataStore.useData;

export const createNewGame = (players: Player[]): Game => {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const gameId = Math.round(Math.random() * 1000000);
  const playerData = players.map(({name, failDesign}) => ({
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    id: Math.round(Math.random() * 1000000),
    name,
    fail: 0,
    score: 0,
    failDesign,
  }));
  const newGame: Game = {
    id: gameId,
    creationTime: Date.now(),
    players: playerData,
    currentPlayerId: 0,
    lastGame: undefined,
    lastPlay: 'La partie commence!',
  };
  setGames([...getGames(), newGame]);
  return newGame;
};

export const removeGame = (id: number): void => {
  setGames(getGames().filter(g => g.id !== id));
};

export const removePersistentStore = (): void => {
  clearPersistentDataStore('games');
};

export const addPlayer = (game: Game): void => {
  const newPlayer: Player = {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    id: Math.round(Math.random() * 1000000),
    name: `Nouveau joueur ${game.players.length + 1}`,
    fail: 0,
    score: 0,
    failDesign: '💣',
  };
  game.players = [...game.players, newPlayer];
  setGame(game);
};

export const delPlayer = (game: Game, player: Player): void => {
  game.players = game.players.filter(p => p.id !== player.id);
  if (game.currentPlayerId === player.id) {
    game.currentPlayerId = game.players.at(-1)?.id ?? 0;
  }
  setGame(game);
};

interface PlayerScoreChange {
  player: Player;
  previousScore: number;
}

const checkPerfectInternal = (
  player: Player | undefined,
  game: Game
): Record<number, PlayerScoreChange> => {
  if (!player || player.score === 0) {
    return [];
  }
  const scoreChanges: Record<number, PlayerScoreChange> = {};
  for (const p of game.players) {
    if (p.id !== player.id && p.score === player.score) {
      scoreChanges[p.id] = {player: p, previousScore: p.score};
      p.score = Math.floor(p.score / 2);
    }
  }
  if (Object.keys(scoreChanges).length === 0) {
    return {};
  }
  return {...scoreChanges, ...checkPerfectInternal(Object.values(scoreChanges)[0]?.player, game)};
};

const checkPerfect = (player: Player, game: Game): void => {
  const playerPowned = checkPerfectInternal(player, game);
  if (Object.keys(playerPowned).length > 0) {
    alert(
      `Powned ! ${Object.values(playerPowned)
        .map(p => `${p.player.name} is powned (${p.previousScore} => ${p.player.score})`)
        .join('\n')}`
    );
  }
};

const handleScoreTooBig = (player: Player, game: Game): void => {
  player.score = 25;
  checkPerfect(player, game);
  alert(`Dépassement ! ${player.name} à dépassé la limite`);
};

const overFail = (player: Player, game: Game): void => {
  const objectiveScore = 50;
  if (player.score >= objectiveScore / 2) {
    player.score = objectiveScore / 2;
    alert(`${String(player.failDesign)} ${player.name} tombe à ${objectiveScore / 2}`);
  } else {
    player.score = 0;
    alert(`${String(player.failDesign)} ${player.name} tombe à 0`);
  }
  player.fail = 0;
  checkPerfect(player, game);
};

export const cloneGame = (game: Game): Game => ({
  id: game.id,
  creationTime: game.creationTime,
  players: game.players.map(p => ({...p})),
  currentPlayerId: game.currentPlayerId,
  lastGame: game,
  lastPlay: game.lastPlay,
});

const updatePlayerInGame = (
  game: Game,
  playerId: number,
  changes: Partial<Player>
): {updatedGame: Game; updatedPlayer: Player} => {
  const player = game.players.find(p => p.id === playerId);
  if (player === undefined) {
    throw new Error('Player not found');
  }
  const updatedPlayer = {...player, ...changes};
  const updatedGame = {
    ...game,
    players: game.players.map(p => (p.id === playerId ? updatedPlayer : {...p})),
    lastGame: game,
  };
  return {updatedGame, updatedPlayer};
};

const getNextPlayerId = (game: Game): number => {
  const currentPlayerIndex = game.players.findIndex(p => p.id === game.currentPlayerId);
  return game.players[(currentPlayerIndex + 1) % game.players.length]?.id ?? 0;
};

export const isDone = (game: Game): boolean => {
  const objectiveScore = 50;
  for (const p of game.players) {
    if (p.score === objectiveScore) {
      return true;
    }
  }
  return false;
};

export const addPlay = (num: number, player: Player, game: Game): void => {
  const newScore = player.score + num;
  const {updatedGame, updatedPlayer} = updatePlayerInGame(game, player.id, {
    score: newScore,
    fail: 0,
  });
  updatedGame.lastPlay = `${player.name} marque ${num} point${num > 1 ? 's' : ''}`;

  const winningScore = 50;
  if (newScore > winningScore) {
    handleScoreTooBig(updatedPlayer, updatedGame);
  }
  if (updatedPlayer.score === winningScore) {
    alert(`Victoire ! ${player.name} à gagné`);
    updatedGame.lastPlay += ` et gagne la partie!`;
  }
  checkPerfect(updatedPlayer, updatedGame);
  updatedGame.currentPlayerId = getNextPlayerId(updatedGame);
  setGame(updatedGame);
};

export const addFail = (player: Player, game: Game): void => {
  const {updatedGame, updatedPlayer} = updatePlayerInGame(game, player.id, {
    fail: player.fail + 1,
  });
  updatedGame.lastPlay = `${player.name} a raté`;
  const maxFail = 3;
  if (updatedPlayer.fail >= maxFail) {
    overFail(updatedPlayer, updatedGame);
  }
  checkPerfect(updatedPlayer, updatedGame);
  updatedGame.currentPlayerId = getNextPlayerId(updatedGame);
  setGame(updatedGame);
};

export const loadingPreviousPlay = (game: Game): void => {
  const newGame = game.lastGame;
  if (newGame) {
    setGame(newGame);
  }
};

export const movePlayerDown = (player: Player, game: Game): void => {
  for (let index = 0; index < game.players.length; index++) {
    const p = game.players[index]!;
    if (p.id === player.id) {
      [game.players[index], game.players[index + 1]] = [
        game.players[index + 1]!,
        game.players[index]!,
      ];
      setGame(game);
      return;
    }
  }
};

export const setPlayerFailDesign = (text: string, player: Player, game: Game): void => {
  game.players = game.players.map(p => (p.id === player.id ? {...p, failDesign: text} : p));
  setGame(game);
};
/* eslint-enable @typescript-eslint/no-non-null-assertion */
