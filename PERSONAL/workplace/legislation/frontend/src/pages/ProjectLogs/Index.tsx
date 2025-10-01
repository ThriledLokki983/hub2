import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BackLink, Button, ButtonSet, Table, IconComponent, TopContent, Footer } from 'components';
import useQueryApi from 'hooks/useQueryApi';
import useUserContext from 'contexts/UserContext';
import { PROJECT_LOGS } from 'configs/api-endpoints';
import useProjectData from 'hooks/useProjectData';
import { formatProjectLogsData } from 'configs/auditing/auditing';
import { UserProfile } from 'hooks/interfaces';
import styles from './Index.module.scss';
import { API_URL } from 'configs/constants';

interface Changes {
  new_value: string;
  old_value: string;
  section: string;
}

interface LogsInterface {
  action: string;
  changes: Changes[];
  identifier: string;
  timestamp: string;
  user: UserProfile
}

interface TableInterface {
  date: string;
  section: string;
  updatedBy: string;
  updatedField: string;
  previousValue: string;
  newValue: string;
  action: string;
}

const ProjectLogs = () => {

  const { projectId } = useParams<{ projectId: string }>();

  const [tableData, setTableData] = useState<TableInterface[]>([]);

  const { user } = useUserContext();
  const { projectData } = useProjectData();
  const { get: getProjectLogs } = useQueryApi({
    ...PROJECT_LOGS,
    endpoint: projectId ? PROJECT_LOGS.endpoint.replace('<project_id>', projectId) : '',
  });

  const { data: logsData, isLoading } = getProjectLogs(null);

  /**
   * Set the project logs data
   */
  useEffect(() => {
    if (logsData && !isLoading) {
      setTableData(formatProjectLogsData(
        logsData.results as LogsInterface[] || []
      ) as TableInterface[]);
    }
  }, [logsData, isLoading]);


  /**
   * Download logs handler
   */
  const onLogsDownloadHandler = () => {
    console.log('Yet to be implemented');
  };

  return (
    <Fragment>
      <TopContent isDetails data-details-page>
        <BackLink>Back</BackLink>
        <div data-top-content>
          <h3>{projectData?.name} [Logs]</h3>
          <span data-is-published={projectData?.is_published} data-is-draft={!projectData?.is_published}>
            <small className={styles.root__pulser}>&nbsp;</small>
            {projectData?.is_published ? 'Published' : 'Draft'}
          </span>
        </div>
        <div data-text-n-btn>
          <p>Track all modifications made to your project workspace, ensuring accuracy and compliance.</p>
          <ButtonSet data-btn-set>
            <Button
              variation='primary'
              size="small"
              url={`${API_URL}/auditing/${projectId}/?download`}
              title={`Download logs for: ${(projectData)?.name || ''}`}
              onClick={onLogsDownloadHandler}
              data-download-btn
              download
              // disabled={true}
              >
              <IconComponent name="DownloadOutlineIcon" data-download/>
              Download
            </Button>
          </ButtonSet>
        </div>
      </TopContent>
      <article data-logs-page className={styles.root__article} data-content>
        <Table data={tableData}/>
      </article>
      <Footer data-is-admin={user.is_admin} data-page='legislation' details-page={`${true}`.toString()}/>
    </Fragment>
  );
};

export default ProjectLogs;
