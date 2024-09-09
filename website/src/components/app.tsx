import {FC} from 'react';
import {styled} from 'styled-components';
import {Route} from 'wouter';

import {Modal} from '@shared-web/components/core/modal';

import {EditPage} from '@src/components/edit_page';
import {GamePage} from '@src/components/game_page';
import {HomePage} from '@src/components/home_page';
import {RandomTeamsPage} from '@src/components/random_teams_page';
import {appBackgroundColor, topBarBackgroundColor} from '@src/lib/theme';

export const App: FC = () => {
  const routes = (
    <AppWrapper>
      <AppContainer>
        <Route path="/" component={HomePage} />
        <Route path="/play/:gameId" component={GamePage} />
        <Route path="/edit/:gameId" component={EditPage} />
        <Route path="/random-teams/:gameId" component={RandomTeamsPage} />
      </AppContainer>
    </AppWrapper>
  );

  return (
    <Route path="/" nest>
      <>
        <Wrapper>{routes}</Wrapper>
        <Modal />
      </>
    </Route>
  );
};
App.displayName = 'App';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
`;

const AppWrapper = styled.div`
  background-color: ${topBarBackgroundColor};
  height: 100%;
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${appBackgroundColor};
`;
