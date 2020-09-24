import React, { memo, useState, useEffect } from 'react';
import { adopt } from 'react-adopt';
import useLocalize from 'hooks/useLocalize';
import { isNilOrError } from 'utils/helperUtils';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'utils/cl-intl';
import { InjectedIntlProps } from 'react-intl';
import styled, { useTheme } from 'styled-components';

// libs
import { map } from 'lodash-es';

// resources
import messages from './messages';
import { IResolution, GraphsContainer, chartTheme } from '..';
import GetIdeas, { GetIdeasChildProps } from 'resources/GetIdeas';
import GetPhases, { GetPhasesChildProps } from 'resources/GetPhases';
import {
  usersByTimeCumulativeXlsxEndpoint,
  usersByTimeCumulativeStream,
  usersByTimeStream,
  ideasByTimeCumulativeXlsxEndpoint,
  ideasByTimeCumulativeStream,
  ideasByTimeStream,
  commentsByTimeCumulativeXlsxEndpoint,
  commentsByTimeCumulativeStream,
  commentsByTimeStream,
  ideasByStatusXlsxEndpoint,
  ideasByStatusStream,
  IIdeasByStatus,
} from 'services/stats';

// services
import { ParticipationMethod } from 'services/participationContexts';
import { IProjectData } from 'services/projects';

// components
import ResolutionControl from '../components/ResolutionControl';
import LineBarChart from '../summary/charts/LineBarChart';
import LineBarChartVotesByTime from '../summary/charts/LineBarChartVotesByTime';
import HorizontalBarChart from '../users/charts/HorizontalBarChart';
import HorizontalBarChartWithoutStream from '../users/charts/HorizontalBarChartWithoutStream';
import ExportMenu from '../components/ExportMenu';
import { SectionTitle, PageTitle } from 'components/admin/Section';

interface InputProps {
  project: IProjectData;
}
interface DataProps {
  phases: GetPhasesChildProps;
  mostVotedIdeas: GetIdeasChildProps;
}

const Section = styled.div`
  margin-bottom: 20px;
`;

