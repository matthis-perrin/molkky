import {FC, useCallback, useState} from 'react';
import {styled} from 'styled-components';
import {useLocation} from 'wouter';

import {arrayJoin} from '@shared/lib/array_utils';

import {Spacing} from '@shared-web/components/core/spacing';
import {SvgIcon} from '@shared-web/components/core/svg_icon';
import {targetQuestionIcon} from '@shared-web/components/icons/mui/target_question_icon';
import {plusIcon} from '@shared-web/components/icons/plus_icon';

import {CustomButton} from '@src/components/custom_buttons';
import {PreviewGame} from '@src/components/preview_game';
import {TopBar} from '@src/components/top_bar';
// import {clearPersistentDataStore} from '@src/lib/data_store';
import {createNewGame, isDone, useGames} from '@src/lib/stores';
import {
  appBackgroundColor,
  buttonBackgroundColor,
  fontSizes,
  spacing,
  topBarBackgroundColor,
  topBarColor,
} from '@src/lib/theme';

export const HomePage: FC = () => {
  const setLocation = useLocation()[1];
  const [modalShown, setModalShown] = useState(false);

  const [games] = useGames();
  const sortedGames = games.sort((g1, g2) => g2.creationTime - g1.creationTime);
  const gameInProgress = sortedGames.filter(g => !isDone(g));
  const gameDone = sortedGames.filter(g => isDone(g));

  const handleNewGamePress = useCallback(() => {
    const newGame = createNewGame([]);
    setLocation(`/edit/${newGame.id}`);
  }, [setLocation]);
  const handleShowPositionsPress = useCallback(() => setModalShown(true), []);
  const handleModalTouch = useCallback(() => setModalShown(false), []);

  return (
    <>
      <TopBar
        left={
          <SvgIcon
            icon={targetQuestionIcon}
            size={24}
            color={'white'}
            onClick={handleShowPositionsPress}
          />
        }
        middle={<Title>MOLKKY</Title>}
        right={<Spacing width={24} />}
      />
      {/* <CustomButtonText
          text="Reset Data"
          onClick={() => clearPersistentDataStore('games')}
          size="small"
        ></CustomButtonText> */}
      <StyledScrollView>
        <CustomButton
          text="Nouvelle partie"
          icon={plusIcon}
          size="large"
          onClick={handleNewGamePress}
        />
        <Spacing height={spacing} />
        {arrayJoin(
          [...gameInProgress, ...gameDone].map(g => <PreviewGame key={g.id} gameId={g.id} />),
          i => (
            <Spacing key={i} height={spacing} />
          )
        )}
      </StyledScrollView>
      {modalShown ? (
        <ModalWrapper onTouchStart={handleModalTouch}>
          <Modal>
            {[
              /* eslint-disable @typescript-eslint/no-magic-numbers */
              [7, 9, 8],
              [5, 11, 12, 6],
              [3, 10, 4],
              [1, 2],
              /* eslint-enable @typescript-eslint/no-magic-numbers */
            ].map(line => (
              <ModalLine key={line.join('-')}>
                {line.map(val => (
                  <ModalCell key={val}>
                    <ModalCellText>{val}</ModalCellText>
                  </ModalCell>
                ))}
              </ModalLine>
            ))}
          </Modal>
        </ModalWrapper>
      ) : (
        <></>
      )}
    </>
  );
};
HomePage.displayName = 'HomePage';

const Title = styled.div`
  font-size: ${fontSizes.medium}px;
  text-align: center;
  color: ${topBarColor};
`;

const StyledScrollView = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex-grow: 1;
  padding: ${spacing}px;
  padding-bottom: ${
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    32 + spacing
  }px;
  gap: ${spacing};
`;

const ModalWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #000000aa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const modalWidth = 300;
const modalHeight = 300;

const Modal = styled.div`
  position: absolute;
  width: ${modalWidth}px;
  height: ${modalHeight}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 16px;
  background-color: ${appBackgroundColor};
`;

const ModalLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: -9px;
`;

const ModalCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 32px;
  width: 64px;
  height: 64px;
  background-color: ${topBarBackgroundColor};
`;

const ModalCellText = styled.div`
  font-size: 30px;
  font-weight: 500;
  color: ${buttonBackgroundColor};
`;
