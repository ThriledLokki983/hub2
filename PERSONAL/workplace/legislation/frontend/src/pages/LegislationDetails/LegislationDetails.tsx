import { Fragment, useMemo, useState, useEffect, useRef } from 'react';
import { useParams, useOutletContext, useNavigate  } from 'react-router-dom';
import  { formatRoleSpecificData } from 'helpers/legislations/legislation';

import {
  TopContent, BackLink, Button,
  Modal, Footer, ButtonSet, IconComponent, Tabs,
} from 'components';
import EditLegislation from 'pages/Legislation/Admin/EditContent/EditLegislation';
import { useAppStateContext, useLegislationContext } from 'contexts';
import { withLegislationHocs } from 'contexts/LegislationContext';

import { useQueryApi } from 'hooks';
import { GET_LEGISLATION_JOB_ROLE, GET_LEGISLATIONS_BY_ID } from 'configs/api-endpoints';
import {
  JOB_ROLE_KEY, SELECT_ALL_FILTER_KEY,
  FILTER_TABS, DESCRIPTION, LEGISLATION_DETAILS_EDIT_MODAL_ID,
} from 'configs/legislation/legislation';
import { RolesTab, DetailsTab, ContactsTab } from './Tabs';
import { OutletContextProps } from '../Legislation/interfaces';
import { PATH_LEGISLATION, PATH_LEGISLATION_ALL } from 'configs/paths';
import { updateUrlWithIndex } from 'helpers/projects/projects';
import Loading from 'pages/Loading/Loading';
import { Legislation } from 'hooks/interfaces';
import { FilterOption } from 'hooks/interfaces/legislation.interface';
import styles from './LegislationDetails.module.scss';


