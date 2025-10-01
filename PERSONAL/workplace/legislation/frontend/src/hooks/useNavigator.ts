import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isMatchedSearched, restore, store } from 'helpers/utils';
import { filterData, sortNavigatorLegislationData } from './reducers/helpers';

import { composeLegislationNavigatorPayload, formatFilters } from 'helpers/legislations/legislation';
import { useUserContext } from 'contexts';
import { useQueryApi } from 'hooks';
import useNavigatorReducer from './reducers/navigatorReducer';

import {
  ACTIVE_LEGISLATION_FILTERS_ID,
  NAVIGATOR_FILTER_PAYLOAD_ID,
  NAVIGATOR_STATE_DEFAULTS,
} from 'configs/legislation/legislation';
import { GET_FILTERS, GET_ROLE_CONTENT } from 'configs/api-endpoints';
import { Filter } from './interfaces/legislation.interface';
import { NavigatorLegislation } from './interfaces/navigator.interface';


const useNavigator = () => {


  const location = useLocation();

  const filteredData = restore(NAVIGATOR_FILTER_PAYLOAD_ID, { permanent: false }) ?? [];
  const activeFiltersData = restore(ACTIVE_LEGISLATION_FILTERS_ID, { permanent: false });

  const [state, dispatch, actions] = useNavigatorReducer(NAVIGATOR_STATE_DEFAULTS);
  const { user } = useUserContext();

  const [isFiltering, setIsFiltering] = useState(false);
  const permission = useMemo(() => {
    const isApprover = user.is_approver;
    const isPreparer = user.is_preparer;
    return isApprover ? 'approver' : isPreparer ? 'preparer' : 'others';
  }, [user.is_approver, user.is_preparer]);

  // query apis
  const { get: getFilters } = useQueryApi(GET_FILTERS);
  const { post: getRoleContent } = useQueryApi(GET_ROLE_CONTENT);


  const { data: fData, error: fErr, isLoading: isfLoading } = getFilters(null);
  const { data: roleContentData, mutate: mutateRoleContent, isSuccess } = getRoleContent();


  /**
   * Get the current active filters
   */
  const activeFilters = useMemo(() => {
    const filters: Filter[] = activeFiltersData || state.filters;
    return filters
      ?.filter((_f) => _f.data.some((d) => d.is_approved ? true : false))
      ?.map((f) => ({
        ...f,
        data: f.data.filter((_d) => _d.is_approved)
      })) || [];
  }, [activeFiltersData, state.filters]);


  /**
   * Check if any of the active filters have been approved
   * @returns
   */
  useEffect(() => {
    setIsFiltering(activeFilters.some((f) => f.data.some((d) => d.is_approved)));
  }, [activeFilters]);


  /**
   * Function to take care of the payload composition
   * @returns
   */
  const getSelectPayload = () => {
    const payload = composeLegislationNavigatorPayload(
      activeFilters,
      user.profile.job_role_list
    );

    store(NAVIGATOR_FILTER_PAYLOAD_ID, payload, { permanent: false });
    return payload;
  };


  /**
   * Fetch all data on component mount.
   */
  useEffect(() => {
    if (!fData?.errors?.length && !isfLoading && fData?.results?.length) {
      const { results } = fData;
      const userJobRoles = user.profile.job_role_list?.map((r) => r.identifier);
      dispatch(actions.initState({ filters: formatFilters( results, permission, userJobRoles || []) }));
    }
  }, [isfLoading, fData?.results?.length, isSuccess, location.pathname, user, fData, dispatch, actions, permission]);


  /**
   * Fetch the role content
   */
  useEffect(() => {
    const payload = getSelectPayload();
    if (!Object.keys(payload.selectors).length) {
      return;
    }
    if (window.location.pathname.includes('role-based')) {
      mutateRoleContent(payload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isfLoading]);


  /**
   * Set the navigator legislations on success
   */
  useEffect(() => {

    if (Object.keys(filteredData?.selectors || {})?.length && isSuccess) {
      if (!roleContentData?.errors?.length && isSuccess) {
        const { results } = roleContentData;
        const  filtered = results?.filter((nav: NavigatorLegislation) => isMatchedSearched(nav.legislation, state.query)) || [];
        const filteredNavLegislations = sortNavigatorLegislationData(filtered, state.sortOrder);
        dispatch(actions.initState({ navLegislations: results, filteredNavLegislations }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const allSelectedFilters = useMemo(() => {
    const filters = activeFiltersData || state.filters;

    return filters.reduce((acc: Filter[], f: Filter) => {
      return acc.concat(f.data.filter((d) => d.is_approved) as any[]);
    }, []);
  }, [activeFiltersData, state.filters]);


  /**
   * Set the Filtered Navigator Legislations
   */
  useEffect(() => {
    const activeFiltersData = restore(ACTIVE_LEGISLATION_FILTERS_ID, { permanent: false });
    const approvedFilters: Filter[] = activeFiltersData || state?.filters;

    if (window.location.pathname.includes('navigator'))  {
      const  filtered = state.navLegislations.filter((nav: NavigatorLegislation) => isMatchedSearched(nav.legislation, state.query || ''));
      const filteredNavLegislations = sortNavigatorLegislationData(state.navLegislations, state.sortOrder);
      dispatch(actions.initState({ filteredNavLegislations }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSelectedFilters.length, state.navLegislations, location.pathname, state?.filters, state.sortOrder, dispatch, actions]);

  /**
   * Refetch if Needed
   */
  const refetchLegislations = () => {};

  return { state, dispatch, actions, refetchLegislations };

};

export default useNavigator;
