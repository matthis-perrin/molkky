import {Player} from '@src/lib/stores';

export const sortPlayerByName = (players: Player[], name_to_exclude?: string): Player[] => {
  const sortedPlayer = [...players];
  sortedPlayer.sort((p1, p2) => {
    if (p1.name === name_to_exclude) {
      return -1;
    } else if (p2.name === name_to_exclude) {
      return 1;
    }
    return p1.name.localeCompare(p2.name);
  });
  return sortedPlayer;
};
