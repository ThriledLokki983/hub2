import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { composeProjectUrl, updateUrlWithIndex } from 'helpers/projects/projects';

import useQueryApi from 'hooks/useQueryApi';
import { GET_FILTERS } from 'configs/api-endpoints';
import { PATH_LEGISLATION, PATH_PROJECTS } from 'configs/paths';
import useProjectData from 'hooks/useProjectData';
import { PROJECT_DETAILS_TAB_TITLE, PROJECT_DETAILS_TABLIST } from 'configs/project/project';

import { BackLink, Button, ButtonSet, Footer, IconComponent, Loader, Modal, Tabs, TopContent } from 'components';
import { Filter, Legislation } from 'hooks/interfaces/legislation.interface';

import { useUserContext } from 'contexts';
import { AdminSetup, ClientDetails, ContentConfig } from './Tabs';
import EditLegislation from 'pages/Legislation/Admin/EditContent/EditLegislation';
import styles from './Index.module.scss';


const LEGISLATION_DETAILS_ROLE_CONTENT_MODAL_ID = 'legislation-details-view-mode-1';

const ProjectDetails = () => {

  const navigate = useNavigate();
  const { projectId, tabIndex } = useParams();

  const tabRef = useRef<HTMLDivElement | null>(null);

  const { user } = useUserContext();
  const {
    projectData,
    clientData,
    isClientDataPending,
    helperFn,
    filteredList,
    query
  } = useProjectData(Number(tabIndex) || 1);

  const [filters, setFilters] = useState<Filter[] | []>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState(Number(tabIndex) || 1);
  const [currentEditCard, setCurrentEditCard] = useState<Legislation>();

  const projectDetailsTablist = useMemo(() =>
    user.is_admin ? [ ...PROJECT_DETAILS_TABLIST ] : PROJECT_DETAILS_TABLIST,
    [user.is_admin]
  );

  const { get: getFilters } = useQueryApi(GET_FILTERS);
  const { data: fData, error: fErr, isLoading: isfLoading } = getFilters(null);

   /**
   * Go back to the project details page if the user is not an admin
   */
  if (!user.is_admin) {
    navigate(PATH_LEGISLATION);
  }


  /**
   * Get the filters and set it to the state
   * We need to format the filters to match the filter interface and set it to the state
   * -- so that we can use it in the aside component on the left side
   */
  useEffect(() => {
    if (!fData?.errors?.length && !isfLoading && fData) {
      const { results } = fData;
      setFilters(results as Filter[]);
    }
  }, [fData, isfLoading]);

  /**
   * Handle tab click.
   */
  const tabClickHandler = (index: string) => {
    const correctIndex = index === 'Client details' ? 1
      : index === "Admin Setup" ? 2 : 3;

    updateUrlWithIndex(correctIndex, navigate);
    setSelectedIndex(Number(correctIndex));
  };

  const isPartOfProjectOwners = useMemo(() => {
    return projectData?.project_owner_list?.some((m) => m.identifier === user.profile.identifier);
  }, [projectData?.project_owner_list, user.profile.identifier]);


  const editUrl = useMemo(() => {
    if (user.is_admin && user.is_approver) {
      return projectId && composeProjectUrl(projectId, 'edit', selectedIndex || 1);
    }

    if (user.is_admin && !user.is_approver) {
      return projectId && composeProjectUrl(projectId, 'edit', 3);
    }

  }, [projectId, selectedIndex, user.is_admin, user.is_approver]);


  /**
   * Show the notice to the preparer
   * @returns
   */
  const renderNotice = () => {
    return (
      <></>
    )
  };

  return (
    <Fragment>
      <TopContent isDetails data-details-page>
        <BackLink to={PATH_PROJECTS}>Back</BackLink>
        <div data-top-content>
          <h3>{projectData?.name}</h3>
          <span data-is-published={projectData?.is_published} data-is-draft={!projectData?.is_published}>
            <small className={styles.root__pulser}>&nbsp;</small>
            {projectData?.is_published ? 'Published' : 'Draft'}
          </span>
        </div>
        <p>View and edit the client environment.</p>

        {/* Tabs */}
        <Tabs
          tabSelected={selectedIndex}
          options={projectDetailsTablist.map((tab) => ({ label: tab.label, isError: false }))}
          onTabClick={tabClickHandler}
          data-tabs={`${true}`.toString()}
          align="left"
          type="tabs"
          showLastTabIcon={false}
          ref={tabRef}
        >
          {user.is_admin || isPartOfProjectOwners ? (
            <ButtonSet data-btn-set>
              <Button
                variation='primary'
                size="small"
                url={editUrl}
                title={`Publish: ${(projectData)?.name || ''}`}
                data-edit-btn
              >
                Edit Project
              </Button>
              {user.is_admin ? (
                <Button
                  variation='secondary'
                  size="small"
                  url={`${PATH_PROJECTS}/${projectId}/logs`}
                  title={`Publish: ${(projectData)?.name || ''}`}
                  data-log-btn
                >
                  <IconComponent name="NotebookIcon" />
                  Log
                </Button>
              ) : null}
            </ButtonSet>
          ) : null}
        </Tabs>
      </TopContent>

      <article data-details-page data-tab={selectedIndex} className={styles.root__article} data-content>
        <p>{PROJECT_DETAILS_TAB_TITLE[selectedIndex]}</p>
        {projectData ? (
          <Fragment>
            <ClientDetails selectedIndex={selectedIndex} project={projectData} />
            <AdminSetup selectedIndex={selectedIndex} project={projectData} />
            <ContentConfig
              user={user}
              selectedIndex={selectedIndex}
              project={projectData}
              setIsEditing={setIsEditing}
              isEditing={isEditing}
              isPending={isClientDataPending}
              clientLegislations={clientData}
              setCurrentEditCard={setCurrentEditCard}
              helperFn={helperFn}
              filteredList={filteredList}
              query={query}
            />
            {/* <PreviewClient selectedIndex={selectedIndex} project={projectData} filters={projectState?.filters}/> */}
          </Fragment>
        ) : (
          <Loader data-medium />
        )}
      </article>


      {/* Edit modal */}
      <Modal
        id={LEGISLATION_DETAILS_ROLE_CONTENT_MODAL_ID}
        isOpen={isEditing}
        onOpen={() => setIsEditing(true)}
        onClose={() => setIsEditing(false)}
        data-variation="drawer"
      >
        {currentEditCard?.identifier ? (
          <EditLegislation
            user={user}
            filters={filters}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            legislation={currentEditCard as any}
            refetch={() => {}}
            renderNotice={renderNotice}
            editingType="project"
            data-drawer
          />
        ) : null }
      </Modal>
      <Footer data-is-admin={user.is_admin} data-page='legislation' details-page={`${true}`.toString()}/>
    </Fragment>
  );

};

export default ProjectDetails;
