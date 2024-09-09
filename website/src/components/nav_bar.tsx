import {FC} from 'react';
import {styled} from 'styled-components';
import {useLocation} from 'wouter';

import {UnthemedNavLink} from '@shared-web/components/core/button';
import {useTheme} from '@shared-web/theme/theme_context';
import {FrontendTheme} from '@shared-web/theme/theme_model';

interface NavBarProps {}

export const NavBar: FC<NavBarProps> = () => {
  const [location] = useLocation();
  const {main} = useTheme();
  return (
    <Wrapper $theme={main}>
      <StyledNavLink $theme={main} $active={location === '/'} to="/">
        Home
      </StyledNavLink>
      <StyledNavLink $theme={main} $active={location === '/theme'} to="/theme">
        Theme
      </StyledNavLink>
    </Wrapper>
  );
};

NavBar.displayName = 'NavBar';

const Wrapper = styled.div<{$theme: FrontendTheme['main']}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 64px;
  flex-shrink: 0;
  background: ${p => p.$theme.highlight2};
  box-shadow: 0px 4px 10px -10px black;
`;

const StyledNavLink = styled(UnthemedNavLink)<{$active: boolean; $theme: FrontendTheme['main']}>`
  color: ${p => p.$theme.textColor};
  padding: 8px 16px;
  border-radius: 4px;
  ${p => p.$active && `background: ${p.$theme.highlight3};`}
  &:hover {
    ${p => !p.$active && `background: ${p.$theme.highlight3};`}
  }
`;
