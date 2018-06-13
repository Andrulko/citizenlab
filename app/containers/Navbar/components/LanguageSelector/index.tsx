import React from 'react';

// components
import Popover from 'components/Popover';
import Button from 'components/UI/Button';
import Icon from 'components/UI/Icon';

// services
import { updateLocale } from 'services/locale';

// style
import styled from 'styled-components';
import { colors, fontSize } from 'utils/styleUtils';

// i18n
import { shortenedAppLocalePairs } from 'i18n';

// typings
import { Locale } from 'typings';

const Container = styled.div`
  display: flex;
  margin-left: 0px;
  position: relative;
  cursor: pointer;
  outline: none;

  * {
    user-select: none;
  }
`;

const StyledPopover = styled(Popover)`
  display: flex;
  flex-direction: column;
  z-index: 5;
`;

const DropdownItemIcon = styled(Icon)`
  height: 6px;
  width: 11px;
  fill: inherit;
  margin-top: -2px;
  margin-left: 4px;
  transition: all 100ms ease-out;
`;

const OpenMenuButton = styled.button`
  color: ${colors.label};
  cursor: pointer;

  &:hover,
  &:focus {
    color: rgba(0,0,0,.87);
  }
`;

const PopoverItem = styled(Button)`
  color: ${colors.label};
  fill: ${colors.label};
  font-size: ${fontSize('large')};
  font-weight: 400;
  transition: all 80ms ease-out;

  &.active button.Button,
  &.active a.Button {
    color: rgba(0,0,0,.95);
    font-weight: 700;
  }

  .buttonText {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  a.Button,
  button.Button {
    background: #fff;
    border-radius: 5px;

    &:hover,
    &:focus {
      color: #000;
      background: #f6f6f6;
      fill: #000;
    }
  }
`;

type Props = {
  currentLocale: Locale;
  localeOptions: Locale[];
};

type State = {
  PopoverOpened: boolean;
};

export default class LanguageSelector extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props as any);
    this.state = {
      PopoverOpened: false
    };
  }

  togglePopover = () => {
    this.setState(state => ({ PopoverOpened: !state.PopoverOpened }));
  }

  closePopover = () => {
    this.setState({ PopoverOpened: false });
  }

  handleLanguageSelect = (newLocale) => () => {
    updateLocale(newLocale);
    this.closePopover();
  }

  render() {
    const { PopoverOpened } = this.state;
    const { localeOptions, currentLocale } = this.props;
    return (
      <Container>
        <OpenMenuButton onClick={this.togglePopover}>
          {currentLocale.substr(0, 2).toUpperCase()}
          <DropdownItemIcon name="dropdown" />
        </OpenMenuButton>
        <StyledPopover
          open={PopoverOpened}
          onCloseRequest={this.closePopover}
        >
        {
          localeOptions.map(locale => (
            <PopoverItem
              key={locale}
              style="text"
              onClick={this.handleLanguageSelect(locale)}
              className={locale === currentLocale ? 'active' : ''}
            >
              {shortenedAppLocalePairs[locale]}
            </PopoverItem>
          ))
        }
        </StyledPopover>
      </Container>
    );
  }
}
