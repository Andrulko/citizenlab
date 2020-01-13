import React from 'react';
import { adopt } from 'react-adopt';
import { isNilOrError } from 'utils/helperUtils';

import styled from 'styled-components';
import { fontSizes, colors } from 'utils/styleUtils';

import { trackEventByName } from 'utils/analytics';
import tracks from '../../tracks';

import NotificationCount from './components/NotificationCount';
import Dropdown from 'components/UI/Dropdown';
import Notification from './components/Notification';
import Spinner from 'components/UI/Spinner';
import InfiniteScroll from 'react-infinite-scroller';

import messages from './messages';
import { FormattedMessage } from 'utils/cl-intl';

import { markAllAsRead } from 'services/notifications';
import GetNotifications, { GetNotificationsChildProps } from 'resources/GetNotifications';
import GetAuthUser, { GetAuthUserChildProps } from 'resources/GetAuthUser';

// illustrations
import EmptyStateImg from './assets/no_notification_image.svg';

const Container = styled.div`
  position: relative;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EmptyStateContainer = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
`;

const EmptyStateImageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const EmptyStateImage = styled.img`
  margin-bottom: 20px;
`;

const EmptyStateText = styled.div`
  color: ${colors.label};
  font-size: ${fontSizes.base}px;
  line-height: normal;
  text-align: center;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  margin-left: 15px;
  margin-right: 15px;
`;

interface InputProps {}

interface DataProps {
  notifications: GetNotificationsChildProps;
  authUser: GetAuthUserChildProps;
}

interface Props extends InputProps, DataProps {}

interface State {
  dropdownOpened: boolean;
}

export class NotificationMenu extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpened: false,
    };
  }

  toggleDropdown = (event: React.FormEvent<any>) => {
    event.preventDefault();

    this.setState(({ dropdownOpened }) => {
      if (!dropdownOpened) {
        trackEventByName(tracks.clickOpenNotifications.name);
      } else {
        markAllAsRead();
        trackEventByName(tracks.clickCloseNotifications.name);
      }

      return { dropdownOpened: !dropdownOpened };
    });
  }

  renderList = () => {
    const { notifications: { list } } = this.props;
    if (isNilOrError(list) || list.length === 0) return [];
    return list.map((notification) => {
      return (
        <Notification
          notification={notification}
          key={notification.id}
        />
      );
    });
  }

  render() {
    const { dropdownOpened } = this.state;
    const { notifications, authUser } = this.props;
    const notificationsList = this.renderList();

    if (!isNilOrError(authUser)) {
      return (
        <Container>
          <NotificationCount
            count={authUser.attributes.unread_notifications}
            onClick={this.toggleDropdown}
            dropdownOpened={dropdownOpened}
          />
          <Dropdown
            width="300px"
            mobileWidth="220px"
            top="42px"
            right="-5px"
            mobileRight="-15px"
            opened={dropdownOpened}
            onClickOutside={this.toggleDropdown}
            content={
              <InfiniteScroll
                pageStart={0}
                loadMore={notifications.onLoadMore}
                useWindow={false}
                hasMore={notifications.hasMore}
                threshold={50}
                loader={
                  <LoadingContainer key="0">
                    <Spinner />
                  </LoadingContainer>
                }
              >
                {notificationsList}
                {notifications.list !== undefined && notificationsList && notificationsList.length === 0 &&
                  <EmptyStateContainer>
                    <EmptyStateImageWrapper>
                      <EmptyStateImage src={EmptyStateImg} role="presentation" alt="" />
                    </EmptyStateImageWrapper>
                    <EmptyStateText>
                      <FormattedMessage {...messages.noNotifications} />
                    </EmptyStateText>
                  </EmptyStateContainer>
                }
              </InfiniteScroll>
            }
          />
        </Container>
      );
    }

    return null;
  }
}

const Data = adopt<DataProps, InputProps>({
  notifications: <GetNotifications />,
  authUser: <GetAuthUser />
});

export default (inputProps: InputProps) => (
  <Data>
    {dataProps => <NotificationMenu {...inputProps} {...dataProps} />}
  </Data>
);
