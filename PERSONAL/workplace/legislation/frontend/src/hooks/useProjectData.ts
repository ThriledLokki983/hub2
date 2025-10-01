import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { sortConfigLegislation } from "./reducers/helpers";

import useQueryApi from "./useQueryApi";

import { ConfigLegislation, Project } from "./interfaces/project.interface";
import { GET_CLIENT_LEGISLATIONS, GET_CLIENT_PROJECT_DETAILS } from "configs/api-endpoints";
import { LegislationTabs } from "pages/ProjectEdit/Tabs/interfaces";
import { isMatchedSearched } from "helpers/utils";
import { CREATED_STATE, APPROVED_STATE, REVIEW_STATE } from "configs/legislation/legislation";


const useProjectData = (selectedIndex?: number) => {
  const { projectId, tabIndex } = useParams();

  const [query, setQuery] = useState<string>('');
  const [sortValue, setSortValue] = useState<string>('asc');
  const [legislationTabs, setLegislationTabs] = useState<LegislationTabs[]>([]);
  const [filteredList, setFilteredList] = useState<LegislationTabs[]>([]);

  const [clientData, setClientData] = useState<ConfigLegislation[]>([]);
  const [projectData, setProjectData] = useState<Project | null>(null);

  // Api Calls for the data we need for this page
  const { get: getProjectDetails } = useQueryApi({
    ...GET_CLIENT_PROJECT_DETAILS,
    endpoint: `${GET_CLIENT_PROJECT_DETAILS.endpoint}${projectId}/`,
  });
  const { post: getClientLegislations } = useQueryApi(GET_CLIENT_LEGISLATIONS);


  // THe data we need for this page
  const { data, error: projectError, isLoading: isProjectDetailsLoading } = getProjectDetails(null);
  const { data: clientLegislationsData, mutate: getCLegislations, isPending: isClientDataPending } = getClientLegislations();

  /**
 * Set the project data.
 */
  useEffect(() => {
    if (data && data.results && !isProjectDetailsLoading) {
      const projectData = data.results || {};
      setProjectData(projectData);
    }
  }, [data, isProjectDetailsLoading]);

  /**
 * Get the client legislations
 */
  useEffect(() => {
    if (Number(tabIndex) === 3 && !clientLegislationsData && !isClientDataPending) {
      getCLegislations({ client_identifier: projectId });
    }
  }, [clientLegislationsData, getCLegislations, isClientDataPending, projectId, tabIndex]);


  /**
   * Set the client data
   */
  useMemo(() => {
    if (clientLegislationsData) {
      const list: ConfigLegislation[] = clientLegislationsData.results || [];
      setClientData(list);
    }
  }, [clientLegislationsData]);


  /**
   * Handles refetching of the client legislations
   */
  const refetchClientLegislations = () => {
    getCLegislations({ client_identifier: projectId });
  }


  /**
   * Handle sort change.
   */
  const onSortChangeHandler = (e: any) => {
    const target = e.target.closest('button') as HTMLElement;
    const sortValue = target.dataset.sortValue || 'asc';
    setSortValue(sortValue);

    const sortedList = legislationTabs.map((tab) => ({
      ...tab,
      entries: sortList(tab.entries, sortValue),
    }));
    setFilteredList(sortedList);
  };


  /**
   * Handle search input updates and fetch new queries.
  */
  const onSearchChangeHandler = (e: any) => {
    const queryValue = e.target.value;
    setQuery(queryValue);
  };

  /**
   * Dropdown Filter handler
   */
  const onDropdownFilterHandler = (filterValue: string) => {
    const filteredList = legislationTabs.map((tab) => ({
      ...tab,
      entries: sortConfigLegislation(tab.entries, filterValue),
    }));

    setFilteredList(filteredList);
  };


  /**
   * Group legislations by tabs
   */
  useMemo(() => {
    const list: ConfigLegislation[] = clientData || [];

    const getStatus = (leg: ConfigLegislation, status: string, isApproved: boolean = false, publishedToClient: boolean = false) => {
      return isApproved && publishedToClient
        ? leg.is_published
        : !leg.is_published && leg.legislation.preparation_state === status
    }

    const tabs = [
      {
        label: 'Created',
        entries: sortList(list.filter((l) => getStatus(l, CREATED_STATE, false)).filter((l) => isMatchedSearched(l.legislation, query)), sortValue),
        count: list.filter((l) => getStatus(l, CREATED_STATE, false)).filter((l) => isMatchedSearched(l.legislation, query)).length,
      },
      {
        label: 'In Review',
        entries: sortList(list.filter((l) => getStatus(l, REVIEW_STATE, false)).filter((l) => isMatchedSearched(l.legislation, query)), sortValue),
        count: list.filter((l) => getStatus(l, REVIEW_STATE, false)).filter((l) => isMatchedSearched(l.legislation, query)).length,
      },
      {
        label: 'Approved',
        entries: sortList(list.filter((l) => getStatus(l, APPROVED_STATE, false)).filter((l) => isMatchedSearched(l.legislation, query)), sortValue),
        count: list.filter((l) => getStatus(l, APPROVED_STATE, false)).filter((l) => isMatchedSearched(l.legislation, query)).length,
      },
      {
        label: 'Published to client',
        entries: sortList(list.filter((l) => getStatus(l, APPROVED_STATE, true, true)).filter((l) => isMatchedSearched(l.legislation, query)), sortValue),
        count: list.filter((l) => getStatus(l, APPROVED_STATE, true, true)).filter((l) => isMatchedSearched(l.legislation, query)).length,
      },
    ];

    setLegislationTabs(tabs);
    setFilteredList(tabs);
  }, [clientData, query, sortValue]);


  /**
   * Handle search query changes
   */
  useEffect(() => {
    const filteredList = legislationTabs.map((tab) => ({
      ...tab,
      entries: tab.entries.filter((l: ConfigLegislation) => isMatchedSearched(l.legislation, query)),
    }))
    setFilteredList(filteredList);
  }, [legislationTabs, query]);



  /**
   * Return the data we need for this page
   */
  return useMemo(() => ({
    projectData,
    clientData,
    projectError,

    // Refetch
    refetchClientLegislations,

    // Tabs
    query,
    filteredList,
    helperFn: {
      onSort: onSortChangeHandler,
      onSearch: onSearchChangeHandler,
      onDropDown: onDropdownFilterHandler,
    },

    // Booleans
    isClientDataPending,
    isProjectDetailsLoading

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [
    query,
    clientData,
    projectData,
    projectError,
    filteredList,
    isClientDataPending,
    isProjectDetailsLoading
  ]);

};

export default useProjectData;

/**
 * Handle sorting of the list
 * @param sortValue
 * @returns Array
 */
function sortList(list: ConfigLegislation[], sortValue: string): ConfigLegislation[] {
  return list.sort((a, b) => {
    if (sortValue === 'asc') {
      return a.created_at.localeCompare(b.created_at);
    } else {
      return b.created_at.localeCompare(a.created_at);
    }
  });
}
