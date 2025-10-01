import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import { useAppStateContext, useUserContext} from "contexts";

import UseProjectReducer from "./reducers/projectReducer";
import { STATE_DEFAULTS } from "configs/project/project";
import { ConfigLegislation, GroupProject, Project } from "./interfaces/project.interface";
import useQueryApi from "./useQueryApi";
import {
  GET_CLIENT_LEGISLATIONS, GET_CLIENT_PROJECT_DETAILS,
  GET_CLIENT_PROJECTS, GET_FILTERS, GET_LEGISLATIONS,
  REQUEST_CLIENT_LEGISLATION_APPROVAL, UPDATE_CLIENT_PROJECT,
} from "configs/api-endpoints";
import { formatFilters } from "helpers/legislations/legislation";
import { Filter, Legislation } from "./interfaces/legislation.interface";
import { filterData } from "./reducers/helpers";
import { formatConfigLegislation, formatProjectFilters } from "helpers/projects/projects";

const useProject = () => {

  const location = useLocation();
  const { projectId } = useParams();

  const [state, dispatch, actions] = UseProjectReducer(STATE_DEFAULTS);
  const isEditPage = location.pathname.includes('edit');

  const { user } = useUserContext();
  const { showToast } = useAppStateContext();

  const [existingFilters, setExistingFilters] = useState<string[]>([]);
  const [filterIsChanged, setFilterIsChanged] = useState<boolean>(false);

  // query apis
  const { get: getProjects } = useQueryApi(GET_CLIENT_PROJECTS);
  const { get: getProjectDetails } = useQueryApi({
    ...GET_CLIENT_PROJECT_DETAILS,
    endpoint: `${GET_CLIENT_PROJECT_DETAILS.endpoint}${projectId}/`,
  });
  const { patch: updateProjectQuery } = useQueryApi({
    ...UPDATE_CLIENT_PROJECT,
    endpoint: `${UPDATE_CLIENT_PROJECT.endpoint}${projectId}/`,
  });
  // const { post: getClientLegislations } = useQueryApi(GET_CLIENT_LEGISLATIONS);
  const { post: requestLegislationApproval } = useQueryApi(REQUEST_CLIENT_LEGISLATION_APPROVAL);
  // const { get: getFilters } = useQueryApi(GET_FILTERS);
  // const { get: getLegislations } = useQueryApi(GET_LEGISLATIONS);

  // Invoke the api to make request for data
  // const { data: fData, error: fErr, isLoading: isfLoading } = getFilters(null);
  const { data: projectsData, error: accessError, isLoading: isProjectLoading } = getProjects(null);
  const { data: projectData, error: projectError, isLoading: isProjectDetailsLoading } = getProjectDetails(null);
  const { mutate: updateProject, error: updateError, isPending: isUpdatePending, isSuccess, isError } = updateProjectQuery();
  // const { data: clientLegislationsData, mutate: getCLegislations, isPending: isClientDataPending } = getClientLegislations();
  const { mutate: requestApproval, isPending: isApprovalPending, isSuccess: isApprovalSuccess, isError: isApprovalError, error } = requestLegislationApproval();
  // const { data: lData, error: lErr, isLoading: islLoading } = getLegislations(null);

  /**
   * Set the project detail config state (editing or details)
   */
  useMemo(() => {
    dispatch(actions.setViewState(isEditPage ? "editing" : "viewing"));
  }, [actions, dispatch, isEditPage]);

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

      dispatch(actions.setProjectGroups(projectGroups));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProjectLoading, projectsData]);


  /**
   * Update project state when projectData changes
   */
  useEffect(() => {
    if (projectData && !isProjectDetailsLoading && projectId) {
      const project = projectData?.results;
      dispatch(actions.initState(project));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditPage, isProjectDetailsLoading, projectData, projectId]);


  /**
   * Fetch client legislations
   */
  // useEffect(() => {
  //   if (projectId && !isClientDataPending && !clientLegislationsData) {
  //     getCLegislations({ client_identifier: projectId });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [clientLegislationsData, isEditPage, isClientDataPending, projectId]);


  /**
   * Get the filters
   */
  // useEffect(() => {
  //   if (!fData?.errors?.length && !isfLoading && fData) {
  //     const { results } = fData;
  //     const formattedFilters = formatFilters(results || [], 'others', existingFilters) || [];
  //     dispatch(actions.setFilters(formattedFilters as Filter[] || []));
  //   }
  // }, [fData, isfLoading, isEditPage, existingFilters, actions, dispatch]);


  /**
   * Fetch legislations
   */
  // useEffect(() => {
  //   if (!lData?.errors?.length && !islLoading && lData) {
  //     const { results } = lData;
  //     dispatch(actions.setLegislations(results || []));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [lData, islLoading]);


  /**
   * Set client legislations
   */
  // useMemo(() => {
  //   if (clientLegislationsData) {
  //     const clientData = clientLegislationsData?.data
  //       ? clientLegislationsData?.data?.results
  //       : clientLegislationsData?.results || [];

  //     const finalData: ConfigLegislation[] = clientData.map((data: ConfigLegislation) => ({
  //       ...data,
  //        is_selecting: false
  //     }));

  //     dispatch(actions.setClientLegislations(finalData));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [clientLegislationsData]);


  /**
   * Check if the user can send the project legislations for approval
   */
  const canSendProjectLegislationsForApproval = useMemo(() => {
    // if (clientLegislationsData && isEditPage) {
    //   const clientData = clientLegislationsData?.data
    //     ? clientLegislationsData?.data?.results
    //     : clientLegislationsData?.results || [];

    //   return clientData.length === 0;
    // }
    return false;
  }, []);


  /**
   * Check if the user can publish the project or not
   */
  const canPublishProject = useMemo(() => {
    // if (clientLegislationsData) {
    //   return clientLegislationsData
    //     .results
    //     ?.some((clientLeg  islation: ConfigLegislation) => clientLegislation.is_approved)
    //     && isEditPage && user.is_approver;
    // }
    return false;
  }, []);


  /**
   * Update project
   */
  const updateProjectDetails = useCallback((data: any) => {
    updateProject(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /**
   * Request approval for client project legislations
   */
  const requestProjectLegislationApproval = useCallback((legislationIdentifiers: any) => {
    // Cannot request approval if project id is not available or data is empty
    if (!projectId || !legislationIdentifiers?.length) return;

    const payload = {
      client_identifier: projectId,
      legislation_identifier_list: legislationIdentifiers,
    }

    requestApproval(payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /**
   * Update filters and Legislations
   */
  const updateFilters = (checked: boolean, filterOption: Filter, name: string) => {
    const filteredData = filterOption.data.find((data) => data.name.toLowerCase() === name.toLowerCase());

    if (!filteredData?.identifier) {
      console.warn('Identifier not found');
      return;
    }

    if (!checked && existingFilters.includes(filteredData.identifier)) {
      setExistingFilters(existingFilters.filter((filter) => filter !== filteredData.identifier));
      setFilterIsChanged(true);
    }

    if (checked && !existingFilters.includes(filteredData.identifier)) {
      setExistingFilters([...existingFilters, filteredData.identifier]);
      setFilterIsChanged(true);
    }
  };


  /**
   * Update the projectLegislations when filters change
   */
  useEffect(() => {
    const updatedFilters = formatProjectFilters(state.filters, existingFilters) || [];
    const filteredLegislations = formatConfigLegislation(filterData(
        state.legislations,
        updatedFilters as Filter[],
      ) as Legislation[],
      true,
    );

    if (existingFilters.length === 0 && state.viewState === 'editing' && filterIsChanged) {
      dispatch(actions.setClientLegislations([] as ConfigLegislation[]));
      return;
    }

    if (existingFilters.length > 0) {
      dispatch(actions.setClientLegislations(filteredLegislations as ConfigLegislation[]));
      return;
    }

  }, [actions, dispatch, existingFilters, filterIsChanged, state.filters, state.legislations, state.viewState]);


  /**
   * Update filters
   */
  useEffect(() => {
    const updatedFilters = formatProjectFilters(state.filters, existingFilters) || [];
    dispatch(actions.setFilters(updatedFilters as Filter[]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, dispatch, existingFilters.length]);


  /************************************************************************
   *? Toast Area
   *? Show toast message when the project is updated.
   ***********************************************************************/
  useEffect(() => {
    if (isSuccess) {
      showToast({
        title: 'Project updated successfully',
        message: 'The project has been updated successfully with the new changes made.',
        type: 'message',
        persistent: false,
        active: true,
      });
    }

    if (updateError) {
      showToast({
        title: 'Project update failed',
        message: 'The project update failed. Please try again.',
        type: 'error',
        persistent: false,
        active: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return {
    state,
    dispatch,
    actions,

    // Booleans
    isLoading: isProjectLoading || isProjectDetailsLoading,
    isPending: isUpdatePending || isApprovalPending,
    isUpdatePending,
    isApprovalPending,
    isSuccess: isSuccess || isApprovalSuccess,
    isError: isError || isApprovalError,
    canPublishProject,
    canSendProjectLegislationsForApproval,
    isClientDataPending: false,

    // Functions
    updateProjectDetails,
    requestProjectLegislationApproval,
    updateFilters,
  };
};

export default useProject;
