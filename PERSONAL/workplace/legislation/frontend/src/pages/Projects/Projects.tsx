import { Children, Fragment, useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key } from 'react-aria-components';
import { composeProjectUrl } from 'helpers/projects/projects';

import {
  Button, IconComponent,
  Form, Loader, TopContent,
  ProjectCard, Modal, Tabs, ButtonSet,
} from 'components';
import { ClientDetails, AdminSetup } from './Components';

import useQueryApi from 'hooks/useQueryApi';
import { useAppStateContext, useUserContext, } from 'contexts';
import { CREATE_CLIENT_PROJECT, GET_CLIENT_PROJECTS } from 'configs/api-endpoints';

import EmptyProjects from './EmptyProjects';
import {
  PROJECT_CREATE_TABS,
  PROJECTS_CREATE_MODAL,
  PROJECT_CREATE_FORM_ID,
} from 'configs/project/project';
import { Client, Project } from 'pages/ProjectEdit/Tabs/interfaces';
import { GroupProject } from 'hooks/interfaces/project.interface';
import styles from './Projects.module.scss';

interface ProjectPayload {
  name: any;
  description: any;
  domain: any;
  starting_date: any;
  team_member_list?: string[];
  project_owner_list?: string[];
}


const Projects = () => {
  const navigate = useNavigate();

  const tabRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const { user } = useUserContext();
  const { showToast } = useAppStateContext();

  const [groupedProjects, setGroupedProjects] = useState<GroupProject[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [owners, setOwners] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [direction, setDirection] = useState<'next' | 'previous' >('next');


  // Make api calls
  const { post: createClientProject } = useQueryApi(CREATE_CLIENT_PROJECT);
  const { get: getProjects } = useQueryApi(GET_CLIENT_PROJECTS);

  // Get the data
  const { data, mutate: createProject, isError, isSuccess, error: projectCreateError } = createClientProject();
  const { data: projectsData, error: accessError, isLoading: isProjectLoading } = getProjects(null);


  /**
   * Update projects state when projectsData changes
   */
  useMemo(() => {
    if (projectsData && !projectsData?.errors?.length && !isProjectLoading) {
      const projectGroups: GroupProject[] = [
        { label: 'Published', projects: [] },
        { label: 'Draft', projects: [] },
      ];

      // Group projects by status (Published, Draft)
      projectsData.results?.forEach((project: Project) => {
        const status = project.is_published ? 'Published' : 'Draft';
        const group = projectGroups.find((group: GroupProject) => group.label === status);

        if (group) {
          const projectExists = group.projects.find((p: Project) => p.identifier === project.identifier);
          if (!projectExists) {
            (group as GroupProject).projects.push(project);
          }
        }
      });

      setGroupedProjects(projectGroups);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProjectLoading, projectsData]);


  /**
   * Handle tab click.
   */
  const tabClickHandler = (tab: string) => {
    const correctIndex = tab === 'Client Details' ? 1 : 2;

    if (selectedIndex > Number(correctIndex)) {
      setDirection('previous');
    } else {
      setDirection('next');
    }
    setSelectedIndex(Number(correctIndex));
  };


  /**
   * Handle form submission.
   */
  const formSubmitHandler = (_e: any) => {

    if (!Object.keys(formValues).length || selectedIndex === 1) {
      return;
    }

    let payload: ProjectPayload = {
      name: formValues.name,
      description: formValues.description,
      domain: formValues.domain,
      starting_date: formValues.starting_date || null,
    }

    if (teamMembers.length) {
      payload = { ...payload, team_member_list: teamMembers };
    }

    if (owners.length) {
      payload = { ...payload, project_owner_list: owners };
    }
    createProject(payload);
  };


  /**
   * Handle the project creation success or error.
   */
  useEffect(() => {
    if (isSuccess) {
      showToast({
        title: 'Project Created Successfully',
        message: `Please take not that project has been created successfully but can still be updated/edited by an admin.`,
        type: 'message',
        active: true,
        persistent: false,
      });
      navigate(data.identifier && composeProjectUrl(data.identifier, 'edit', 1));
    }

    if (isError) {
      // console.log(projectCreateError && JSON.parse(projectCreateError));

      // showToast({
      //   title: 'Something went wrong',
      //   message: `Please be informed the project could not be created, try again later.`,
      //   type: 'error',
      //   active: true,
      //   persistent: true,
      // });
    }

    setIsCreating(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isError, isSuccess]);


  /**
   * Handle going next in the project creation steps/tabs.
   */
  const paginationHandler = (e: any, d: 'next' | 'previous') => {
    setDirection(d);

    if (d === 'next') {
      if (selectedIndex === 2) {
        return;
      }
      setSelectedIndex(2);
    } else if (d === 'previous') {
      if (selectedIndex === 1) {
        return;
      }
      setSelectedIndex(1);
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
  const onSelectionChange = (role: Key, data: Client) => {
    const identifier = data.identifier;
    if (!identifier || !role) return;

    if (['preparer', 'approver'].includes((role as unknown as string)?.toLowerCase())) {
      const ownerIndex = owners.findIndex((o) => o === identifier);
      if (ownerIndex > -1) {
        const newOwners = owners.filter((o) => o !== identifier);
        setOwners(newOwners);
      }

      const teamIndex = teamMembers.findIndex((i) => i === identifier);
      if (teamIndex === -1) {
        setTeamMembers([...teamMembers, data.identifier]);
      }
    }

    if ((role as unknown as string)?.toLowerCase() === 'project owner') {
      const teamIndex = teamMembers.findIndex((i) => i === identifier);

      if (teamIndex > -1) {
        const newTeams = teamMembers.filter((i) => i !== identifier);
        setTeamMembers(newTeams);
      }

      const ownerIndex = owners.findIndex((o) => o === identifier);
      if (ownerIndex === -1) {
        setOwners([...owners, data.identifier]);
      }
    }
  }


  return (
    <Fragment>
      {/* Top Content */}
      <TopContent isDetails>
        <Fragment>
          <h3>Projects</h3>
          <div data-add-btn>
            <p>Create tailored environments by selecting the sustainability legislations relevant to each client.</p>
            {user.is_admin && user.is_approver ? (
              <Button variation='primary' onClick={() => setIsCreating(true)}>
                <IconComponent name="PlusFillIcon" />
                <span>New project</span>
              </Button>
            ) : null}
          </div>
        </Fragment>
      </TopContent>

      {/* Main Content */}
      <section className={styles.root} data-main-content>
        {!groupedProjects?.length && !isProjectLoading ? (
          <EmptyProjects />
        ) : isProjectLoading ? (
          <Loader data-medium />
        ) : (
          <article className={styles.root__projects}>
            {groupedProjects?.length ? Children.toArray(groupedProjects?.map((group, index: number) => (
              <Fragment key={`${group.label}-${index}`}>
                <h3 className={styles.root__project_status}>{group.label}</h3>
                <ul className={styles.root__list} key={`${group.label}-${index}`} data-is-empty={group.projects.length === 0}>
                  {group.projects.length ? group.projects.map((project: Project) => (
                    <ProjectCard key={project.identifier} project={project} />
                  )) : (
                    <div>
                      {isProjectLoading ? <Loader data-medium /> : (
                        <span>There are currently no project for the <strong><em>{group.label}</em></strong> group.</span>
                      )}
                    </div>
                  )}
                </ul>
              </Fragment>
            ))) : null}
          </article>
        )}
      </section>

      <Modal
        id={PROJECTS_CREATE_MODAL}
        isOpen={isCreating}
        onOpen={() => setIsCreating(true)}
        onClose={() => setIsCreating(false)}
        data-project-create
      >
        <header data-project-create-header>
          <Button
            variation='transparent'
            onClick={() => setIsCreating(false)}
            size='small'
          >
            <IconComponent name="CloseOutlineIcon" />
          </Button>
          <div>
            <h2>Create new project</h2>
            <p>Provide general details about the project. You can alter these after the project has been created.</p>
            <span data-required>Required Fields</span>
          </div>
        </header>

        <Tabs
          tabSelected={selectedIndex}
          options={PROJECT_CREATE_TABS}
          onTabClick={tabClickHandler}
          data-tabs
          data-create-tabs
          ref={tabRef}
        />

          <Form
            id={`${PROJECT_CREATE_FORM_ID}`}
            onSubmit={formSubmitHandler}
            ref={formRef}
          >
            <ClientDetails selectedIndex={selectedIndex} direction={direction} onInputChange={onInputChange} />
            <AdminSetup selectedIndex={selectedIndex} onSelectionChange={onSelectionChange} />
          </Form>

          {/* Action Buttons */}
          <ButtonSet data-btn-set data-project-edit data-project-create>
            <Button
              variation="transparent"
              onClick={(event: any) => {
                selectedIndex === 1
                  ? setIsCreating(false) : paginationHandler(event, 'previous');
              }}
            >
              {selectedIndex === 1 ? 'Cancel' : 'Previous'}
            </Button>
            {selectedIndex < 2 ? (
              <Button
                type='button'
                onClick={(event: any) => paginationHandler(event, 'next')}
              >
                Next
              </Button>
            ) : null}
            {selectedIndex === 2 ? (
              <Button
                type="submit"
                aria-controls={`${PROJECT_CREATE_FORM_ID}`}
                form={`${PROJECT_CREATE_FORM_ID}`}
                value="Submit"
                disabled={false}
              >
                Submit
              </Button>
            ) : null}
          </ButtonSet>
      </Modal>
      {/* ) : null} */}
    </Fragment>
  );

};

export default Projects;
