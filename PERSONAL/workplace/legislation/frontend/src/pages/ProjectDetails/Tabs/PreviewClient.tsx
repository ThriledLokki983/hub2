import { useEffect, useMemo, useState } from "react";
import { EditComponentProps } from "./interface";
import useUserContext from "contexts/UserContext";
import useQueryApi from "hooks/useQueryApi";
import { GET_ROLE_CONTENT } from "configs/api-endpoints";
import { Filter } from "hooks/interfaces/legislation.interface";
import { composeLegislationNavigatorPayload } from "helpers/legislations/legislation";
import { NAVIGATOR_FILTER_PAYLOAD_ID } from "configs/legislation/legislation";
import { store } from "helpers/utils";

const PreviewClient = ({ selectedIndex, project, filters = [] }: EditComponentProps) => {

  const { user } = useUserContext();
  // const { state, stateDispatch: dispatch, stateActions } = useNavigatorContext();
  const isActiveFiltersEmpty = filters.map((f) => f.data.every((o) => !o.is_approved)).every((c) => c);


  const { post: getRoleContent } = useQueryApi(GET_ROLE_CONTENT);
  const { data: roleContentData, mutate: mutateRoleContent, isSuccess, isPending } = getRoleContent();

  // State
  const [LegislationRoleContent, setLegislationRoleContent] = useState<any[]>([])
  const [activeKeys, setActiveKeys] = useState<string[]>();

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
    // dispatch(stateActions.setActiveFilters(checked, filterOption, name ?? ''));
  };

  /**
   * Filter the filters for only the categories that has any filter(s) already approved/checked
   */
  const activeFilters = useMemo(() => {
    return filters
      ?.filter((_f) => _f.data.some((d) => d.is_approved ? true : false))
      ?.map((f) => ({
        ...f,
        data: f.data.filter((_d) => _d.is_approved)
      }))
  }, [filters]);


  /**
   * Handles the navigation to the legislation page
   */
  const onNavigateLegislationHandler = () => {
    const payload = composeLegislationNavigatorPayload(
      filters,
      [] // Empty because the ADMIN is looking at this now
    );
    store(NAVIGATOR_FILTER_PAYLOAD_ID, payload, { permanent: false });

    if (!payload.job_role_list.length && !Object.keys(payload.selectors).length) {
      return;
    }
    mutateRoleContent(payload);
  };


  /**
   * Set the navigator legislation data
   */
  useEffect(() => {
    if (!roleContentData?.errors?.length && isSuccess) {
      // const { results } = roleContentData;
      // const  filtered = results.filter((nav: NavigatorLegislation) => isMatchedSearched(nav.legislation, query));
      // const filteredNavLegislations = sortNavigatorLegislationData(filtered, sortOrder);
      // dispatch(stateActions.initState({ navLegislations: results || [], filteredNavLegislations }));
      // setLegislationRoleContent(results);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);


  /**
   * Handle close/remove clicks.
   */
  const removeHandler = (id: string) => {
    const filterOption = filters.find((f) => {
      return f.data.some((d) => d.identifier === id)
    });

    if (filterOption) {
      const name = filterOption.data.find((d) => d.identifier === id)?.name;
      // dispatch(stateActions.setActiveFilters(false, filterOption, name));
      return;
    }
    console.warn('could not find the filter option to be updated........')
  };

  /**
   * Handle search input updates and fetch new queries.
   */
  const onSearch = (e: any) => {
    const query = e.target.value;
    // dispatch(stateActions.setQuery(query || ''));
  };

  /**
   * Handle sort change.
   */
  const onSortChangeHandler = (e: any) => {
    const target = e.target.closest('button') as HTMLElement;
    const sortValue = target.dataset.sortValue || 'asc';
    // dispatch(stateActions.setSortOrder(sortValue));
    // dispatch(stateActions.sortNavLegislations(sortValue));
  };


  /**
   * Dropdown Filter handler
   */
  const onDataFilterHandler = (filterValue: string) => {
    // dispatch(stateActions.setFilterBy({ filterValue }));
  };

  return (
    <></>
  );

  // return (
  //   <section className={styles.root__preview_client_view} data-hidden={!(selectedIndex === 4)} data-create-content>
  //     <Aside user={user}>
  //       <header data-aside-header>
  //         <h4 className={styles.root__header__title}>Selector</h4>
  //         <span>Select your fields of interest</span>
  //       </header>

  //       <Filters
  //         onSideFilterChange={onFilterChangeHandler}
  //         filters={filters}
  //         // This is empty bcos the admin does not need it -- it just a preview of what the client will see
  //         userRoles={[]}
  //         data-nav-landing
  //         data-accordion
  //       >
  //         <ButtonSet data-aside-button>
  //           <Button
  //             type='button'
  //             variant="primary"
  //             onClick={onNavigateLegislationHandler}
  //             disabled={isActiveFiltersEmpty}
  //           >
  //             Navigate legislation
  //           </Button>
  //         </ButtonSet>
  //       </Filters>
  //     </Aside>

  //     {/* Main Content on the Left */}
  //     {!isPending && !isSuccess && !LegislationRoleContent.length ? (
  //       <article data-legislation-content data-empty-state>
  //         <IconComponent name="EmptyNavigator" data-empty-icon />
  //         <div className={styles.root__searchempty}>
  //           <IconComponent name="SearchEmptyState" />
  //         </div>
  //         <h6 className={styles.root__searchemptytext}>
  //           Select your preferred filters to navigate legislations relevant to you and your defined role(s)
  //         </h6>
  //       </article>
  //     ) : (
  //       <article data-legislation-content>
  //          <header>
  //           <span>Refine the filtering further, may give you more results: </span>
  //           <div>
  //             <Icon name="exclamation-triangle" />
  //             <span><strong>Disclaimer:</strong>&nbsp;Users advised to verify and cross-reference information.</span>
  //           </div>
  //         </header>
  //         <ul className={styles.root__filters} data-show-guide={user.show_filters_tour}>
  //           {activeFilters.length ? Children.toArray(activeFilters.map((f: Filter, index: number) => (
  //             Children.toArray(f?.data.map((o) => (
  //               <FilterItem
  //                 hidden={o.is_approved || false}
  //                 option={o}
  //                 onItemRemove={removeHandler}
  //               />
  //             ))
  //           )))) : null}
  //         </ul>
  //         {/* Search Filter  */}
  //         <SearchFilter
  //           onSearch={onSearch}
  //           onDataSort={onSortChangeHandler}
  //           onFilterOptionSelect={onDataFilterHandler}
  //           id={clientProjectAccordionId}
  //         />

  //         {state.navLegislations.length ? (
  //           <Accordion
  //             multiple={false}
  //             onClick={onClickAccordion}
  //             activeKeys={activeKeys}
  //             accordionId={clientProjectAccordionId}
  //             data-show-guide={false}
  //           >
  //             {state.navLegislations.length ? Children.toArray(state.navLegislations.map((navLegislation, index: number) => (
  //               <AccordionItem
  //                 contentTitle={navLegislation.legislation.name_local || 'No name available'}
  //                 description={`Type: ${navLegislation?.legislation?.scope}` || 'No scope available'}
  //                 itemKey={navLegislation.legislation.identifier}
  //                 query={state.query}
  //                 isLarge
  //               >
  //                 <LegislationListCard
  //                   key={navLegislation.legislation.identifier}
  //                   legislation={navLegislation as NavigatorLegislation}
  //                   user={user}
  //                   query={state.query}
  //                   seCurrentLegislation={
  //                     () => dispatch(stateActions.seCurrentLegislation(navLegislation.legislation.identifier))
  //                   }
  //                   isListCard={false}
  //                 />
  //               </AccordionItem>
  //             ))) : null}
  //           </Accordion>
  //         ) : null }
  //         {/* Empty message */}
  //         <EmptyLegislationList showContent={!state.navLegislations.length} query={state.query}></EmptyLegislationList>
  //       </article>
  //     )}
  //   </section>
  // );

};

export default PreviewClient;
