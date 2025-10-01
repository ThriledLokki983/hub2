import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

import { remove, restore } from 'helpers/utils';
import { filterData, sortLegislationsData } from './reducers/helpers';

import { formatFilters } from 'helpers/legislations/legislation';
import { useQueryApi, useVisibilityChange } from 'hooks';
import { useUserContext } from 'contexts';

import { GET_FILTERS, GET_LEGISLATIONS } from 'configs/api-endpoints';
import {
  REVIEW_STATE,
  CREATED_STATE,
  STATE_DEFAULTS,
  APPROVED_STATE,
  ACTIVE_LEGISLATION_FILTERS_ID,
  STORAGE_LEGISLATION_REFETCH_KEY,
} from 'configs/legislation/legislation';

import useLegislationStateReducer from './reducers/legislationReducer';


/**
 * Custom hook for managing legislation data.
 * @returns An object containing the state, dispatch function, and actions for managing legislation data.
 */
const useLegislation = () => {
  const [state, dispatch, actions] = useLegislationStateReducer(STATE_DEFAULTS);
  const { user } = useUserContext();
  const location = useLocation();

  const legislationId = useMemo(() => {
    return location.state !== null ? location.state.legislationId
      : window.location.pathname.includes('/all/')
      ? window.location.pathname.split('/').pop() : '';
  }, [location.state]);

  const isFiltering = useMemo(() => {
    return state.filters.some((filter) => filter.data.some((d) => d.is_approved));
  }, [state.filters]);

  const permission = useMemo(() => {
    const isApprover = user.is_approver;
    const isPreparer = user.is_preparer;
    return isApprover ? 'approver' : isPreparer ? 'preparer' : 'others';
  }, [user.is_approver, user.is_preparer]);

  // query apis
  const { get: getFilters } = useQueryApi(GET_FILTERS);
  const { get: getLegislations } = useQueryApi(GET_LEGISLATIONS);

  const { data: fData, error: fErr, isLoading: isfLoading } = getFilters(null);
  const { data: lData, error: lErr, isLoading: islLoading } = getLegislations(null);


  /**
   * Legislation Fetch Helper
   */
  const fetchAndSetLegislations = useCallback(() => {
    if (!fData?.errors?.length && !isfLoading && fData) {
      const { results } = fData;
      const isInGuideTourMode = !user.is_admin && user.show_aside_tour;
      const userJobRoles = isInGuideTourMode ? [] : user.profile.job_role_list?.map((r) => r.identifier) || [];
      dispatch(actions.initState({ filters: formatFilters(results || [], permission, userJobRoles)
      //   .map((f) => {
      //   if (f.label === 'product_service') {
      //     return {
      //       ...f,
      //       data: f.data.filter((d) => d.name !== 'All')
      //     }
      //   }
      //   return f

      // })
    }));

    }

    if (!lData?.errors?.length && !islLoading && lData) {
      const { results } = lData;

      const finalLegislations = user.is_admin
        ? results : !user.is_admin && user.show_aside_tour ? results
          : results?.filter((r: any) => r.preparation_state === APPROVED_STATE) || [];

      dispatch(actions.initState({ legislations: finalLegislations || [], permission }));
    }
  }, [fData, lData, isfLoading, islLoading, user, permission, dispatch, actions]);


  /**
   * Force refetch meetings (circumventing any cache).
   */
  const refetchLegislations = () => fetchAndSetLegislations();

  // Attach fresh data polling on `visibilitychange` (when tab becomes visible again).
  const shouldFetchTime = 10 * 60 * 1000;
  const refetchIfNeeded = useVisibilityChange(refetchLegislations, shouldFetchTime);


  /**
   * Fetch all data on component mount.
   */
  useEffect(() => {
    const refetch = restore(STORAGE_LEGISLATION_REFETCH_KEY);
    fetchAndSetLegislations();
    if (refetch) {
      remove(STORAGE_LEGISLATION_REFETCH_KEY)
    }
  }, [fetchAndSetLegislations, isfLoading, islLoading, user]);


  /**
   * Refetch if Needed
   */
  useEffect(() => {
    refetchIfNeeded();
  }, [refetchIfNeeded]);

  /**
   * Set the Filtered Legislations
   */
  useEffect(() => {
    if (!lData?.errors?.length && !islLoading && lData) {
      const { results } = lData;
      const finalLegislations = user.is_admin
        ? results : !user.is_admin && user.show_aside_tour ? results
          : results?.filter((r: any) => r.preparation_state === 'PUBLISHED') || [];

      if (window.location.pathname.includes('legislation'))  {
        dispatch(actions.initState({ filteredLegislations: filterData(finalLegislations, state.filters) }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters, lData, islLoading]);


  /**
   * Group legislations by tabs.
   */
  useMemo(() => {
    const legislations = (state.query || isFiltering)
      ? state.filteredLegislations
      : state.legislations || [];
    const isAdmin = ['approver', 'preparer'].includes(permission);

    const filterLegislationData = (published: boolean = false, created: boolean = false, isInEffect: boolean = false) => {
      if (['approver', 'preparer'].includes(permission) && !isInEffect) {
        return legislations.filter(
          (l) => published
            ? l.preparation_state === APPROVED_STATE
            : created ? l.preparation_state === CREATED_STATE : l.preparation_state === REVIEW_STATE
        ).map((l) => ({
          ...l,
          legislation_type: published ? 'published' : created ? 'created' : 'in_review',
        }));
      }

      return legislations
        .filter((l) => isInEffect ? l.is_in_effect : !l.is_in_effect)
        .map((l) => ({ ...l, legislation_type: isInEffect ? 'in_effect' : 'not_in_effect' }));
    };

    const tabs = [
      {
        label: isAdmin ? 'Created' : 'All',
        entries: isAdmin
          ? sortLegislationsData(filterLegislationData(false, true), state.sortOrder)
          : sortLegislationsData(legislations, state.sortOrder),
        count:  isAdmin ? filterLegislationData(false, true)?.length : legislations?.length,
      },
      {
        label: isAdmin ? 'In Review' : 'Not In effect',
        entries: isAdmin
          ? sortLegislationsData(filterLegislationData(false, false), state.sortOrder)
          : sortLegislationsData(filterLegislationData(false, false), state.sortOrder),
        count: isAdmin ? filterLegislationData(false, false)?.length : filterLegislationData()?.length,
      },
      {
        label: isAdmin ? 'Approved' : 'In effect',
        entries: isAdmin
          ? sortLegislationsData(filterLegislationData(true,), state.sortOrder)
          : sortLegislationsData(filterLegislationData(false, false, true), state.sortOrder),
        count: isAdmin ? filterLegislationData(true)?.length : filterLegislationData(false, false, true)?.length,
      },
    ];

    dispatch(actions.setLegislationTabs(tabs));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.query,
    state.filters,
    state.legislations,
    state.sortOrder,
    isFiltering,
    permission,
  ]);


  /**
   * Set default active filters.
   */
  useEffect(() => {
    dispatch(actions.initActiveFilters(
      state.filters
      .filter((filterOptions) => filterOptions.data.some((option) => option.is_approved))
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters]);


  /**
   * Set the current legislation.
   */
  useEffect(() => {
    if (legislationId) {
      dispatch(actions.seCurrentLegislation(
        state.legislations.find((legislation) => legislation.identifier === legislationId)?.identifier || {}
      ));
    }
  }, [legislationId, state.legislations, dispatch, actions]);


  // Remove the stored filters on page refresh
  useEffect(() => {
    const navigatorRolesPage = Boolean(matchPath(location.pathname, '/navigator/role-based'));

    const handleBeforeUnload = () => {
      if (!navigatorRolesPage && !legislationId) {
        remove(ACTIVE_LEGISLATION_FILTERS_ID, { permanent: false });
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [legislationId, location.pathname]);

  return { state, dispatch, actions, refetchLegislations, loading: isfLoading || islLoading };
};

export default useLegislation;
