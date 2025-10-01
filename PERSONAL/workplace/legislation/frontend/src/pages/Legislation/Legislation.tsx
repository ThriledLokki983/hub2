import { Fragment, useState, useRef, useLayoutEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { remove } from 'helpers/utils';

import { useLegislationContext } from 'contexts';
import { withLegislationHocs } from 'contexts/LegislationContext';

// Pages
import ClientPage from './Client/ClientLegislationContent';
import AdminPage from './Admin/AdminLegislationContent';
import { OutletContextProps } from './interfaces';
import { Filter } from 'hooks/interfaces/legislation.interface';
import { ACTIVE_LEGISLATION_FILTERS_ID } from 'configs/legislation/legislation';
import styles from './Legislation.module.scss';


const Legislation = ({ children }: any) => {

  const adminPageRef = useRef<HTMLDivElement | null >(null);

  const { user } = useOutletContext<OutletContextProps>();
  const { state, stateDispatch, stateActions, refetch, isLoading } = useLegislationContext();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [appFilters, setAppFilters] = useState<Filter[]>(state.filters);

  // Set the filter state
  useLayoutEffect(() => {
    if (state.filters.length > 1) {
      setAppFilters(state.filters);
    }
  }, [state.filters.length, state.filters]);


  /**
   * Handles changing the filter
   */
  const onFilterChangeHandler = (checked: boolean, filterOption: Filter, name:string) => {
    stateDispatch(stateActions.setActiveFilters(checked, filterOption, name ?? ''));
  };


  /**
   * Handle search input updates and fetch new queries.
  */
  const legislationSearchChangeHandler = (e: any) => {
    const query = e.target.value;
    stateDispatch(stateActions.setQuery(query || ''));
  };


  /**
   * Handle close/remove clicks.
   */
  const removeHandler = (id: string) => {
    const filterOption = state.filters.find((f) => {
      return f.data.some((d) => d.identifier === id)
    });

    if (filterOption) {
      const name = filterOption.data.find((d) => d.identifier === id)?.name;
      stateDispatch(stateActions.updateActiveFilters(false, filterOption, name));
      return;
    }
    console.warn('could not find the filter option to be updated........')
  };


  // go to the navigator page with the selected filters
  const onEditButtonClick = (e: any, id: string) => {
    if (!document.startViewTransition) {
      if (adminPageRef.current) {
        adminPageRef.current.classList.toggle(`${styles.root__toggle}`);
      }
    } else {
      document.startViewTransition(() => {
        if (adminPageRef.current) {
          adminPageRef.current.classList.toggle(`${styles.root__toggle}`);
        }
      })
    }
    e && e.preventDefault();
    stateDispatch(stateActions.seCurrentLegislation(id));
    setIsEditing(true);
  };


  /**
   * Handle sort change.
   */
  const onSortChangeHandler = (e: any) => {
    const target = e.target.closest('button') as HTMLElement;
    const sortValue = target.dataset.sortValue || 'asc';
    stateDispatch(stateActions.setSortOrder(sortValue));
    stateDispatch(stateActions.sortLegislations('legislations', sortValue));
  };


  /**
   * Handle removing all filters
   */
  const onClearAllHandler = useCallback(() => {
    const updatedFilters = appFilters.map((f) => ({
      ...f,
      data: f.data.map((d) => ({ ...d, is_approved: false })),
    }));

    remove(ACTIVE_LEGISLATION_FILTERS_ID, { permanent: false })
    stateDispatch(stateActions.initState({ filters: updatedFilters }));
  }, [appFilters, stateActions, stateDispatch]);

  /**
   * Dropdown Filter handler
   */
  const onDropdownFilterHandler = (filterValue: string) => {
    stateDispatch(stateActions.setFilterBy(filterValue));
  };


  return (
    <Fragment>
      {!user.is_approver && !user.is_preparer ? (
        <ClientPage
          type='CLIENT'
          user={user}
          tabs={state.legislationTabs}
          query={state.query}
          filters={appFilters}
          isLoading={isLoading}
          onSort={onSortChangeHandler}
          onRemove={removeHandler}
          onClearFilters={onClearAllHandler}
          onSideFilterChange={onFilterChangeHandler}
          onFilterOption={onDropdownFilterHandler}
          onSearchChange={legislationSearchChangeHandler}
        />
      ) : null}

      {user.is_approver || user.is_preparer ? (
        <AdminPage
          type='ADMIN'
          user={user}
          query={state.query}
          legislation={state.current}
          filters={appFilters}
          tabs={state.legislationTabs}
          isEditing={isEditing}
          isLoading={isLoading}
          setIsEditing={setIsEditing}
          onRemove={removeHandler}
          onSideFilterChange={onFilterChangeHandler}
          onFilterOption={onDropdownFilterHandler}
          onSort={onSortChangeHandler}
          onSearchChange={legislationSearchChangeHandler}
          refetchLegislations={refetch}
          onEdit={onEditButtonClick}
          onClearFilters={onClearAllHandler}
          ref={adminPageRef}
        />
      ) : null}
    </Fragment>
  );

};

export default withLegislationHocs(Legislation);

