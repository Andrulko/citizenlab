import * as React from 'react';
import * as Rx from 'rxjs/Rx';

// libraries
import Link from 'utils/cl-router/Link';

// components
import Icon from 'components/UI/Icon';
import Fragment from 'components/Fragment';
import { Dropdown } from 'semantic-ui-react';

// i18n
import { InjectedIntlProps } from 'react-intl';
import { injectIntl, FormattedMessage } from 'utils/cl-intl';
import { getLocalized } from 'utils/i18n';
import messages from './messages.js';
import { appLocalePairs } from 'i18n';

// services
import { localeStream, updateLocale } from 'services/locale';
import { currentTenantStream, ITenant } from 'services/tenant';
import { LEGAL_PAGES } from 'services/pages';

// style
import styled from 'styled-components';
import { media, color, fontSizes } from 'utils/styleUtils';

// typings
import { Locale } from 'typings';
import { hideVisually } from 'polished';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 0;
`;

const FirstLine = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 110px 20px;
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
  color: #444;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  text-align: center;
`;

const SecondLine = styled.div`
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-top: 1px solid #eaeaea;
  padding: 12px 28px;

  ${media.smallerThanMaxTablet`
    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: center;
  `}
`;

const PagesNav = styled.nav`
  color: ${color('clGrey')};
  flex: 1;
  text-align: left;

  ul{
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    display: inline-block;
  }

  ${media.smallerThanMaxTablet`
    order: 2;
    text-align: center;
    justify-content: center;
    margin-top: 30px;
    margin-bottom: 15px;
  `}
`;

const StyledLink = styled(Link) `
  color: ${color('clGrey')};
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  text-decoration: none;

  &:hover {
    color: #000;
  }

  ${media.smallerThanMaxTablet`
    font-size: ${fontSizes.small};
    line-height: 16px;
  `}
`;

const Separator = styled.span`
  color: ${color('clGrey')};
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  padding-left: 10px;
  padding-right: 10px;

  ${media.smallerThanMaxTablet`
    padding-left: 8px;
    padding-right: 8px;
  `}
`;

const CitizenLabLogo = styled(Icon) `
  height: 22px;
  fill: ${color('clGrey')};
  margin-left: 8px;
  transition: all 150ms ease-out;
  flex: 1 1 100px;
`;

const PoweredBy = styled.a`
  color: ${color('clGrey')};
  font-weight: 300;
  font-size: 14px;
  line-height: 19px;
  text-decoration: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  outline: none;

  ${media.biggerThanMaxTablet`
    &:hover {
      color: ${color('clGrey')};

      ${CitizenLabLogo} {
        fill: #000;
      }
    }
  `}

  ${media.smallerThanMaxTablet`
    order: 1;
    margin-top: 10px;
    color: #333;

    &:hover {
      color: #333;
    }

    ${CitizenLabLogo} {
      fill: #333;
    }
  `}
`;

const LanguageSelectionWrapper = styled.div`
  padding-left: 1rem;
  margin-left: 1rem;
  text-align: right;

  .ui.selection.dropdown {
    color: ${color('label')};
    display: none;
  }

  &.show {
    .ui.selection.dropdown {
      display: block;
    }
  }

  ${media.smallerThanMaxTablet`
    border-left: 0;
    margin-left: 0;
    margin-top: 10px;
    margin-bottom: 20px;
    padding-left: 0;
  `}
`;

const HiddenLabel = styled.span`
  ${hideVisually() as any}
`;

type Props = {
  showCityLogoSection?: boolean | undefined;
};

type State = {
  locale: Locale | null;
  currentTenant: ITenant | null;
  showCityLogoSection: boolean;
  languageOptions: {
    key: string;
    value: Locale;
    text: string;
  }[]
};

class Footer extends React.PureComponent<Props & InjectedIntlProps, State> {
  subscriptions: Rx.Subscription[];

  public static defaultProps: Partial<Props> = {
    showCityLogoSection: true
  };

  constructor(props: Props) {
    super(props as any);
    this.state = {
      locale: null,
      currentTenant: null,
      showCityLogoSection: false,
      languageOptions: [],
    };
    this.subscriptions = [];
  }

  componentDidMount() {
    const locale$ = localeStream().observable;
    const currentTenant$ = currentTenantStream().observable;

    this.setState({ showCityLogoSection: !!this.props.showCityLogoSection });

    this.subscriptions = [
      Rx.Observable.combineLatest(
        locale$,
        currentTenant$
      ).subscribe(([locale, currentTenant]) => {
        const languageOptions = currentTenant.data.attributes.settings.core.locales.map((locale) => ({
          key: locale,
          value: locale,
          text: appLocalePairs[locale],
        }));

        this.setState({ locale, currentTenant, languageOptions });
      })
    ];
  }

  componentWillUnmount() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  handleLanguageChange (_event, { value }) {
    updateLocale(value);
  }

  render() {
    const { locale, currentTenant, showCityLogoSection } = this.state;
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
            <PagesNav>
              <ul>
                {LEGAL_PAGES.map((slug, index) => (
                  <li key={slug}>
                    {index !== 0  &&
                      <Separator>•</Separator>
                    }
                    <StyledLink to={`/pages/${slug}`}>
                      <FormattedMessage {...messages[slug]} />
                    </StyledLink>
                  </li>
                ))}
              </ul>
            </PagesNav>

            <PoweredBy href="https://www.citizenlab.co/">
              <span>{poweredBy}</span>
              <CitizenLabLogo name="logo" />
            </PoweredBy>

            <LanguageSelectionWrapper className={this.state.languageOptions.length > 1 ? 'show' : ''}>
              <label htmlFor="e2e-footer-language-switch">
                <HiddenLabel><FormattedMessage {...messages.selectLanguage} /></HiddenLabel>
                <Dropdown id="e2e-footer-language-switch" onChange={this.handleLanguageChange} upward={true} search={true} selection={true} value={locale} options={this.state.languageOptions} />
              </label>
            </LanguageSelectionWrapper>
          </SecondLine>
        </Container>
      );
    }

    return null;
  }
}

const FooterWithInjectedIntl = injectIntl<Props>(Footer);

export default FooterWithInjectedIntl;
