import { Fragment, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isMatchedSearched, remove, store } from 'helpers/utils';
import { composeLegislationNavigatorPayload } from 'helpers/legislations/legislation';
import { sortNavigatorLegislationData } from 'hooks/reducers/helpers';

import { Aside, TopContent, Filters, Button, ButtonSet, IconComponent } from 'components';
import { useAppStateContext, useNavigatorContext, useUserContext } from 'contexts';
import { withNavigatorHocs } from 'contexts/NavigatorContext';
import { useQueryApi } from 'hooks';

import { GET_ROLE_CONTENT } from 'configs/api-endpoints';
import { PATH_ROLE_BASED_NAVIGATOR } from 'configs/paths';
import { ACTIVE_LEGISLATION_FILTERS_ID, JOB_ROLE_KEY, NAVIGATOR_FILTER_PAYLOAD_ID } from 'configs/legislation/legislation';

import { Filter, NavigatorLegislation } from 'hooks/interfaces/legislation.interface';
import styles from './NavigatorLanding.module.scss';


const NavigatorLayout = () => {

  const navigate = useNavigate();

  const { stateActions: appActions, stateDispatch: appDispatch, showToast } = useAppStateContext();
  const { state, stateDispatch: dispatch, stateActions } = useNavigatorContext();
  const { updateUserProfileData, user } = useUserContext();
  const isActiveFiltersEmpty = state.filters.map((f) => f.data.every((o) => !o.is_approved)).every((c) => c);
  const [appFilters, setAppFilters] = useState<any[]>([]);

  const { post: getRoleContent } = useQueryApi(GET_ROLE_CONTENT);

  const { data: roleContentData, mutate: mutateRoleContent, isSuccess } = getRoleContent();


  /**
   * On first render, remove the active filters
   */
  useEffect(() => {
    remove(ACTIVE_LEGISLATION_FILTERS_ID, { permanent: false });
  }, []);

  /**
   * Handles the filter change
   */
  const onFilterChangeHandler = (checked: boolean, filterOption: Filter, name:string) => {
    dispatch(stateActions.setActiveFilters(checked, filterOption, name ?? ''));
  };


  /**
   * List of roles for the user
   */
  const userRoles = useMemo(() => {
    const jobRoles = user.profile.job_role_list || [];
    return user.is_admin ? [] : jobRoles.map((role, index) => (
      <Fragment key={role.name}>
        <span className={styles.root__jobrole}>{role.name}{index < jobRoles.length - 1 ? ',' : ''}&nbsp;</span>
      </Fragment>
    ));
  }, [user.is_admin, user.profile.job_role_list]);


  /**
   * User first name
   */
  const userFirstName = useMemo(
    () => user.profile.first_name || 'User',
    [user.profile.first_name]
  );

  const jobRoles = useMemo(() => appFilters.find(f => f.label === JOB_ROLE_KEY)?.data, [appFilters]);

  /**
   * Handles the navigation to the legislation page
   */
  const onNavigateLegislationHandler = () => {
    const payload = composeLegislationNavigatorPayload(
      state.filters,
      user.profile.job_role_list
    );
    store(NAVIGATOR_FILTER_PAYLOAD_ID, payload, { permanent: false });

    if (!payload.job_role_list.length && !Object.keys(payload.selectors).length) {
      appDispatch(appActions.updateTourStep({ tour: 'initial' }));
      return;
    }

    appDispatch(appActions.updateTourStep({ tour: 'roles' }));
    mutateRoleContent(payload);
  };


  /**
   * Set the navigator legislation data
   */
  useEffect(() => {
    if (!roleContentData?.errors?.length && isSuccess) {
      const { results } = roleContentData;
      const  filtered = results.filter((nav: NavigatorLegislation) => isMatchedSearched(nav.legislation, state.query));
      const filteredNavLegislations = sortNavigatorLegislationData(filtered, state.sortOrder);
      dispatch(stateActions.initState({ navLegislations: results, filteredNavLegislations }));
      navigate(PATH_ROLE_BASED_NAVIGATOR);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);


  return (
    <Fragment>
      {/* Top Content */}
      <TopContent isDetails>
        <h3>Hey, {userFirstName}</h3>
        <p>Navigate and stay up-to-date with tailored sustainability regulations based on your selected role(s):
          &nbsp;{userRoles} &nbsp;
        </p>
      </TopContent>

      {/* Aside */}
      <Aside
        user={user}
        onNext={() => {
          appDispatch(appActions.updateTourStep({ tour: 'roles' }));
          updateUserProfileData({ show_guided_tour: false });
        }}
        onPrevious={() => {}}
      >
        <header data-aside-header>
          <h4 className={styles.root__header__title}>Filter</h4>
          <span>Select filters to refine your results</span>
        </header>

        <Filters
          onSideFilterChange={onFilterChangeHandler}
          filters={state.filters}
          userRoles={user.profile.job_role_list}
          data-nav-landing
          data-accordion
        >
        <ButtonSet data-aside-button>
          <Button
            type='button'
            variant="primary"
            onClick={onNavigateLegislationHandler}
            disabled={isActiveFiltersEmpty}
          >
            Navigate legislation
          </Button>
        </ButtonSet>
        </Filters>
      </Aside>

      {/* Main content */}
      <section className={styles.root} data-main-content data-show-guide={user.show_guided_tour}>
        <IconComponent name="EmptyNavigator" data-empty-icon />
        <div className={styles.root__searchempty}>
          <IconComponent name="SearchEmptyState" />
        </div>
        <h6 className={styles.root__searchemptytext}>
          Select your preferred filters to navigate legislations relevant to you and your defined role(s)
        </h6>
      </section>
    </Fragment>
  );

};

export default withNavigatorHocs(NavigatorLayout);

