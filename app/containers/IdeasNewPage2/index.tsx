import * as React from 'react';
import * as _ from 'lodash';
import * as Rx from 'rxjs/Rx';

// libraries
import CSSTransition from 'react-transition-group/CSSTransition';
import Transition from 'react-transition-group/Transition';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { browserHistory } from 'react-router';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { ImageFile } from 'react-dropzone';

// components
import Upload from 'components/UI/Upload';
import ButtonBar from './ButtonBar';
import NewIdeaForm from './NewIdeaForm';
import SignInUp from './SignInUp';

// services
import { localeStream } from 'services/locale';
import { addIdea, updateIdea } from 'services/ideas';
import { addIdeaImage, deleteIdeaImage } from 'services/ideaImages';
import { getAuthUserAsync } from 'services/auth';
import { localState, ILocalStateService } from 'services/localState';
import { globalState, IGlobalStateService, IIdeasNewPageGlobalState } from 'services/globalState';

// utils
import { getBase64 } from 'utils/imageTools';

// i18n
import { injectIntl, InjectedIntlProps } from 'react-intl';
import messages from './messages';

// typings
import { IOption } from 'typings';

// style
import { media } from 'utils/styleUtils';
import styled from 'styled-components';

const Container = styled.div`
  background: #f8f8f8;
`;

const PageContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 105px);
  position: relative;
  background: #f8f8f8;
  -webkit-backface-visibility: hidden;
  will-change: opacity, transform;

  &.page-enter {
    position: absolute;
    opacity: 0.01;
    transform: translateX(100vw);

    ${media.biggerThanMaxTablet`
      transform: translateX(800px);
    `}

    &.ideaForm {
      transform: translateX(-100vw);

      ${media.biggerThanMaxTablet`
        transform: translateX(-800px);
      `}
    }

    &.page-enter-active {
      opacity: 1;
      transform: translateX(0);
      transition: transform 600ms cubic-bezier(0.19, 1, 0.22, 1),
                  opacity 600ms cubic-bezier(0.19, 1, 0.22, 1);
    }
  }

  &.page-exit {
    opacity: 1;
    transform: translateX(0);

    &.page-exit-active {
      opacity: 0.01;
      transform: translateX(100vw);
      transition: transform 600ms cubic-bezier(0.19, 1, 0.22, 1),
                  opacity 600ms cubic-bezier(0.19, 1, 0.22, 1);

      ${media.biggerThanMaxTablet`
        transform: translateX(800px);
      `}

      &.ideaForm {
        transform: translateX(-100vw);

        ${media.biggerThanMaxTablet`
          transform: translateX(-800px);
        `}
      }
    }
  }
`;

const ButtonBarContainer = styled.div`
  width: 100%;
  height: 68px;
  position: fixed;
  z-index: 99999;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: solid 1px #ddd;
  -webkit-backface-visibility: hidden;
  will-change: auto;

  ${media.smallerThanMaxTablet`
    display: none;
  `}

  &.buttonbar-enter {
    transform: translateY(64px);
    will-change: transform;

    &.buttonbar-enter-active {
      transform: translateY(0);
      transition: transform 600ms cubic-bezier(0.165, 0.84, 0.44, 1);
    }
  }

  &.buttonbar-exit {
    transform: translateY(0);
    will-change: transform;

    &.buttonbar-exit-active {
      transform: translateY(64px);
      transition: transform 600ms cubic-bezier(0.165, 0.84, 0.44, 1);
    }
  }
