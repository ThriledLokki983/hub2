import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { composeProjectUrl, updateUrlWithIndex } from 'helpers/projects/projects';

import {
  AlertBar, Footer,
  BackLink, Button, ButtonSet,
  Form, IconComponent, Loader,
  Modal, Tabs, TopContent,
} from 'components';
import { ClientEditDetailsTab, AdminSetupEditTab, ContentConfigurationEditTab } from './Tabs';

import useProjectData from 'hooks/useProjectData';
import { useAppStateContext, useUserContext, useProjectContext } from 'contexts';
import { withProjectHocs } from 'contexts/ProjectContext';
import { withLegislationHocs } from 'contexts/LegislationContext';

import {
  PROJECT_DETAILS_TABLIST,
  LEGISLATION_DETAILS_ROLE_CONTENT_MODAL_ID,
  PROJECT_EDIT_FORM_ID, PROJECT_EDIT_TAB_TITLE,
} from 'configs/project/project';
import { PATH_PROJECTS } from 'configs/paths';

import { Filter, Legislation } from 'hooks/interfaces/legislation.interface';
import EditLegislation from 'pages/Legislation/Admin/EditContent/EditLegislation';
import { Client, ConfigLegislation } from 'hooks/interfaces/project.interface';
import { GET_FILTERS, GET_LEGISLATIONS } from 'configs/api-endpoints';
import useQueryApi from 'hooks/useQueryApi';
import { Key } from 'react-aria-components';
import styles from './Index.module.scss';


