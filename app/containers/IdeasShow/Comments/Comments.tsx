import React, { PureComponent } from 'react';
import { isNilOrError } from 'utils/helperUtils';

// components
import ParentComment from './ParentComment';
import CommentSorting from './CommentSorting';

// resources
import GetComments, { GetCommentsChildProps } from 'resources/GetComments';

// style
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 30px;
`;

const StyledCommentSorting = styled(CommentSorting)`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
`;

interface InputProps {
  ideaId: string;
  className?: string;
}

interface DataProps {
  comments: GetCommentsChildProps;
}

interface Props extends InputProps, DataProps {}

interface State {}

class Comments extends PureComponent<Props, State> {
  handleSortOnChange = (sort: string) => {
    console.log(sort);
    // this.props.ideas.onChangeSorting(sort);
  }

  render() {
    const { ideaId, comments, className } = this.props;

    if (!isNilOrError(comments) && comments.length > 0) {
      const parentComments = comments.filter((comment) => {
        return comment.relationships.parent.data === null;
      }).sort((commentA, commentB) => {
        return new Date(commentA.attributes.created_at).getTime() - new Date(commentB.attributes.created_at).getTime();
      });

      if (parentComments && parentComments.length > 0) {
        return (
          <Container className={`e2e-comments-container ${className}`}>
            <StyledCommentSorting onChange={this.handleSortOnChange} />

            {parentComments.map((parentComment, _index) => {
              const childCommentIds = (!isNilOrError(comments) && comments.filter((comment) => {
                if (comment.relationships.parent.data &&
                    comment.relationships.parent.data.id === parentComment.id &&
                    comment.attributes.publication_status !== 'deleted'
                ) {
                  return true;
                }

                return false;
              }).map(comment => comment.id));

              return (
                <ParentComment
                  key={parentComment.id}
                  ideaId={ideaId}
                  commentId={parentComment.id}
                  childCommentIds={childCommentIds}
                />
              );
            })}
          </Container>
        );
      }
    }

    return null;
  }
}

export default (inputProps: InputProps) => (
  <GetComments ideaId={inputProps.ideaId}>
    {comments => <Comments {...inputProps} comments={comments} />}
  </GetComments>
);