const RowSection = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 20px;
`;

interface Props extends InputProps, DataProps {}

const ProjectReport = memo(
  ({
    project,
    phases,
    mostVotedIdeas,
    intl: { formatMessage },
  }: Props & InjectedIntlProps) => {
    const localize = useLocalize();
    const theme: any = useTheme();

    const isTimelineProject = project.attributes.process_type === 'timeline';

    // set time boundaries
    const [resolution, setResolution] = useState<IResolution>('month');
    const [startAt, setStartAt] = useState<string | null>(null);
    const [endAt, setEndAt] = useState<string | null>(null);

    useEffect(() => {
      if (isTimelineProject && !isNilOrError(phases) && phases.length > 0) {
        const startAt = phases[0].attributes.start_at;
        const endAt = phases[phases.length - 1].attributes.end_at;
        setStartAt(startAt);
        setEndAt(endAt);

        const timeDiff = moment.duration(moment(endAt).diff(moment(startAt)));
        setResolution(
          timeDiff
            ? timeDiff.asMonths() > 6
              ? 'month'
              : timeDiff.asWeeks() > 4
              ? 'week'
              : 'day'
            : 'month'
        );
      } else {
        const startAt = project.attributes.created_at;
        setStartAt(startAt);
        setEndAt(moment().toISOString());

        const timeDiff = moment.duration(moment().diff(moment(startAt)));
        setResolution(
          timeDiff
            ? timeDiff.asMonths() > 6
              ? 'month'
              : timeDiff.asWeeks() > 4
              ? 'week'
              : 'day'
            : 'month'
        );
      }
    }, [project, phases]);

    const { fontSizes } = theme;
    // deduplicated non-null participations methods in this project
    const participationMethods = (isTimelineProject
      ? isNilOrError(phases)
        ? []
        : phases.map((phase) => phase.attributes.participation_method)
      : [project.attributes.participation_method]
    ).filter(
      (el, i, arr) => el && arr.indexOf(el) === i
    ) as ParticipationMethod[];

    if (!startAt || !endAt) {
      return null;
    }

    const projectTitle = localize(project.attributes.title_multiloc);

    const fiveMostVotedIdeasSerie = () => {
      if (!isNilOrError(mostVotedIdeas.list)) {
        const { list } = mostVotedIdeas;
        const serie = list.map((idea) => {
          return {
            code: idea.id,
            value:
              idea.attributes.upvotes_count + idea.attributes.downvotes_count,
            up: idea.attributes.upvotes_count,
            down: idea.attributes.downvotes_count,
            name: localize(idea.attributes.title_multiloc),
            slug: idea.attributes.slug,
          };
        });
        return serie;
      }
      return null;
    };

    const convertIdeasByStatusToGraphFormat = (
      ideasByStatus: IIdeasByStatus
    ) => {
      const {
        series: { ideas },
        idea_status,
      } = ideasByStatus;

      if (isNilOrError(ideasByStatus) || Object.keys(ideas).length <= 0) {
        return null;
      }

      const ideasByStatusConvertedToGraphFormat = map(
        ideas,
        (value: number, key: string) => ({
          value: value as number,
          name: localize(idea_status[key].title_multiloc) as string,
          code: key,
          color: idea_status[key].color as string,
          ordering: idea_status[key].ordering as number,
        })
      );

      return ideasByStatusConvertedToGraphFormat;
    };

    return (
      <>
        <RowSection>
          <PageTitle>{projectTitle}</PageTitle>
          <ResolutionControl value={resolution} onChange={setResolution} />
        </RowSection>
        <Section>
          <SectionTitle>
            Project Type :{' '}
            {isTimelineProject ? 'Timeline Project' : 'Continous'}
          </SectionTitle>
        </Section>
        {isTimelineProject && !isNilOrError(phases) && phases.length > 0 ? (
          <RowSection>
            {phases.map((phase, index) => {
              return (
                <Section key={index}>
                  <p>
                    from {phase.attributes.start_at} to{' '}
                    {phase.attributes.end_at}
                  </p>
                  <div>{phase.attributes.participation_method}</div>
                  <div>{localize(phase.attributes.title_multiloc)}</div>
                </Section>
              );
            })}
          </RowSection>
        ) : (
          <Section>"No configured phase"</Section>
        )}

        <Section>
          <SectionTitle>
            <FormattedMessage {...messages.sectionWho} />
          </SectionTitle>
          <GraphsContainer>
            {participationMethods !== ['information'] && (
              <LineBarChart
                graphTitle={formatMessage(messages.participantsOverTimeTitle)}
                xlsxEndpoint={usersByTimeCumulativeXlsxEndpoint}
                graphUnit="users"
                graphUnitMessageKey="users"
                startAt={startAt}
                endAt={endAt}
                barStream={usersByTimeStream}
                lineStream={usersByTimeCumulativeStream}
                resolution={resolution}
                currentProjectFilter={project.id}
                currentProjectFilterLabel={projectTitle}
              />
            )}
          </GraphsContainer>
        </Section>
        <Section>
          <SectionTitle>
            <FormattedMessage {...messages.sectionWhat} />
          </SectionTitle>
          <GraphsContainer>
            {participationMethods.includes('ideation') && (
              <>
                <LineBarChart
                  graphTitle={formatMessage(messages.ideasByTimeTitle)}
                  graphUnit="ideas"
                  graphUnitMessageKey="ideas"
                  startAt={startAt}
                  endAt={endAt}
                  resolution={resolution}
                  currentProjectFilter={project.id}
                  currentProjectFilterLabel={projectTitle}
                  xlsxEndpoint={ideasByTimeCumulativeXlsxEndpoint}
                  className="e2e-ideas-chart"
                  lineStream={ideasByTimeCumulativeStream}
                  barStream={ideasByTimeStream}
                />
                <LineBarChart
                  graphTitle={formatMessage(messages.commentsByTimeTitle)}
                  graphUnit="comments"
                  graphUnitMessageKey="comments"
                  startAt={startAt}
                  endAt={endAt}
                  resolution={resolution}
                  currentProjectFilter={project.id}
                  currentProjectFilterLabel={projectTitle}
                  xlsxEndpoint={commentsByTimeCumulativeXlsxEndpoint}
                  className="e2e-comments-chart"
                  lineStream={commentsByTimeCumulativeStream}
                  barStream={commentsByTimeStream}
                />
                <LineBarChartVotesByTime
                  className="e2e-votes-chart"
                  startAt={startAt}
                  endAt={endAt}
                  resolution={resolution}
                  currentProjectFilter={project.id}
                  currentProjectFilterLabel={projectTitle}
                />

                <HorizontalBarChart
                  graphTitleString={formatMessage(messages.ideasByStatusTitle)}
                  graphUnit="ideas"
                  stream={ideasByStatusStream}
                  convertToGraphFormat={convertIdeasByStatusToGraphFormat}
                  className="dynamicHeight"
                  startAt={startAt}
                  endAt={endAt}
                  exportMenu={
                    <ExportMenu
                      name={formatMessage(messages.ideasByStatusTitle)}
                      startAt={startAt}
                      endAt={endAt}
                      xlsxEndpoint={ideasByStatusXlsxEndpoint}
                    />
                  }
                />
                <HorizontalBarChartWithoutStream
                  serie={fiveMostVotedIdeasSerie()}
                  graphTitleString={formatMessage(
                    messages.fiveIdeasWithMostVotes
                  )}
                  graphUnit="votes"
                  className="dynamicHeight"
                  exportMenu={
                    <ExportMenu
                      name={formatMessage(messages.fiveIdeasWithMostVotes)}
                      startAt={startAt}
                      endAt={endAt}
                      xlsxEndpoint={ideasByStatusXlsxEndpoint}
                    />
                  }
                />
              </>
            )}
          </GraphsContainer>
        </Section>
      </>
    );
  }
);

const ProjectReportWithHoc = injectIntl(ProjectReport);

const Data = adopt<DataProps, InputProps>({
  phases: ({ project, render }) => (
    <GetPhases projectId={project.id}>{render}</GetPhases>
  ),
  mostVotedIdeas: ({ project, render }) => (
    <GetIdeas
      pageNumber={1}
      pageSize={5}
      sort="popular"
      type="paginated"
      projectIds={[project.id]}
    >
      {render}
    </GetIdeas>
  ),
});

export default (inputProps: InputProps) => (
  <Data {...inputProps}>
    {(dataProps) => <ProjectReportWithHoc {...inputProps} {...dataProps} />}
  </Data>
);
