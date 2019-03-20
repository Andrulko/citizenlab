import '@babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
// tslint:disable-next-line:no-vanilla-routing
import { applyRouterMiddleware, Router, browserHistory } from 'react-router';
import { useScroll } from 'react-router-scroll';
import 'utils/lazyImagesObserver';
// Import CSS reset and Global Styles
import 'assets/css/reset.min.css';
import './global-styles';
import App from 'containers/App';
import LanguageProvider from 'containers/LanguageProvider';
import { init, Integrations } from '@sentry/browser';

// Load the .htaccess file
import 'file-loader?name=[name].[ext]!./.htaccess';

// Import root routes
import createRoutes from './routes';

import { initializeAnalytics } from 'utils/analytics';

if (process && process.env && process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    release: process.env.CIRCLE_BUILD_NUM,
    integrations: [new Integrations.RewriteFrames()]
  });
}

initializeAnalytics();

const rootRoute = {
  component: App,
  childRoutes: createRoutes(),
};

const Root = () => {
  return (
    <LanguageProvider>
      <Router
        history={browserHistory}
        routes={rootRoute}
        render={applyRouterMiddleware(useScroll())}
      />
    </LanguageProvider>
  );
};

render(<Root />, document.getElementById('app'));