const ProjectEdit = () => {
  const tabRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const navigate = useNavigate();
  const { projectId, tabIndex } = useParams();

  const { user } = useUserContext();
  const { showToast } = useAppStateContext();
  const {
    projectData, clientData, isClientDataPending,
    helperFn, filteredList, query, refetchClientLegislations,
  } = useProjectData();

  const { isUpdatePending, updateProjectDetails } = useProjectContext();

  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [filters, setFilters] = useState<Filter[] | []>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [existingFilters, setExistingFilters] = useState<string[]>([]);
  const [currentEditCard, setCurrentEditCard] = useState<Legislation>();
  const [selectedIndex, setSelectedIndex] = useState(Number(tabIndex));
  const [allLegislations, setAllLegislations] = useState<Legislation[]>([]);
  const [projectMembers, setProjectMembers] = useState<{ username: string, identifier: string, role: string }[]>([]);

  // Make api calls to get the filters and legislations
  const { get: getFilters } = useQueryApi(GET_FILTERS);
  const { get: getLegislations } = useQueryApi(GET_LEGISLATIONS);


  // Get the filters and legislations
  const { data: fData, error: fErr, isLoading: isfLoading } = getFilters(null);
  const { data: legislations, error: lErr, isLoading: islLoading } = getLegislations(null);


  /**
   * Go back to the project details page if the user is not an admin
   */
  if (!user.is_admin && projectId) {
    navigate(composeProjectUrl(projectId, 'details', selectedIndex || 1));
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
   * Get the legislations and set it to the state
   */
  useEffect(() => {
    if (!lErr && !islLoading && legislations) {
      setAllLegislations(legislations.results);
    }
  }, [legislations, islLoading, lErr]);


  /**
   * Handle tab click.
   */
  const tabClickHandler = (index: string) => {
    const correctIndex = index === 'Client details' ? 1
    : index === "Admin Setup" ? 2 : 3;

    updateUrlWithIndex(correctIndex, navigate);
    setSelectedIndex(Number(correctIndex));
  };


  /**
   * Handle form submission.
   */
  const formSubmitHandler = (e: any) => {
    e.preventDefault();
    const owners = projectMembers.filter((m) => m.role.toLowerCase().includes('owner')).map((m) => m.identifier);
    const teamMembers = projectMembers.filter((m) => ['preparer', 'approver'].includes(m.role.toLowerCase())).map((m) => m.identifier);

    let payloadData = { ...formValues };

    if (owners.length) {
      payloadData = { ...payloadData, project_owner_list: owners };
    }

    if (teamMembers.length) {
      payloadData = { ...payloadData, team_member_list: teamMembers };
    }

    updateProjectDetails({ ...payloadData, is_published: true });
    navigate(PATH_PROJECTS);
  };


  /**
   * Save Legislation for future editing
   * @param e
   */
  const onSaveProjectAsDraftClickHandler = (_e: any) => {
    const owners = projectMembers.filter((m) => m.role.toLowerCase().includes('owner')).map((m) => m.identifier);
    const teamMembers = projectMembers.filter((m) => ['preparer', 'approver'].includes(m.role.toLowerCase())).map((m) => m.identifier);

    if (!Object.keys(formValues).length && !owners.length && teamMembers.length) {
      alert('No changes were made to the project');
      return;
    }

    let payloadData = { ...formValues };

    if (owners.length) {
      payloadData = { ...payloadData, project_owner_list: owners };
    }

    if (teamMembers.length) {
      payloadData = { ...payloadData, team_member_list: teamMembers };
    }

    updateProjectDetails({ ...payloadData });
  };


  /**
   * Check if the user can publish the project or not
   */
  const canPublishProject = useMemo(() => {
    if (clientData && clientData.length > 0) {
      return clientData?.some((clientLegislation: ConfigLegislation) => clientLegislation.is_published)
        && projectData?.project_owner_list?.some((owner) => owner.identifier === user.profile.identifier)
        && user?.is_approver && !projectData?.is_published;
    }
  }, [
    clientData,
    user?.is_approver,
    user.profile.identifier,
    projectData?.is_published,
    projectData?.project_owner_list,
  ]);


 /**
   * Update filters and Legislations
   */
  const updateFilters = (isChecked: boolean, filter: Filter, value: string) => {
    const filteredData = filter.data.find((data) => data.name.toLowerCase() === value.toLowerCase());

    if (!filteredData?.identifier) {
      console.warn('Identifier not found');
      return;
    }

    if (!isChecked && existingFilters.includes(filteredData.identifier)) {
      setExistingFilters(existingFilters.filter((f) => f !== filteredData.identifier));
    }

    if (isChecked && !existingFilters.includes(filteredData.identifier)) {
      setExistingFilters([...existingFilters, filteredData.identifier]);
    }
  };


  /**
   * Update the form values when the input changes (text, textarea)
   */
  const onInputChange = (name: string, newValue: string) => {
    setFormValues((prev) => ({ ...prev, [name]: newValue }));
  };


  /**
   * Update the members added to teh projects
   * @param role
   * @param data
   * @returns
   */
  const onSelectionChange = (role: Key, member: Client, allMembers: Client[]) => {
    if (!member.identifier || !role) return;

    // Set the project members
    setProjectMembers([
      ...allMembers.map((m) => ({
        username: m.username,
        identifier: m.identifier,
        role: m.role.toLowerCase(),
      }))
    ]);
  }


  return (
    <Fragment>
      <TopContent isDetails data-details-page>
        <BackLink to={PATH_PROJECTS} >Back</BackLink>
        <div data-top-content>
          <h3>Edit project</h3>
          <span data-is-published={projectData?.is_published} data-is-draft={!projectData?.is_published}>
            <small className={styles.root__pulser}>&nbsp;</small>
            {projectData?.is_published ? 'Published' : 'Draft'}
          </span>
        </div>
        <p>Set up the client project with client specific content. Details can be altered after the project has been created.</p>

        {/* Tabs */}
        <Tabs
          tabSelected={selectedIndex}
          options={PROJECT_DETAILS_TABLIST.map((tab) => ({ label: tab.label, isError: false }))}
          onTabClick={tabClickHandler}
          data-tabs={`${true}`.toString()}
          align="left"
          type="tabs"
          ref={tabRef}
        >
          <ButtonSet data-btn-set data-edit-btn>
            <Button
              variation='cancel'
              size="small"
              type='button'
              data-edit-btn
              url={projectId && composeProjectUrl(projectId, 'details', selectedIndex || 1)}
              title={`Cancel changes for: ${(projectData)?.name || ''}`}
            >
              Cancel
            </Button>
            <Button
              variation='secondary'
              size="small"
              type='button'
              disabled={!(user.is_admin && user.is_approver) || isUpdatePending}
              title={`Save changes for: ${(projectData)?.name || ''}`}
              onClick={onSaveProjectAsDraftClickHandler}
            >
              {isUpdatePending ? 'Saving...' : 'Save changes'}
            </Button>
            {user.is_approver && !projectData?.is_published ? (
              <Button
              variation='primary'
              size="small"
              type='submit'
              aria-controls={`${PROJECT_EDIT_FORM_ID}-${projectId}`}
              form={`${PROJECT_EDIT_FORM_ID}-${projectId}`}
              title={`Publish: ${(projectData)?.name || ''}`}
              disabled={!canPublishProject || !user.is_approver}
            >
              Publish to client
            </Button>
            ) : null }
          </ButtonSet>
        </Tabs>
      </TopContent>

      <article data-tab={selectedIndex} data-edit-page className={styles.root__article} data-content data-index={selectedIndex}>

        {/* Add new Legislation button */}
        <div data-intro-container>
          <p>{PROJECT_EDIT_TAB_TITLE[selectedIndex]}</p>
          {selectedIndex === 3 ?(
            <ButtonSet data-btn-set>
              <Button size="small" disabled={true}>
                <IconComponent name="PlusFillIcon" />
                Add new legislation
              </Button>
            </ButtonSet>
          ) : null}
        </div>

        {/* Show notice to the users that they can only edit a specific part of the project */}
        {user.is_admin && (user.is_preparer && !user.is_approver) ? (
          <AlertBar variation="notice" data-notice>
            <p>
              Note! As a Preparer, you are <strong>only</strong> allowed to make changes to the legislations that
              are already in this this project.
            </p>
          </AlertBar>
        ) : null}

        <Form
          id={`${PROJECT_EDIT_FORM_ID}-${projectId}`}
          data={{}}
          onSubmit={formSubmitHandler}
          ref={formRef}
          data-project-edit
          data-tab={selectedIndex}
        >
          {projectData ? (
            <Fragment>
              <ClientEditDetailsTab
                selectedIndex={selectedIndex}
                project={projectData}
                user={user}
                onInputChange={onInputChange}
              />
              <AdminSetupEditTab
                selectedIndex={selectedIndex}
                project={projectData}
                user={user}
                onSelectionChange={onSelectionChange}
              />
              <ContentConfigurationEditTab
                user={user}
                isEditing={isEditing}
                isPending={isClientDataPending} // Double check which pending is really needed here
                showToast={showToast}
                setIsEditing={setIsEditing}
                selectedIndex={selectedIndex}
                updateFilters={updateFilters}
                project={projectData}
                filters={filters}
                legislations={allLegislations}
                setCurrentEditCard={setCurrentEditCard}
                clientLegislations={clientData}
                refetch={refetchClientLegislations}
                existingFilters={existingFilters}
                helperFn={helperFn}
                filteredList={filteredList}
                query={query}
              />
            </Fragment>
          ) : (
            <Loader data-medium />
          )}
        </Form>
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
            refetch={refetchClientLegislations}
            editingType="project"
            data-drawer
          />
        ) : null }
      </Modal>
      <Footer data-is-admin={user.is_admin} data-page='legislation' details-page={`${true}`.toString()}/>
    </Fragment>
  );

};

export default withProjectHocs(withLegislationHocs(ProjectEdit));