`;

interface Props {}

interface LocalState {
  showIdeaForm: boolean;
  locale: string | null;
}

interface GlobalState {}

interface State extends LocalState, GlobalState {}

class IdeasNewPage2 extends React.PureComponent<Props & InjectedIntlProps, State> {
  localState: ILocalStateService<LocalState>;
  globalState: IGlobalStateService<IIdeasNewPageGlobalState>;
  subscriptions: Rx.Subscription[];

  constructor() {
    super();
    this.state = null as any;
    this.localState = localState<LocalState>({
      showIdeaForm: true,
      locale: null
    });
    this.globalState = globalState.init<IIdeasNewPageGlobalState>('IdeasNewPage', {
      title: null,
      description: EditorState.createEmpty(),
      selectedTopics: null,
      selectedProject: null,
      location: null,
      images: null,
      titleError: null,
      descriptionError: null,
      submitError: false,
      processing: false,
      ideaId: null,
      imageId: null,
      imageChanged: false
    });
    this.subscriptions = [];
  }

  componentWillMount() {
    const localState$ = this.localState.observable;
    const locale$ = localeStream().observable;

    this.subscriptions = [
      localState$.subscribe(({ showIdeaForm, locale }) => {
        const newState: State = { showIdeaForm, locale };
        this.setState(newState);
      }),
      locale$.subscribe(locale => this.localState.set({ locale }))
    ];
  }

  componentWillUnmount() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  async convertToGeoJson(location: string) {
    const results = await geocodeByAddress(location);
    const { lat, lng } = await getLatLng(results[0]);
    return {
      type: 'Point',
      coordinates: [lat as number, lng as number]
    };
  }

  async postIdea(locale: string, ideasNewPageState: IIdeasNewPageGlobalState, publicationStatus: 'draft' | 'published', authorId: string | null = null) {
    const { title, description, selectedTopics, selectedProject, location, ideaId } = ideasNewPageState;
    const ideaTitle = { [locale]: title as string };
    const ideaDescription = { [locale]: draftToHtml(convertToRaw(description.getCurrentContent())) };
    const topicIds = (selectedTopics ? selectedTopics.map(topic => topic.value) : null);
    const projectId = (selectedProject ? selectedProject.value as string : null);
    const locationGeoJSON = (_.isString(location) && !_.isEmpty(location) ? await this.convertToGeoJson(location) : null);
    const locationDescription = (_.isString(location) && !_.isEmpty(location) ? location : null);

    if (ideaId) {
      return await updateIdea(ideaId, {
        author_id: authorId,
        title_multiloc: ideaTitle,
        body_multiloc: ideaDescription,
        topic_ids: topicIds,
        project_id: projectId,
        location_point_geojson: locationGeoJSON,
        location_description: locationDescription
      });
    }

    return await addIdea(
      authorId,
      publicationStatus,
      ideaTitle,
      ideaDescription,
      topicIds,
      projectId,
      locationGeoJSON,
      locationDescription
    );
  }

  async postIdeaImage(ideaId: string, image: ImageFile) {
    try {
      const base64Image = await getBase64(image);
      return await addIdeaImage(ideaId, base64Image, 0);
    } catch (error) {
      return error;
    }
  }

  async postIdeaAndIdeaImage(locale: string, publicationStatus: 'draft' | 'published', authorId: string | null = null) {
    try {
      const promises: Promise<any>[] = [];
      const globalState = await this.globalState.get();
      const { images, imageId, imageChanged } = globalState;
      const idea = await this.postIdea(locale, globalState, publicationStatus);

      if (imageId && imageChanged) {
        promises.push(deleteIdeaImage(idea.data.id, imageId));
      }

      if (images && images.length > 0 && imageChanged) {
        promises.push(this.postIdeaImage(idea.data.id, images[0]));
      }

      if (promises && promises.length > 0) {
        const response = await Promise.all(promises);
      }

      this.globalState.set({ ideaId: idea.data.id, imageChanged: false });

      return idea;
    } catch (error) {
      throw 'error';
    }
  }

  handleOnIdeaSubmit = (locale: string) => async () => {
    this.globalState.set({ submitError: false, processing: true });

    try {
      const authUser = await getAuthUserAsync();
      const idea = await this.postIdeaAndIdeaImage(locale, 'published', authUser.data.id);
      browserHistory.push('/ideas');
    } catch (error) {
      if (_.isError(error) && error.message === 'not_authenticated') {
        try {
          const idea = await this.postIdeaAndIdeaImage(locale, 'draft');
          this.globalState.set({ processing: false });
          this.localState.set({ showIdeaForm: false });
          window.scrollTo(0, 0);
        } catch (error) {
          this.globalState.set({ submitError: true });
        }
      } else {
        this.globalState.set({ submitError: true });
      }
    }
  }

  handleOnSignInUpGoBack = () => {
    this.localState.set({ showIdeaForm: true });
  }

  handleOnSignInUpCompleted = async (userId: string) => {
    const { ideaId } = await this.globalState.get();

    if (ideaId) {
      await updateIdea(ideaId, { author_id: userId, publication_status: 'published' });
      browserHistory.push('/ideas');
    }
  }

  render() {
    if (!this.state) { return null; }

    const { showIdeaForm, locale } = this.state;
    const { intl } = this.props;
    const timeout = 600;

    const buttonBar = (showIdeaForm && locale) ? (
      <CSSTransition classNames="buttonbar" timeout={timeout}>
        <ButtonBarContainer>
          <ButtonBar onSubmit={this.handleOnIdeaSubmit(locale)} />
        </ButtonBarContainer>
      </CSSTransition>
    ) : null;

    const newIdeasForm = (showIdeaForm && locale) ? (
      <CSSTransition classNames="page" timeout={timeout}>
        <PageContainer className="ideaForm">
          <NewIdeaForm onSubmit={this.handleOnIdeaSubmit(locale)} />
        </PageContainer>
      </CSSTransition>
    ) : null;

    const signInUp = (!showIdeaForm && locale) ? (
      <CSSTransition classNames="page" timeout={timeout}>
        <PageContainer>
          <SignInUp
            onGoBack={this.handleOnSignInUpGoBack}
            onSignInUpCompleted={this.handleOnSignInUpCompleted}
          />
        </PageContainer>
      </CSSTransition>
    ) : null;

    return (
      <Container>
        <TransitionGroup>
          {buttonBar}
          {newIdeasForm}
          {signInUp}
        </TransitionGroup>
      </Container>
    );
  }
}

export default injectIntl<Props>(IdeasNewPage2);