const LegislationDetails = () => {

  const { legislationId, tabIndex } = useParams();
  const tabRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const { user } = useOutletContext<OutletContextProps>();
  const { showToast } = useAppStateContext();
  const { state, stateDispatch: dispatch, stateActions } = useLegislationContext();

  // State data
  const [jobRoleData, setJobRoleData] = useState<any>([]);
  const [selectedIndex, setSelectedIndex] = useState(Number(tabIndex));
  const [selectedNavIndex, setSelectedNavIndex] = useState('');
  const [currentLegislation, setCurrentLegislation] = useState<Legislation>();
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const isFirstTab = FILTER_TABS?.at(0)?.id === selectedIndex;
  const isLastTab = FILTER_TABS?.at(-1)?.id === selectedIndex;

  // Get the legislation job role
  const { get: getLegislationJobRole } = useQueryApi({
    ...GET_LEGISLATION_JOB_ROLE,
    endpoint: `${GET_LEGISLATION_JOB_ROLE.endpoint}${legislationId}/attention-points/`,
  });
  const { get: getLegislationDetails } = useQueryApi({
    ...GET_LEGISLATIONS_BY_ID,
    endpoint: `${GET_LEGISLATIONS_BY_ID.endpoint}${legislationId}`
  });

  const { data: jobRoleResponse, error: jobRoleError, isLoading: isjRLoading } = getLegislationJobRole(null);
  const { data: legData, error: legError, isLoading: isLLoading, refetch: refetchLegislationDetails } = getLegislationDetails(null) as { data: any, error: any, isLoading: boolean, refetch: () => void };

  // Get the job roles
  const jobRoles = useMemo(
    () => state
      .filters
      .find((f) => f.label === JOB_ROLE_KEY)
      ?.data.map((d) => ({
        ...d,
        data: jobRoleData?.find((role: any) => role.name.toLowerCase() === d.name.toLowerCase())
      })) || [],
    [jobRoleData, state.filters]
  );


  /**
   * Fetch the legislation details by id.
   * Get the legislation details by id if the legislationId is provided.
   */
  useEffect(() => {
    if (legislationId && !isLLoading && !legError && drawerIsOpen) {
      const { results } = legData;
      setCurrentLegislation(results);
    }

    if (!jobRoleData?.errors?.length && !isjRLoading && legislationId && jobRoleResponse?.results.length) {
      const { results } = jobRoleResponse;

      let formattedJobRoleData = jobRoles.map((role: any) => formatRoleSpecificData(role, results)
      ).filter((_r) => _r.data.notes.length) || [];


      if (formattedJobRoleData.length && formattedJobRoleData.length !== jobRoles.length) {
        const missingRoles = jobRoles.filter((role) => !formattedJobRoleData.find((_r) => _r.identifier === role.identifier));
        const formattedMissingData = missingRoles.map((role: any) => formatRoleSpecificData(role, []));

        formattedJobRoleData = [...formattedJobRoleData, ...formattedMissingData];
      }

      setJobRoleData(formattedJobRoleData.filter((f) => !f.identifier.includes(SELECT_ALL_FILTER_KEY)));
    } else {
      const roleIdentifiers = legData?.results.job_role_list.map((r: { identifier: string; name: string }) => r.identifier);
      setJobRoleData(
        jobRoles
        ?.filter((f) => roleIdentifiers?.includes(f?.identifier))
        ?.map((role: any) => formatRoleSpecificData(role, []))
      );
    }

    if (jobRoleData?.errors?.length > 0) {
      showToast({
        title: 'Role Content',
        message: 'No Role Content was found for this legislation.',
        persistent: true,
        active: true,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legislationId, isjRLoading, isLLoading, jobRoles?.length]);


  /**
   * Handle tab click.
   */
  const tabClickHandler = (selectedTab: string) => {
    const correctIndex = selectedTab.includes('Role') ? 1
      : selectedTab.includes('Legislation') ? 2 : 3;

      updateUrlWithIndex(correctIndex, navigate);
      setSelectedIndex(Number(correctIndex));
  };


  /**
   * Set the current legislation if it's not the same as the current one.
   */
  useEffect(() => {
    if (state.current?.identifier !== legislationId) {
      const current = state.legislations.find((_l) => _l.identifier === legislationId);
      dispatch(stateActions.seCurrentLegislation(current?.identifier));
    }

    if (legislationId) {
      setCurrentLegislation(state.legislations.find((l) => l.identifier === legislationId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legislationId, currentLegislation?.id, state.legislations, drawerIsOpen]);


  /**
   * Set the initial to the first tab index if the selectedTab is not provided.
   */
  useEffect(() => {
    if (jobRoles.length) {
      setSelectedNavIndex(jobRoles.filter((r) => r.data !== undefined)[0]?.identifier);
    }
  }, [jobRoles, jobRoles.length]);


  /**
   * Refetching the legislation details if the drawer is closed.
   */
  useEffect(() => {
    if (!drawerIsOpen) {
      refetchLegislationDetails();
    }
  }, [drawerIsOpen, refetchLegislationDetails]);


  /**
   * Set the selected tab index if the tabIndex is provided.
   */
  if (isLLoading) {
    return (
      <Loading amount={4} data-details />
    );
  }


  return (
    <Fragment>
      {/* Top Content */}
      <TopContent isDetails data-details-page>
        <Fragment>
          <BackLink to={'/legislation/all'}>Back</BackLink>
          <div className={styles.root__topcontent}>
            {currentLegislation?.name_local ? (
              <h3>{currentLegislation?.name_generic === 'nan' ? currentLegislation.name_local : currentLegislation?.name_generic}</h3>
            ) : <Loading /> }
            <span
              data-in-effect={currentLegislation?.is_in_effect}
            >
              <small className={styles.root__pulser}>&nbsp;</small>
              {currentLegislation?.is_in_effect ? "In effect" : "Not in effect"}
            </span>
          </div>
          <p data-details>See the full details about the legislations from role specific content to summaries and PwC expert team</p>

          <Tabs
            tabSelected={selectedIndex}
            options={FILTER_TABS.map((tab) => ({ label: tab.label, isError: false }))}
            onTabClick={tabClickHandler}
            data-tabs={`${true}`.toString()}
            align="left"
            type="tabs"
            ref={tabRef}
          >
            <ButtonSet data-btn-set>
              {user.is_admin && user.is_approver ? (
                <Button
                  variation='primary'
                  type='button'
                  size='small'
                  onClick={() => setDrawerIsOpen(true)}
                >
                  Edit details
                </Button>
              ) : null}
              {user.is_admin ? (
                <Button
                  variation='secondary'
                  url={`${PATH_LEGISLATION}/${legislationId}/logs`}
                  title={`Publish: ${(legData)?.name_generic || ''}`}
                  data-log-btn
                  size='small'
                >
                  <IconComponent name="NotebookIcon" />
                  Log
                </Button>
              ) : null}
            </ButtonSet>
          </Tabs>

          {/* The intro part */}
          <article className={styles.root__intro}>
            <h5>{Object.values(DESCRIPTION)[selectedIndex-1]?.label || ''}</h5>
            <p>{Object.values(DESCRIPTION)[selectedIndex-1]?.description || ''}</p>
          </article>

        </Fragment>
      </TopContent>

      {/* Main Content */}
      <section
        className={styles.root}
        data-first-tab={isFirstTab}
        data-middle-tab={!(isFirstTab || isLastTab)}
        data-job-role-is-empty={jobRoleData.length === 0}
        data-main-content
        data-inverted
        data-details
      >
        {/* Role specific details */}
        {isFirstTab ? (
          <RolesTab
            showContent={isFirstTab}
            legislation={legData?.results || currentLegislation!}
            adminData={{ is_approver: user.is_approver, is_preparer: user.is_preparer }}
            jobRoleData={jobRoleData?.filter((r: FilterOption) => !r.identifier.includes(SELECT_ALL_FILTER_KEY))}
            selectedNav={selectedNavIndex}
            isEditing={false}
            filters={state.filters}
            isFirstTab={isFirstTab}
            data={currentLegislation as Legislation}
          />
        ) : null }

        {/* Legislation Details */}
        {!(isFirstTab || isLastTab) ? (<DetailsTab legislation={legData?.results || currentLegislation!} />) : null }

        {/* Contact list */}
        {isLastTab ? (<ContactsTab contacts={legData?.results?.pwc_contact || currentLegislation?.pwc_contact || []} />) : null}
      </section>

      {/* Edit Modal */}
      <Modal
        id={LEGISLATION_DETAILS_EDIT_MODAL_ID}
        isOpen={drawerIsOpen}
        onOpen={() => setDrawerIsOpen(true)}
        onClose={() => {
          setDrawerIsOpen(false);
        }}
        data-variation="drawer"
      >
      {currentLegislation?.identifier ? (
        <EditLegislation
          user={user}
          isEditing={drawerIsOpen}
          setIsEditing={setDrawerIsOpen}
          filters={state.filters}
          editingType="default"
          legislation={drawerIsOpen ? currentLegislation as Legislation : {} as Legislation}
          data-drawer
        />
      ) : null}
      </Modal>

      <Footer data-is-admin={user.is_admin} data-page='legislation' details-page={`${legislationId !== undefined}`.toString()}/>
    </Fragment>
  );

};

export default withLegislationHocs(LegislationDetails);
