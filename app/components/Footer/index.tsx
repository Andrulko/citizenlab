import React, { PureComponent } from 'react';
import { Subscription, combineLatest } from 'rxjs';

// libraries
import Link from 'utils/cl-router/Link';

// components
import Fragment from 'components/Fragment';
import SendFeedback from 'components/SendFeedback';

// i18n
import { InjectedIntlProps } from 'react-intl';
import { injectIntl, FormattedMessage } from 'utils/cl-intl';
import { getLocalized } from 'utils/i18n';
import messages from './messages';

// tracking
import { injectTracks } from 'utils/analytics';
import tracks from './tracks';

// services
import { localeStream } from 'services/locale';
import { currentTenantStream, ITenant } from 'services/tenant';
import { LEGAL_PAGES } from 'services/pages';

import eventEmitter from 'utils/eventEmitter';

// style
import styled from 'styled-components';
import Polymorph from 'components/Polymorph';
import { media, colors, fontSizes } from 'utils/styleUtils';

// typings
import { Locale } from 'typings';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const FirstLine = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-right: 20px;
  padding-left: 20px;
  padding-top: 110px;
  padding-bottom: 130px;
  background: #fff;
`;

const LogoLink = styled.a`
  cursor: pointer;
`;

const TenantLogo = styled.img`
  height: 50px;
  margin-bottom: 20px;
`;

const TenantSlogan = styled.div`
  width: 100%;
  max-width: 340px;
  color: ${(props) => props.theme.colorText};
  font-size: ${fontSizes.xl}px;
  font-weight: 500;
  line-height: 28px;
  text-align: center;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
`;

const SecondLine = styled.div`
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-top: 6px solid ${colors.adminBackground};
  padding: 12px 28px;
  position: relative;

  ${media.smallerThanMaxTablet`
    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: center;
  `}
`;

const ShortFeedback = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 25px;
  background-color: ${colors.adminBackground};
  color: ${(props) => props.theme.colorText};
  position: absolute;
  top: -49px;
  left: 0;

  ${media.smallerThanMinTablet`
    width: 100%;
  `}
`;

const ThankYouNote = styled.span`
  display: block;
  padding: 1.5px 0;
  font-size: ${fontSizes.base}px;
  font-weight: 600;
`;

const FeedbackQuestion = styled.span`
  font-size: ${fontSizes.base}px;
  line-height: normal;
  text-align: left;
  margin-right: 12px;

  ${media.smallerThanMinTablet`
    margin-right: 5px;
  `}
`;

const Buttons = styled.div`
  display: flex;
`;

const FeedbackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colorText};
  font-weight: 600;
  text-transform: uppercase;
  padding: 0 12px;
  margin-bottom: -3px;
  z-index: 1;

  ${media.smallerThanMinTablet`
    padding: 0 8px;
  `}

  &:focus,
  &:hover {
    outline: none;
    cursor: pointer;
    text-decoration: underline;
  }
`;

const PagesNav = styled.nav`
  color: ${colors.label};
  flex: 1;
  text-align: left;

  ul {
    display:inline-block;
    padding:0;
    text-align: center;
  }

  li {
    display: inline;

    &:after {
      content:" ";
      letter-spacing: 2em;
      background:center center no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwAAADsABataJCQAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMkMEa+wAAAAnSURBVBhXY/Dz89MA4sNA/B9Ka4AEYQIwfBgkiCwAxjhVopnppwEApxQqhnyQ+VkAAAAASUVORK5CYII=);
    }

    a,
    button {
      white-space:nowrap
    }
  }

  ${media.smallerThanMaxTablet`
    order: 2;
    text-align: center;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 25px;
  `}
`;

const StyledThing = styled(Polymorph)`
  color: ${colors.label};
  font-weight: 400;
  font-size: ${fontSizes.small}px;
  line-height: 19px;
  text-decoration: none;
  padding: 0;
  cursor: pointer;

  &:hover {
    color: #000;
    text-decoration: underline;
  }

  ${media.smallerThanMaxTablet`
    font-size: ${fontSizes.small}px;
    line-height: 16px;
  `}
`;

const StyledButton = StyledThing.withComponent('button');
const StyledLink = StyledThing.withComponent(Link);

const Separator = styled.span`
  color: ${colors.label};
  font-weight: 400;
  font-size: ${fontSizes.base}px;
  line-height: 19px;
  padding-left: 10px;
  padding-right: 10px;

  ${media.smallerThanMaxTablet`
    padding-left: 8px;
    padding-right: 8px;
  `}
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px;

  ${media.smallerThanMaxTablet`
    order: 1;
    margin-top: 15px;
    margin-bottom: 10px;
  `}

  ${media.smallerThanMinTablet`
    padding: 0px;
    margin: 0px;
    margin-top: 35px;
  `}
