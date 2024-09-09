import {CSSProperties, FC} from 'react';
import {styled} from 'styled-components';

import {UnthemedButton} from '@shared-web/components/core/button';
import {SvgIcon, SvgIconData} from '@shared-web/components/core/svg_icon';

import {
  borderRadius,
  buttonBackgroundColor,
  buttonColor,
  buttonHeight,
  elevations,
  fontSizes,
  keyboardBackgroundColor,
  keyboardColor,
} from '@src/lib/theme';

interface CustomButtonProps {
  text?: string;
  width?: number;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
  icon?: SvgIconData;
  disabled?: boolean;
  iconSizeRatio?: number;
  hidden?: boolean;
  keyboardStyle?: boolean;
  style?: CSSProperties;
}

export const CustomButton: FC<CustomButtonProps> = props => {
  const {
    text,
    width: optWidth,
    onClick,
    size,
    icon,
    disabled,
    iconSizeRatio,
    hidden,
    keyboardStyle,
    style,
  } = props;

  const fontSize = fontSizes[size ?? 'medium'];
  const height = buttonHeight[size ?? 'medium'];
  const width = optWidth ?? (text !== undefined ? '100%' : height);
  const ratioIconSize = iconSizeRatio ?? 1;
  const ratioSeparatorWidth = 0.25;
  const buttonContent: JSX.Element[] = [];
  const opacityDisabled = 0.25;
  const opacity = disabled ? opacityDisabled : 1;
  if (icon !== undefined) {
    buttonContent.push(
      <SvgIcon
        key="icon"
        icon={icon}
        size={fontSize * ratioIconSize}
        color={keyboardStyle ? keyboardColor : buttonColor}
      />
    );
    if (text !== undefined) {
      buttonContent.push(
        <Separator key="separator" style={{width: fontSize * ratioSeparatorWidth}}></Separator>
      );
    }
  }
  if (text !== undefined) {
    buttonContent.push(
      <ButtonText key="text" style={{fontSize, color: keyboardStyle ? keyboardColor : buttonColor}}>
        {text}
      </ButtonText>
    );
  }
  return (
    <ButtonContent
      onClick={onClick}
      disabled={disabled}
      style={{
        ...elevations.medium,
        opacity,
        display: hidden ? 'none' : undefined,
        height,
        width,
        backgroundColor: keyboardStyle ? keyboardBackgroundColor : buttonBackgroundColor,
        ...style,
      }}
    >
      {buttonContent}
    </ButtonContent>
  );
};
CustomButton.displayName = 'CustomButton';

const ButtonContent = styled(UnthemedButton)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${borderRadius}px;
  flex-shrink: 0;
`;

const Separator = styled.div``;

const ButtonText = styled.div``;
