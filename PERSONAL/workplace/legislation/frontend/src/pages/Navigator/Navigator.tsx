import { Fragment, useMemo, useState, useLayoutEffect, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce, uuid } from '@grrr/utils';

import { isMatchedSearched, remove, restore, store } from 'helpers/utils';
import { composeLegislationNavigatorPayload } from 'helpers/legislations/legislation';

import {
  Aside, TopContent, Filters, Button,
  ButtonSet, BackLink, Icon, Tour,
  SearchFilter, LegislationListCard,
  Accordion, AccordionItem, EmptyLegislationList, Loader,
} from 'components';

import FilterItem from './FilterItem';
import { useQueryApi } from 'hooks';
import { useAppStateContext, useNavigatorContext, useUserContext } from 'contexts';
import { withNavigatorHocs } from 'contexts/NavigatorContext';

import { GET_ROLE_CONTENT, UPDATE_USER } from 'configs/api-endpoints';

import { Filter } from 'hooks/interfaces/legislation.interface';
import { PATH_NAVIGATOR_LANDING } from 'configs/paths';
import {
  NAVIGATOR_FILTER_PAYLOAD_ID,
  ACTIVE_LEGISLATION_FILTERS_ID,
  GUIDED_TOUR_ID,
  JOB_ROLE_KEY,
} from 'configs/legislation/legislation';
import { NavigatorLegislation } from 'hooks/interfaces/navigator.interface';
import { sortNavigatorLegislationData } from 'hooks/reducers/helpers';
import styles from './Navigator.module.scss';

const TOUR_CONTENT = 'The filters are tailored to your pre-selected role(s) of interest. Do you want to change the defined role(s)? Go to the Settings page to change your preferences.';