`;

const PoweredBy = styled.div`
  color: ${colors.label};
  font-size: ${fontSizes.base}px;
  line-height: ${fontSizes.base}px;
  text-decoration: none;
  display: flex;
  align-items: center;
  outline: none;
  padding: 10px 25px 10px 0;
  margin-right: 30px;
  border-right: 1px solid #E8E8E8;

  ${media.smallerThanMaxTablet`
    color: #333;
  `}

  ${media.smallerThanMinTablet`
    flex-direction: column;
    padding: 0px;
    margin: 0px;
    margin-bottom: 22px;
    border: none;
  `}
`;

const PoweredByText = styled.span`
  margin-right: 5px;

  ${media.smallerThanMinTablet`
    margin: 0px;
    margin-bottom: 10px;
  `}
`;

const CitizenlabLink = styled.a`
  width: 151px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 8px;

  ${media.smallerThanMinTablet`
    margin: 0px;
  `}
`;

const CitizenlabName = styled.span`
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-indent: -9999px;
`;

const CitizenlabLogo: any = styled.svg`
  width: 151px;
  height: 27px;
  fill: ${colors.clIconSecondary};
  transition: all 150ms ease-out;

  &:hover {
    fill: #000;
  }
`;

const StyledSendFeedback = styled(SendFeedback)`
  ${media.smallerThanMinTablet`
    display: none;
  `}
