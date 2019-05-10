import React, { memo } from 'react';

// i18n
import { FormattedMessage } from 'utils/cl-intl';
import messages from './messages';

// style
import styled from 'styled-components';
import { fontSizes, colors, media } from 'utils/styleUtils';
import Illustration from './Illustration';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  flex-shrink: 0;
  width: 100%;
  color: ${colors.text};
  font-size: ${fontSizes.xxxxl}px;
  line-height: 40px;
  font-weight: 500;
  text-align: center;
  margin: 0;
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 0;

  ${media.smallerThanMaxTablet`
    max-width: auto;
    font-size: ${fontSizes.xxxl}px;
    line-height: 36px;
  `}
`;

const Subtitle = styled.h3`
  flex-shrink: 0;
  width: 100%;
  max-width: 500px;
  color: ${colors.text};
  font-size: ${fontSizes.large}px;
  line-height: 25px;
  font-weight: 300;
  text-align: center;
  margin: 0;
  margin-top: 10px;
  margin-bottom: 35px;
  padding: 0;

  ${media.smallerThanMaxTablet`
    font-size: ${fontSizes.base}px;
    line-height: 21px;
    margin-bottom: 20px;
  `}
`;

interface InputProps {
  userActuallyDeleted: boolean;
}

interface DataProps {
}

interface Props extends InputProps, DataProps {}

export default memo(({ userActuallyDeleted }: Props) => userActuallyDeleted ? (
  <Container>
    <Illustration />
    <Title className="e2e-user-deleted-success-modal-content">
      <FormattedMessage {...messages.userDeletedTitle} />
    </Title>
    <Subtitle>
      <FormattedMessage {...messages.userDeletedSubtitle} />
    </Subtitle>
  </Container>
) : (
  <FormattedMessage {...messages.userDeletionFailed} />
));
