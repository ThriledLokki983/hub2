import { Fragment, useState, useEffect, useMemo } from 'react';
import {
  Aside,
  Button,
  Filters,
  TabList,
  ButtonSet,
  TopContent,
  LegislationListCard,
  EmptyLegislationList,
  Loader,
  Tooltip,
} from 'components';
import FilterItem from 'pages/Navigator/FilterItem';

import { PATH_NAVIGATOR } from 'configs/paths';
import { MAX_FILTER_NUMBER } from 'configs/legislation/legislation';
import { ComponentProps } from '../interfaces';

import styles from '../Legislation.module.scss';


const ClientPage = ({
  user,
  tabs,
  query,
  filters,
  onSort,
  onRemove,
  isLoading,
  onClearFilters,
  onFilterOption,
  onSideFilterChange,
  onSearchChange,
  ...rest
}: ComponentProps) => {

  const [selectedTab, setSelectedTab] = useState(0);

  /**
   * Get only the filters that are actually selected
   */
  const activeFilters = useMemo(
    () => filters
      ?.filter((_f) => _f.data.some((d) => d.is_approved ? true : false))
      ?.map((f) => ({
        ...f,
        data: f.data.filter((_d) => _d.is_approved)
      }))?.map(({ data, ...rest }) => data).flat(),
    [filters]
  );

  const showFilters = useMemo(() => activeFilters.length > 0, [activeFilters]);

  /**
   * Auto select the tab which has entries.
   */
  useEffect(() => {
    const index = tabs.findIndex((entry) => entry.count > 0);
    setSelectedTab(index);
  }, [tabs]);


  return (
    <Fragment>

      {/* Top Content */}
      <TopContent />

      {/* Aside */}
      <Aside user={user}>
        <header data-aside-header data-legislation-page>
          <h4 className={styles.root__header__title}>Filter</h4>
          <span>Select filters to refine your results</span>
        </header>

        <Filters
          onSideFilterChange={onSideFilterChange}
          filters={filters}
          userRoles={user.profile.job_role_list}
          data-leg-list
          data-accordion
        >
          <ButtonSet data-aside-button data-legislation-page>
            <Button variant="primary" url={PATH_NAVIGATOR}>Navigate legislation</Button>
          </ButtonSet>
        </Filters>
      </Aside>

      {/* Main Content */}
      <section className={styles.root} data-main-content data-client-page {...rest}>
        <header className={styles.root__header}>
          <div className={styles.root__filtertop}>
            <h4>List of Legislations</h4>
            {activeFilters.length ? (
              <Tooltip
                content={null}
                delay={0}
              >
                <Button
                  variation="transparent"
                  size="small"
                  onClick={onClearFilters}
                  >
                  Clear all filters
                </Button>
              </Tooltip>
            ) : null }
          </div>
          <ul className={styles.root__filters} data-hidden={activeFilters.length}>
            {activeFilters.slice(0, MAX_FILTER_NUMBER).map((o, _index: number) => (
              <FilterItem
                key={o.name}
                hidden={o.is_approved || false}
                option={o}
                onItemRemove={onRemove}
              />
            ))}
            {activeFilters.length > MAX_FILTER_NUMBER ? (
              <>
                <li data-total-filters>
                  <span>...&nbsp;{activeFilters.length - MAX_FILTER_NUMBER}<strong>+</strong></span>
                </li>
              </>
            ) : null}
          </ul>
          <TabList
            query={query}
            entries={tabs}
            user={user}
            onSearch={onSearchChange}
            onDataSort={onSort}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            onFilterOption={onFilterOption}
            variant='client-tabs'
            showSearch
          >
            {tabs.map((tab, index) => (
              <Fragment key={index}>
                {isLoading ?  <Loader data-details /> : (
                  <ul>
                      {tab.entries.length ? tab.entries.map((legislation: any) => (
                        <LegislationListCard
                          key={legislation.identifier}
                          user={user}
                          legislation={legislation}
                          query={query}
                        />
                      )) : (
                        <EmptyLegislationList showContent={tab.entries.length === 0} query={query} />
                      ) }
                  </ul>
                 )}
              </Fragment>
            ))}
          </TabList>
        </header>
      </section>
    </Fragment>
  );

};

export default ClientPage;