`;

const openConsentManager = () => eventEmitter.emit('footer', 'openConsentManager', null);

interface ITracks {
  clickShortFeedbackYes: () => void;
  clickShortFeedbackNo: () => void;
}

interface InputProps {
  showCityLogoSection?: boolean | undefined;
}

interface Props extends InputProps { }

type State = {
  locale: Locale | null;
  currentTenant: ITenant | null;
  showCityLogoSection: boolean;
  shortFeedbackButtonClicked: boolean;
};

class Footer extends PureComponent<Props & ITracks & InjectedIntlProps, State> {
  static displayName = 'Footer';
  subscriptions: Subscription[];

  static defaultProps = {
    showCityLogoSection: true
  };

  constructor(props) {
    super(props);
    this.state = {
      locale: null,
      currentTenant: null,
      showCityLogoSection: false,
      shortFeedbackButtonClicked: false
    };
    this.subscriptions = [];
  }

  componentDidMount() {
    const locale$ = localeStream().observable;
    const currentTenant$ = currentTenantStream().observable;

    this.setState({ showCityLogoSection: !!this.props.showCityLogoSection });

    this.subscriptions = [
      combineLatest(
        locale$,
        currentTenant$
      ).subscribe(([locale, currentTenant]) => {
        this.setState({ locale, currentTenant });
      })
    ];
  }

  componentWillUnmount() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  handleFeedbackButtonClick = (answer: 'yes' | 'no') => () => {
    const { clickShortFeedbackYes, clickShortFeedbackNo } = this.props;

    this.setState({
      shortFeedbackButtonClicked: true
    });

    // tracking
    if (answer === 'yes') {
      clickShortFeedbackYes();
    } else if (answer === 'no') {
      clickShortFeedbackNo();
    }
  }

  render() {
    const { locale, currentTenant, showCityLogoSection, shortFeedbackButtonClicked } = this.state;
    const { formatMessage } = this.props.intl;

    if (locale && currentTenant) {
      const currentTenantLocales = currentTenant.data.attributes.settings.core.locales;
      const currentTenantLogo = currentTenant.data.attributes.logo.medium;
      const tenantSite = currentTenant.data.attributes.settings.core.organization_site;
      const organizationNameMulitiLoc = currentTenant.data.attributes.settings.core.organization_name;
      const currentTenantName = getLocalized(organizationNameMulitiLoc, locale, currentTenantLocales);
      const organizationType = currentTenant.data.attributes.settings.core.organization_type;
      const slogan = currentTenantName ? <FormattedMessage {...messages.slogan} values={{ name: currentTenantName, type: organizationType }} /> : '';
      const poweredBy = <FormattedMessage {...messages.poweredBy} />;
      const footerLocale = `footer-city-logo-${locale}`;

      return (
        <Container role="contentinfo" className={this.props['className']} id="hook-footer">
          {showCityLogoSection &&
            <Fragment title={formatMessage(messages.iframeTitle)} name={footerLocale}>
              <FirstLine id="hook-footer-logo">
                {currentTenantLogo && tenantSite &&
                  <LogoLink href={tenantSite} target="_blank">
                    <TenantLogo src={currentTenantLogo} alt="Organization logo" />
                  </LogoLink>}
                {currentTenantLogo && !tenantSite &&
                  <TenantLogo src={currentTenantLogo} alt="Organization logo" />}
                <TenantSlogan>{slogan}</TenantSlogan>
              </FirstLine>
            </Fragment>
          }

          <SecondLine>
            <ShortFeedback>
              {shortFeedbackButtonClicked ?
                <ThankYouNote>
                  <FormattedMessage {...messages.thanksForFeedback} />
                </ThankYouNote>
                :
                <>
                  <FeedbackQuestion>
                    <FormattedMessage {...messages.feedbackQuestion} />
                  </FeedbackQuestion>
                  <Buttons>
                    <FeedbackButton onClick={this.handleFeedbackButtonClick('yes')}>
                      <FormattedMessage {...messages.yes} />
                    </FeedbackButton>
                    <FeedbackButton onClick={this.handleFeedbackButtonClick('no')}>
                      <FormattedMessage {...messages.no} />
                    </FeedbackButton>
                  </Buttons>
                </>
              }
            </ShortFeedback>
            <PagesNav>
              <ul>
                {LEGAL_PAGES.map((slug, index) => (
                  <li key={slug}>
                    {/* {index !== 0 &&
                      <Separator>•</Separator>
                    } */}
                    <StyledLink to={`/pages/${slug}`}>
                      <FormattedMessage {...messages[slug]} />
                    </StyledLink>
                  </li>
                ))}
                <li>
                  {/* <Separator>•</Separator> */}
                  <StyledButton onClick={openConsentManager}>
                    <FormattedMessage {...messages.cookieSettings} />
                  </StyledButton>
                </li>
              </ul>
            </PagesNav>

            <Right>
              <PoweredBy>
                <PoweredByText>{poweredBy}</PoweredByText>
                <CitizenlabLink href="https://www.citizenlab.co/">
                  <CitizenlabName>CitizenLab</CitizenlabName>
                  <CitizenlabLogo height="100%" viewBox="0 1 140.753 27.002" alt="CitizenLab">
                    <path d="M21.35 1.004h-5.482c-.388 0-.815 0-1.272-.002-1.226-.002-2.618-.005-4.114.006-1.28.01-2.575.005-3.718 0-.584 0-1.134-.003-1.628-.003H0v8.233c0 3.633.488 6.853 1.452 9.573.805 2.27 1.942 4.206 3.38 5.75l.183.192.024.025c.592.61 1.24 1.156 1.92 1.625l.02.014c.063.043.124.084.19.126.026.02.054.035.08.054l.067.04.018.013c1.546.975 2.775 1.24 2.91 1.267l.43.086.432-.086c.135-.027.858-.19 1.86-.682 1.276-.63 2.504-1.557 3.55-2.683 1.438-1.545 2.575-3.48 3.38-5.75.963-2.718 1.452-5.936 1.452-9.566v-.153c.005-1.52.003-2.737 0-3.715V4.33c0-.978 0-1.518.004-2.08l-.004-1.246zM2.513 3.534H9.43v2.74l-2.534 2.55H2.513v-5.29zm6.916 21.4c-.256-.127-.51-.27-.758-.428l-.016-.01-.05-.03c-.022-.017-.045-.03-.065-.044-.05-.03-.097-.064-.145-.098l-.02-.014c-.545-.375-1.064-.814-1.543-1.306l-.018-.02c-.05-.05-.1-.104-.15-.155-1.2-1.29-2.157-2.93-2.845-4.87-.68-1.92-1.1-4.157-1.248-6.648h4.325l2.532 2.55v11.072zm1.235-13.347l-1.508-1.52 1.51-1.52 1.508 1.52-1.51 1.52zm6.866 6.366c-.687 1.94-1.645 3.58-2.845 4.87-.83.892-1.79 1.622-2.78 2.12v-11.08l2.532-2.55h4.34c-.147 2.488-.566 4.72-1.246 6.64zm1.303-9.214H14.43l-2.532-2.55V3.533h6.94v.125c0 .863.003 2.632-.005 5.08zM32.558 20.5c-1.864 0-3.453-1.38-3.453-3.838 0-2.457 1.562-3.81 3.425-3.81h.002c1.81 0 2.658 1.16 2.987 2.29l3.26-1.102c-.576-2.29-2.66-4.583-6.33-4.583-3.92 0-6.99 3.01-6.99 7.205 0 4.168 3.125 7.205 7.1 7.205 3.59 0 5.7-2.32 6.302-4.583l-3.207-1.076c-.3 1.05-1.233 2.292-3.097 2.292zM41 9.87h3.646v13.583H41zM42.808 3.137c-1.233-.002-2.246 1.02-2.246 2.29 0 1.215 1.014 2.236 2.246 2.236 1.26 0 2.248-1.02 2.248-2.236 0-1.27-.987-2.29-2.248-2.29zM52.484 5.814h-3.29v1.904c0 1.215-.658 2.153-2.08 2.153h-.688v3.26h2.44v6.32c0 2.624 1.644 4.196 4.275 4.196 1.07 0 1.728-.192 2.057-.33V20.28c-.192.054-.685.11-1.124.11-1.04 0-1.59-.39-1.59-1.576V13.13h2.714V9.87h-2.713V5.814zM57.743 23.453h3.646V9.87h-3.647M59.554 3.137c-1.233-.002-2.247 1.02-2.247 2.29 0 1.215 1.013 2.236 2.246 2.236 1.26 0 2.248-1.02 2.248-2.236 0-1.27-.985-2.29-2.246-2.29zM68.268 20.25l6.578-7.314V9.872h-10.88v3.174h6.22L63.8 20.223v3.23h11.154V20.25M82.9 9.457c-3.45 0-6.63 2.816-6.63 7.15 0 4.582 3.26 7.26 6.958 7.26 3.316 0 5.455-1.96 6.14-4.307l-3.04-.91c-.44 1.214-1.37 2.07-3.07 2.07-1.808 0-3.316-1.298-3.398-3.094h9.646c0-.054.055-.605.055-1.13 0-4.36-2.494-7.04-6.66-7.04zm-2.96 5.66c.085-1.243 1.126-2.678 3.016-2.68 2.083 0 2.96 1.327 3.017 2.68H79.94zM99.318 9.513c-1.452 0-3.07.635-3.89 2.042V9.87H91.89v13.583h3.646V15.64h-.002c0-1.572.93-2.814 2.52-2.814 1.755 0 2.495 1.187 2.495 2.705v7.924h3.647v-8.557c0-2.983-1.535-5.384-4.88-5.384zM107.594 3.467h2.576v19.986h-2.576zM124.338 14.62c0-2.594-1.533-4.86-5.48-4.86-2.85 0-5.125 1.767-5.4 4.307l2.468.58c.164-1.546 1.177-2.677 2.987-2.677 2 0 2.85 1.076 2.85 2.373 0 .47-.22.884-1.014.994l-3.565.524c-2.272.33-4 1.657-4 4.032 0 2.098 1.728 3.975 4.412 3.975 2.358 0 3.674-1.27 4.248-2.207 0 .966.082 1.463.14 1.793h2.52c-.056-.33-.165-1.02-.165-2.18V14.62zm-2.576 3.146c0 2.9-1.697 3.92-3.808 3.92-1.315 0-2.14-.938-2.14-1.933 0-1.188.824-1.82 1.918-1.987l4.03-.606v.606zM134.697 9.788c-2.193 0-3.727 1.077-4.357 2.264V3.467h-2.55v19.986h2.55V21.52c.823 1.436 2.33 2.292 4.273 2.292 3.92 0 6.14-3.12 6.14-7.067 0-3.865-2.056-6.957-6.056-6.957zm-.467 11.705c-2.274 0-3.918-1.878-3.918-4.748s1.644-4.665 3.918-4.665c2.385 0 3.892 1.795 3.892 4.665s-1.534 4.748-3.892 4.748z" />
                  </CitizenlabLogo>
                </CitizenlabLink>
              </PoweredBy>

              <StyledSendFeedback showFeedbackText={false} />
            </Right>
          </SecondLine>
        </Container>
      );
    }

    return null;
  }
}

const WrappedFooter = injectTracks<Props>(tracks)(injectIntl(Footer));
Object.assign(WrappedFooter).displayName = 'WrappedFooter';

export default WrappedFooter;
