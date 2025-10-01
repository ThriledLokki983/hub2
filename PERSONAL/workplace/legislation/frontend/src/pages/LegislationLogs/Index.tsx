import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { BackLink, Button, ButtonSet, Footer, IconComponent, Table, TopContent } from 'components';
import useQueryApi from 'hooks/useQueryApi';
import { GET_LEGISLATIONS_BY_ID, LEGISLATION_LOGS } from 'configs/api-endpoints';
import { Legislation, UserProfile } from 'hooks/interfaces';
import { APPROVED_STATE } from 'configs/legislation/legislation';
import { formatLegislationLogsData } from 'configs/auditing/auditing';
import { API_URL } from 'configs/constants';
import styles from './Index.module.scss';

interface Changes {
  new_value: string;
  old_value: string;
  section: string;
}
interface LegislationTableInterface {}

interface LogsInterface {
  action: string;
  changes: Changes[];
  identifier: string;
  timestamp: string;
  user: UserProfile
}

const LegislationLogs = () => {

  const { legislationId } = useParams();
  const [legislationData, setLegislationData] = useState<Legislation | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);


  const { get: getLegislationDetails } = useQueryApi({
    ...GET_LEGISLATIONS_BY_ID,
    endpoint: `${GET_LEGISLATIONS_BY_ID.endpoint}${legislationId}`
  });
  const { get: getLegislationLogs } = useQueryApi({
    ...LEGISLATION_LOGS,
    endpoint: legislationId ? LEGISLATION_LOGS.endpoint.replace('<legislation_id>', legislationId) : '',
  });


  const { data: legData, error: legError, isLoading: isLLoading, refetch } = getLegislationDetails(null) as { data: any, error: any, isLoading: boolean, refetch: () => void };
  const { data: logsData, isLoading } = getLegislationLogs(null);

  /**
   * Set the project logs data
   */
  useEffect(() => {
    if (logsData && !isLoading) {
      setTableData(formatLegislationLogsData(
        logsData.results as LogsInterface[] || []
      ) as LegislationTableInterface[]);
    }
  }, [logsData, isLoading]);


  /**
   * Fetch the legislation details by id.
   * Get the legislation details by id if the legislationId is provided.
   */
  useEffect(() => {
    if (legislationId && !isLLoading && !legError) {
      const { results } = legData;
      setLegislationData(results as Legislation);
    }
  },[legislationId, isLLoading, legError, legData]);


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
          <h3>Logs: {legislationData?.name_generic}</h3>
          <span data-is-published={legislationData?.preparation_state === APPROVED_STATE} data-is-draft={legislationData?.preparation_state !== APPROVED_STATE}>
            <small className={styles.root__pulser}>&nbsp;</small>
            {legislationData?.is_in_effect ? 'In effect' : 'Not in effect'}
          </span>
        </div>
        <div data-text-n-btn>
          <p>Track all modifications made to legislations within the system, ensuring accuracy and compliance.</p>
          <ButtonSet data-btn-set>
            <Button
              variation='primary'
              size="small"
              url={`${API_URL}/auditing/${legislationId}/?download`}
              title={`Download logs for: ${(legislationData)?.name_generic || ''}`}
              onClick={onLogsDownloadHandler}
              data-download-btn
              download
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
      <Footer data-is-admin={true} data-page='legislation' details-page={`${true}`.toString()}/>
    </Fragment>
  )
}

export default LegislationLogs
