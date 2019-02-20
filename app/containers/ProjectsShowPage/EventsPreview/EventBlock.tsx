import React from 'react';
import moment from 'moment';

// Services
import { IEventData } from 'services/events';

// Components
import T from 'components/T';
import Icon from 'components/UI/Icon';
import Link from 'utils/cl-router/Link';

// Utils
import { getIsoDate } from 'utils/dateUtils';

// Styling
import styled from 'styled-components';
import { colors, fontSizes, media } from 'utils/styleUtils';

const Container = styled(Link)`
  width: calc(100% * (1/2) - 26px);
  margin-left: 13px;
  margin-right: 13px;
  background: white;
  border-radius: 5px;
  display: flex;
  padding: 15px;
  cursor: pointer;
  background: #fff;
  border: solid 1px ${colors.separation};
  transition: all 200ms ease;

  &:hover {
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
    transform: translate(0px, -2px);
  }

  &:not(.last) {
    margin-right: 12px;
  }

  ${media.smallerThanMaxTablet`
    width: 100%;
    margin: 0;
    margin-bottom: 15px;
  `}
`;

const DateWrapper = styled.div`
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-right: 20px;
`;

const Date = styled.div`
  width: 100%;
  color: #fff;;
  font-size: ${fontSizes.base}px;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 5px 5px 0 0;
  background: #DF3300;
`;

const Year = styled.div`
  width: 100%;
  color: #fff;
  font-size: ${fontSizes.base}px;
  font-weight: 300;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 0 0 5px 5px;
  background: #373737;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Time = styled.div`
  color: ${colors.label};
  font-size: ${fontSizes.small}px;
  margin-bottom: 8px;
`;

const Title = styled.div`
  color: #333;
  font-size: ${fontSizes.base}px;
  font-weight: 400;
  line-height: 20px;
  overflow-wrap: break-word;
`;

const Location = styled.div`
  color: ${colors.label};
  font-size: ${fontSizes.small}px;
  display: flex;
  align-items: center;
  display: none;
`;

const StyledIcon = styled(Icon)`
  flex: 0 0 20px;
  height: 20px;
  fill: ${colors.label};
  margin-right: 5px;
`;

interface Props {
  event: IEventData;
  projectSlug: string;
  isLast: boolean;
}

export default (props: Props) => {
  const { projectSlug, event, isLast } = props;
  const startAtMoment = moment(event.attributes.start_at);
  const endAtMoment = moment(event.attributes.end_at);
  const startAtIsoDate = getIsoDate(event.attributes.start_at);
  const endAtIsoDate = getIsoDate(event.attributes.end_at);
  const startAtDay = startAtMoment.format('D');
  const endAtDay = endAtMoment.format('D');
  const startAtMonth = startAtMoment.format('MMM');
  const endAtMonth = endAtMoment.format('MMM');
  const startAtYear = startAtMoment.format('YYYY');
  const isMultiDayEvent = (startAtIsoDate !== endAtIsoDate);
  const dateFormat = (!isMultiDayEvent ? 'LT' : 'D MMM LT');
  const startAt = moment(event.attributes.start_at).format(dateFormat);
  const endAt = moment(event.attributes.end_at).format(dateFormat);

  return (
    <Container className={`${props['className']} ${isLast && 'last'}`} to={`/projects/${projectSlug}/events`}>
      <DateWrapper>
        <Date>
          <span>{startAtDay}</span>
          <span>{startAtMonth}</span>

          {isMultiDayEvent &&
            <>
              <span>-</span>
              <span>{endAtDay}</span>
              <span>{endAtMonth}</span>
            </>
          }
        </Date>
        <Year>
          {startAtYear}
        </Year>
      </DateWrapper>

      <TextBlock>
        <Time>{startAt} - {endAt}</Time>
        <Title>
          <T value={event.attributes.title_multiloc} />
        </Title>
        <Location>
          <StyledIcon name="mapmarker" />
          <T value={event.attributes.location_multiloc} />
        </Location>
      </TextBlock>
    </Container>
  );
};
