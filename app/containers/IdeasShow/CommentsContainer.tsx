import * as React from 'react';
import * as _ from 'lodash';
import * as Rx from 'rxjs/Rx';

// components
import ParentComment from './ParentComment';
import ParentCommentForm from './ParentCommentForm';
import Icon from 'components/UI/Icon';

// services
import { commentsForIdeaStream, commentStream, IComments, IComment } from 'services/comments';

// i18n
import { FormattedMessage } from 'react-intl';
import messages from './messages';

// style
import styled from 'styled-components';

const animationDuration = 500;
const animationEasing = `cubic-bezier(0.19, 1, 0.22, 1)`;

const Container = styled.div`
  margin-bottom: 0px;
`;

const Title = styled.h2`
  color: #444;
  font-size: 25px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  margin-bottom: 30px;
`;

const ParentCommentsContainer = styled.div`
  margin-top: 50px;
`;

/*
const ParentCommentSeparator = styled.div`
  width: 100%;
  height: 1px;
  background: #e4e4e4;
  margin-top: 60px;
  margin-bottom: 60px;
`;
*/

type Props = {
  ideaId: string;
};

type State = {
  parentComments: IComments | null;
  loading: boolean;
  newCommentId: string | null;
};

export default class CommentsContainer extends React.PureComponent<Props, State> {
  state: State;
  subscriptions: Rx.Subscription[];

  constructor() {
    super();
    this.state = {
      parentComments: null,
      loading: true,
      newCommentId: null
    };
    this.subscriptions = [];
  }

  componentWillMount() {
    const { ideaId } = this.props;
    const parentComments$ = commentsForIdeaStream(ideaId).observable.switchMap((comments) => {
      if (comments && comments.data && comments.data.length > 0) {
        const parentComments: IComments = {
          data: comments.data.filter(comment => comment.relationships.parent.data === null)
        };

        if (parentComments.data.length > 0) {
          return Rx.Observable.combineLatest(
            comments.data.map(comments => commentStream(comments.id).observable)
          ).map(() => parentComments);
        } else {
          return Rx.Observable.combineLatest(
            comments.data.map(comments => commentStream(comments.id).observable)
          ).map(() => null);
        }
      }

      return Rx.Observable.of(null);
    });

    this.subscriptions = [
      parentComments$.subscribe((parentComments) => {
        let sortedParentComments: IComments | null = null;
        let newCommentId: string | null = null;

        if (parentComments && parentComments.data && parentComments.data.length > 0) {
          sortedParentComments = {
            ...parentComments,
            data: parentComments.data.reverse()
          };
        }

        if (this.state.parentComments === null && sortedParentComments !== null && sortedParentComments.data.length === 1 
          || this.state.parentComments !== null && sortedParentComments !== null && this.state.parentComments.data.length === sortedParentComments.data.length - 1) {
            newCommentId = sortedParentComments.data[0].id;
        }

        this.setState({
          newCommentId,
          parentComments: sortedParentComments,
          loading: false
        });
      })
    ];
  }

  componentWillUnmount() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  render() {
    const className = `${this.props['className']} e2e-comments`;
    const { ideaId } = this.props;
    const { parentComments, loading, newCommentId } = this.state;

    if (!loading) {
      let parentCommentsList: JSX.Element[] | null = null;

      if (parentComments && parentComments.data && parentComments.data.length > 0) {
        parentCommentsList = parentComments.data.map((comment) => (
          <ParentComment
            key={comment.id}
            ideaId={ideaId}
            commentId={comment.id}
            animate={newCommentId === comment.id ? true : undefined}
          />
        ));
      }

      return (
        <Container className={className}>
          <Title>
            <Icon name="comment outline" />
            <FormattedMessage {...messages.commentsTitle} />
          </Title>

          <ParentCommentForm ideaId={ideaId} />

          <ParentCommentsContainer>
            {parentCommentsList}
          </ParentCommentsContainer>
        </Container>
      );
    }

    return null;
  }
}
