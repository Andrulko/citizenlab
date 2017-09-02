import * as React from 'react';
import * as _ from 'lodash';
import * as Rx from 'rxjs';
import { observeCurrentTenant, ITenantData } from 'services/tenant';
import { watchEvents, watchPageChanges, watchIdentification } from 'utils/analytics/sagas';
import snippet from '@segment/snippet';
import { CL_SEGMENT_API_KEY } from 'containers/App/constants';

interface IEvent {
  name: string;
  properties?: {
    [key: string]: any,
  };
}

interface IPageChange {
  name: string;
  properties?: {
    [key: string]: any,
  };
}

const tenant$ = observeCurrentTenant().observable;
const events$ = new Rx.Subject<IEvent>();
const pageChanges$ = new Rx.Subject<IPageChange>();

Rx.Observable.combineLatest(tenant$, events$).subscribe(([tenant, event]) => {
  (window as any).analytics.track(
    event.name,
    addTenantInfo(event.properties, tenant.data),
  );
});

Rx.Observable.combineLatest(tenant$, pageChanges$).subscribe(([tenant, pageChange]) => {
  (window as any).analytics.page(
    pageChange.name,
    addTenantInfo(pageChange.properties, tenant.data),
  );
});

export function addTenantInfo(properties, tenant: ITenantData) {
  return {
    ...properties,
    tenantId: tenant && tenant.id,
    tenantName: tenant && tenant.attributes.name,
    tenantHost: tenant && tenant.attributes.host,
  };
}

export function trackPage(path: string, properties: {} = {}) {
  pageChanges$.next({
    properties,
    name: path
  });
}

/** HOC that allows specifying events as function props to the inner component
 e.g.:
 const SomeComponent = ({ buttonClicked }) => <button onClick={buttonClicked} />);
 const TrackedComponent = injectTracks(
   {trackButtonClick: {name: 'Button clicked'}}
  )(SomeComponent);
*/
export const injectTracks = <T>(events: {[key: string]: IEvent}) => (component: React.ComponentClass) => {
  return (props) => {
    const eventFunctions = _.mapValues(events, (event) => (
      (extra) => {
        const extraProps = extra && extra.extra;
        events$.next({ name: event.name, properties: { ...event.properties, ...extraProps } });
      }
    ));
    const propsWithEvents = {
      ...eventFunctions,
      ...props,
    };
    return React.createElement(component, propsWithEvents);
  };
};

export const initializeAnalytics = (store) => {
  // Initialize segments window.analytics object
  const contents = snippet.min({
    host: 'cdn.segment.com',
    apiKey: CL_SEGMENT_API_KEY,
  });

  eval(contents);

  store.runSaga(watchEvents);
  store.runSaga(watchPageChanges);
  store.runSaga(watchIdentification);
};