const Navigator = ({ children }: any) => {

  const navigate = useNavigate();
  const navigatorAccordionId = useMemo(() => uuid(), []);

  const filterData = restore(NAVIGATOR_FILTER_PAYLOAD_ID, { permanent: false }) ?? [];
  const activeFiltersData = restore(ACTIVE_LEGISLATION_FILTERS_ID, { permanent: false });
  const { stateActions: appActions, stateDispatch: appDispatch, showToast } = useAppStateContext();
  const { state: navState, stateDispatch: navDispatch, stateActions: navStateActions } = useNavigatorContext();
  const { user } = useUserContext();
  // all the selected filters
  const allSelectedFilters = useMemo(() => {
    const filters = activeFiltersData || navState.filters;

    return filters.reduce((acc: Filter[], f: Filter) => {
      return acc.concat(f.data.filter((d) => d.is_approved) as any[]);
    }, []);
  }, [activeFiltersData, navState.filters]);

  const { post: getRoleContent } = useQueryApi(GET_ROLE_CONTENT);
  const { patch: updateProfile } = useQueryApi(UPDATE_USER);

  const [activeKeys, setActiveKeys] = useState<string[]>();
  const [isHiding, setIsHiding] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [appFilters, setAppFilters] = useState<Filter[]>([]);

  useEffect(() => {
    if (activeFiltersData?.length > 0) {
      setAppFilters(activeFiltersData);
    } else if (navState.filters?.length > 1) {
      setAppFilters(navState.filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navState.filters, allSelectedFilters.length]);


  /**
   * Filter the filters for only the categories that has any filter(s) already approved/checked
   */
  const activeFilters = useMemo(() => {
    const filters: Filter[] = activeFiltersData || navState.filters;
    return filters
      ?.filter((_f) => _f.data.some((d) => d.is_approved ? true : false))
      ?.map((f) => ({
        ...f,
        data: f.data.filter((_d) => _d.is_approved)
      }))
  }, [activeFiltersData, navState.filters]);


  const { data: userData, mutate: updateUser } = updateProfile();
  const { data: roleContentData, mutate: mutateRoleContent, isSuccess, isPending } = getRoleContent();


  /**
   * Handles accordion click event
   */
  const onClickAccordion = (activeKeys: string[]) => {
    setActiveKeys(activeKeys);
  };


  /**
   * Handles the filter change
   */
  const onFilterChangeHandler = (checked: boolean, filterOption: Filter, name:string) => {
    setIsFiltering(true);
    navDispatch(navStateActions.setActiveFilters(checked, filterOption, name ?? ''));
  };


  /**
   * Handle close/remove clicks.
   */
  const removeHandler = (id: string) => {
    const filterOption = navState.filters.find((f) => {
      return f.data.some((d) => d.identifier === id)
    });

    if (filterOption) {
      setIsFiltering(true);
      const name = filterOption.data.find((d) => d.identifier === id)?.name;
      navDispatch(navStateActions.setActiveFilters(false, filterOption, name));
      return;
    }
    console.warn('could not find the filter option to be updated........')
  };


  /**
   * Handle search input updates and fetch new queries.
   */
  const onSearch = (e: any) => {
    const query = e.target.value;
    navDispatch(navStateActions.setQuery(query || ''));
  };


  /**
   * Reset state if there's a unique `id` provided and it changes.
   */
  useLayoutEffect(() => {
    setIsHiding(isHiding);
    setIsHidden(isHidden);
  }, [isHidden, isHiding, navState.filters]);


  /**
   * List of roles for the user
   */
  const userRoles = useMemo(() => {
    const jobRoles = user.profile.job_role_list;

    return user.is_admin ? [] : jobRoles.map((role, index) => (
      <Fragment key={role.name}>
        <span className={styles.root__jobrole}>{role.name}{index < jobRoles.length - 1 ? ',' : ''}&nbsp;</span>
      </Fragment>
    ));
  }, [user]);

  const jobRoles = useMemo(() => appFilters.find(f => f.label === JOB_ROLE_KEY)?.data, [appFilters]);


  /**
   * Function to take care of the payload composition
   * @returns
   */
  const getSelectPayload = () => {
    const roles = appFilters.length > 0 ? jobRoles || [] : user.profile.job_role_list;
    const payload = composeLegislationNavigatorPayload(
      appFilters,
      roles,
    );

    store(NAVIGATOR_FILTER_PAYLOAD_ID, payload, { permanent: false });
    return payload;
  };


  /**
   * Debounce mutation call to avoid multiple calls on filter change
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceMutationCall = useCallback(
    debounce((payload) => {
      // reset();
      mutateRoleContent(payload);
    }, 1000)
    ,[]
  );


  /**
   * Handles the navigation to the legislation page
   */
  const onNavigateLegislationHandler = () => {
    setIsFiltering(true);
    const payload = getSelectPayload();
    if (!Object.keys(payload.selectors).length) {
      return;
    }

    if (!Object.keys(payload.selectors).length) {
      appDispatch(appActions.updateTourStep({ tour: 'initial' }));
      showToast({
        type: 'info',
        title: 'No filter selected',
        message: 'Please add at least one filter before clicking on Navigate Legislation button',
        active: true,
        persistent: false,
      });

      return;
    }

     // Update the ref with the latest payload
    debounceMutationCall(payload);
  };


  /**
   * Set navigator legislation data
   */
  useEffect(() => {
    // Go back to the landing page if there is not filtered data
    if (!Object.keys(filterData.selectors).length && navState.navLegislations.length === 0) {
      navigate(PATH_NAVIGATOR_LANDING);
    } else {
      if (!roleContentData?.errors?.length && isSuccess && !isFiltering) {
        const { results } = roleContentData;
        const  filtered = results.filter((nav: NavigatorLegislation) => isMatchedSearched(nav.legislation, navState.query));
        const filteredNavLegislations = sortNavigatorLegislationData(filtered, navState.sortOrder);
        navDispatch(navStateActions.initState({ navigatorLegislations: results, filteredNavLegislations }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, roleContentData, allSelectedFilters.length, isFiltering]);


   /**
   * Handle sort change.
   */
   const onSortChangeHandler = (e: any) => {
    const target = e.target.closest('button') as HTMLElement;
    const sortValue = target.dataset.sortValue || 'asc';
    navDispatch(navStateActions.setSortOrder(sortValue));
    navDispatch(navStateActions.sortNavLegislations(sortValue));
  };


  /**
   * Dropdown Filter handler
   */
  const onDataFilterHandler = (filterValue: string) => {
    navDispatch(navStateActions.setFilterBy(filterValue));
  };


  /**
   * Handle removing all filters
   */
  const onClearAllHandler = useCallback(() => {
    const updatedFilters = navState.filters.map((f) => ({
      ...f,
      data: f.data.map((d) => ({ ...d, is_approved: false })),
    }));

    remove(ACTIVE_LEGISLATION_FILTERS_ID, { permanent: false })
    navDispatch(navStateActions.initState({ filters: updatedFilters }));
  }, [navDispatch, navStateActions, navState.filters]);



  /**
   * Handle the filtering of the data based on the selected filters
   */
  useEffect(() => {
    if (isFiltering) {
      const roles = appFilters.length > 0 ? jobRoles || [] : user.profile.job_role_list;
      const payload = composeLegislationNavigatorPayload(
        navState.filters,
        roles,
      );

      if (!payload.job_role_list.length && !Object.keys(payload.selectors).length) {
        appDispatch(appActions.updateTourStep({ tour: 'initial' }));
        return;
      }

      debounceMutationCall(payload);
      setIsFiltering(false);
    }

    if (isSuccess && !roleContentData?.errors?.length && !isFiltering) {
      const { results } = roleContentData;
      const  filtered = results.filter((nav: NavigatorLegislation) => isMatchedSearched(nav.legislation, navState.query));
      const filteredNavLegislations = sortNavigatorLegislationData(filtered, navState.sortOrder);

      navDispatch(navStateActions.initState({ navigatorLegislations: results, filteredNavLegislations }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFiltering, isSuccess, roleContentData, navState.filters, navState.navLegislations.length]);


  const showEmptyState = useMemo(() =>
    navState.filteredNavLegislations.length <= 0 && !isFiltering,
    [navState.filteredNavLegislations.length, isFiltering]
  );

  useLayoutEffect(() => {
    if (allSelectedFilters.length <= 0) {
      navigate(PATH_NAVIGATOR_LANDING);
    }
  }, [allSelectedFilters, navigate]);


  return (
    <Fragment>
      {/* Top Content */}
      <TopContent isDetails data-show-guide={user.show_guided_tour && user.show_roles_tour}>
        <BackLink onClick={onClearAllHandler}>Back</BackLink>
        <h3 className={styles.root__title}>Regulatory Compliance Checklist {!user.is_admin ? 'for:' : null}
          &nbsp;{userRoles} &nbsp;
          {navState.filteredNavLegislations.length && !user.is_admin  ? (
            <span className={styles.root__total} data-role-based>{navState.filteredNavLegislations.length}</span>
          ) : (
            <></>
          )}
          {user.show_guided_tour && user.show_roles_tour ? (
            <Tour
              user={user}
              secondButton='Next'
              firstButton='Previous'
              content={TOUR_CONTENT}
              onNext={() => {
                appDispatch(appActions.updateTourStep({ tour: 'filters' }));
              }}
              onPrevious={() => {
                onClearAllHandler();
                appDispatch(appActions.updateTourStep({ tour: 'initial' }));
                navigate(PATH_NAVIGATOR_LANDING);
              }}
              data-bottom-position={activeFilters.reduce((acc, f) => acc + f.data.length, 0) >= 3}
            />
          ): null}
        </h3>
      </TopContent>

      {/* Aside */}
      <Aside data-guide-mode={user?.show_guided_tour} user={user}>
        <header data-aside-header>
          <h4 className={styles.root__header__title}>Filter</h4>
          <span>Select filters to refine your results</span>
        </header>

        <Filters
          onSideFilterChange={onFilterChangeHandler}
          filters={appFilters}
          userRoles={user.profile.job_role_list}
          data-nav-landing
          data-accordion
        >
          <ButtonSet data-aside-button>
            <Button
              variant="primary"
              type='button'
              onClick={onNavigateLegislationHandler}
              disabled={isPending}
            >
              {isPending ? 'Loading...' : 'Navigate Legislation'}
            </Button>
          </ButtonSet>
        </Filters>
      </Aside>

      {/* Main Content */}
      <section className={styles.root} data-main-content data-show-guide={user?.show_guided_tour} data-navigator-accordion>
        <div data-show-guide={user?.show_guided_tour}></div>
        <header className={styles.root__header}>
          <span>Refine the filtering further, may give you more results: </span>
          <div className={styles.root__disclaimer}>
            <Icon name="exclamation-triangle" />
            <span><strong>Disclaimer:</strong>&nbsp;Users advised to verify and cross-reference information.</span>
          </div>
        </header>
        <ul className={styles.root__filters} data-show-guide={user.show_filters_tour}>
          {activeFilters.map((f, index: number) => (
            f.data.map((o) => (
              <FilterItem
                key={`filter-${o.name}-${o.identifier}-${index}`}
                hidden={o.is_approved || false}
                option={o}
                onItemRemove={removeHandler}
              />
            ))
          ))}
          {user.show_guided_tour && user.show_filters_tour ?
            <Tour
              user={user}
              secondButton='Next'
              firstButton='Previous'
              content={'See the list of your selected filters. Remove filters by clicking on the “ x ” button of each separate tag. '}
              onNext={() => {
                appDispatch(appActions.updateTourStep({ tour: 'role content' }));
              }}
              onPrevious={() => {
                appDispatch(appActions.updateTourStep({ tour: 'roles' }));
              }}
              data-filters
              data-top-position={activeFilters.reduce((acc, f) => acc + f.data.length, 0) >= 3}
            />
          : null}
        </ul>

        {/* Search Filter  */}
        <SearchFilter
          onSearch={onSearch}
          onDataSort={onSortChangeHandler}
          onFilterOptionSelect={onDataFilterHandler}
          id={navigatorAccordionId}
          data-navigator-search
        />

        {isPending ? (
          <Loader data-medium />
        ) : showEmptyState ? (
          <EmptyLegislationList showContent={showEmptyState && !user.show_guided_tour} query=""/>
        ) : (
          <Accordion
            multiple={false}
            onClick={onClickAccordion}
            activeKeys={activeKeys}
            accordionId={navigatorAccordionId}
            data-show-guide={user.show_content_tour}
            data-navigator-accordion
          >
            {navState.filteredNavLegislations.map((navLegislation, index: number) => (
              <AccordionItem
                key={navLegislation.legislation?.identifier}
                contentTitle={navLegislation.legislation.name_generic || 'No name available'}
                description={`${navLegislation?.legislation.name_local}` || 'No scope available'}
                itemKey={navLegislation.legislation.identifier}
                query={navState.query}
                isLarge
                data-navigator-accordion
              >
                <LegislationListCard
                  key={navLegislation.legislation.identifier}
                  legislation={navLegislation as any}
                  user={user}
                  query={navState.query}
                  seCurrentLegislation={
                    () => navDispatch(navStateActions.seCurrentLegislation(navLegislation.legislation.identifier))
                  }
                  isListCard={false}
                />
              </AccordionItem>
            ))}

            {/* Tour Guide */}
            <div data-show-guide={user.show_content_tour && navState.navLegislations.length > 0}>
              {user.show_guided_tour && user.show_content_tour && navState.navLegislations.length > 0 ?
                <Tour
                  user={user}
                  secondButton='Close'
                  firstButton='Previous'
                  content={'List of legislations that apply to your filtering selection(s). Expand on each row to see role-specific content per legislation by clicking on a row or the “ + ” button.'}
                  onNext={() => {
                    onNavigateLegislationHandler();
                    appDispatch(appActions.updateTourStep({ tour: 'completed' }));
                    store(GUIDED_TOUR_ID, true, { permanent: true });
                  }}
                  onPrevious={() => {
                    appDispatch(appActions.updateTourStep({ tour: 'filters' }));
                  }}
                  data-top-position
                />
                : null}
            </div>
          </Accordion>
        )}

        {/* Empty message */}
        <EmptyLegislationList showContent={!navState.navLegislations.length && user.show_guided_tour} query={navState.query}>

        {/* Tour Guide */}
        <div data-show-guide={user.show_content_tour && !navState.navLegislations.length}>
          {user.show_guided_tour && user.show_content_tour && !navState.navLegislations.length ?
            <Tour
              user={user}
              secondButton='Close'
              firstButton='Previous'
              content={'List of legislation that apply to your filter selection(s). Expand on each row to see role-specific content per legislation by clicking on a row or the “ + ” button.'}
              onNext={() => {
                onNavigateLegislationHandler();
                appDispatch(appActions.updateTourStep({ tour: 'completed' }));
                store(GUIDED_TOUR_ID, true, { permanent: true });
              }}
              onPrevious={() => {
                appDispatch(appActions.updateTourStep({ tour: 'filters' }));
              }}
              data-top-position
              data-list-content
            />
            : null}
        </div>
        </EmptyLegislationList>
        {children}
      </section>
    </Fragment>

  );

};

export default withNavigatorHocs(Navigator);
