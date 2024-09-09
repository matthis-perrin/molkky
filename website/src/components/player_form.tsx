import EmojiPicker, {EmojiClickData, SuggestionMode} from 'emoji-picker-react';
import {ChangeEventHandler, FC, useCallback, useState} from 'react';
import {styled} from 'styled-components';

import {trashCanOutlineIcon} from '@shared-web/components/icons/mui/trash_can_outline_icon';

import {CustomButton} from '@src/components/custom_buttons';
import {delPlayer, Game, Player, setGame, setPlayerFailDesign} from '@src/lib/stores';
import {
  appBackgroundColor,
  borderRadius,
  buttonHeight,
  fontSizes,
  inputBackgroundColor,
  pastilleBackgroundColor,
  spacing,
} from '@src/lib/theme';

interface PlayerFormProps {
  game: Game;
  player: Player;
}

export const PlayerForm: FC<PlayerFormProps> = props => {
  const {game, player} = props;

  const [emojiPickerShown, setEmojiPickerShown] = useState(false);

  const handlePlayerEmojiPress = useCallback((): void => {
    setEmojiPickerShown(true);
  }, []);

  const handlePlayerNameChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    evt => {
      player.name = evt.currentTarget.value;
      setGame(game);
    },
    [game, player]
  );

  const handlePlayerEmojiClickSelect = useCallback(
    (data: EmojiClickData) => {
      setPlayerFailDesign(data.emoji, player, game);
      setEmojiPickerShown(false);
    },
    [game, player]
  );

  const handleDeletePlayerPress = useCallback((): void => {
    delPlayer(game, player);
  }, [game, player]);

  return (
    <>
      <PlayerWrapper key={player.id}>
        <PlayerEmoji onClick={handlePlayerEmojiPress}>{player.failDesign}</PlayerEmoji>
        <TextInputPlayer onChange={handlePlayerNameChange} defaultValue={player.name} />
        <CustomButton
          icon={trashCanOutlineIcon}
          onClick={handleDeletePlayerPress}
          iconSizeRatio={1.3}
        />
      </PlayerWrapper>
      {emojiPickerShown ? (
        <EmojiWrapper>
          <EmojiPicker
            height={'100%'}
            width={'100%'}
            suggestedEmojisMode={SuggestionMode.FREQUENT}
            // eslint-disable-next-line react/forbid-component-props
            className="emoji-picker"
            onEmojiClick={handlePlayerEmojiClickSelect}
          />
        </EmojiWrapper>
      ) : (
        <></>
      )}
    </>
  );
};

PlayerForm.displayName = 'PlayerForm';

const PlayerWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: ${spacing}px;
  border-radius: ${borderRadius * 2}px;
  background-color: ${pastilleBackgroundColor};
  & > * {
    flex-shrink: 0;
  }
`;

const PlayerEmoji = styled.div`
  background-color: ${inputBackgroundColor};
  font-size: ${fontSizes.medium}px;
  height: ${buttonHeight.medium}px;
  width: ${buttonHeight.medium}px;
  text-align: center;
  line-height: ${buttonHeight.medium}px;
  border-radius: ${borderRadius}px;
`;

const TextInputPlayer = styled.input`
  flex-grow: 1;
  background-color: ${inputBackgroundColor};
  font-size: ${fontSizes.medium}px;
  height: ${buttonHeight.medium}px;
  border-radius: ${borderRadius}px;
  padding-left: ${spacing}px;
  margin: 0 ${spacing / 2}px;
  border: solid 2px #34495536;
`;

const EmojiWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: ${appBackgroundColor};
  .emoji-picker .epr-emoji-list > li:first-of-type {
    display: none;
  }
  .emoji-picker > div:last-of-type {
    display: none;
  }
`;
