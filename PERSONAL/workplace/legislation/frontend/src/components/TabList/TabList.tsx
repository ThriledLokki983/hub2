import { Children, useMemo, useState } from 'react'

import {Tabs, TabList, Tab, TabPanel, Key} from 'react-aria-components';

import { SearchFilter } from '..';
import { TabListProps } from './TabList.interface';
import { CLIENT_LEGISLATION_COLUMNS, LEGISLATION_COLUMNS } from 'configs/legislation/legislation';
import styles from './TabList.module.scss';


const CustomTabList = ({
  selectedTab = 0,
  setSelectedTab,
  entries = [],
  user,
  distribute = false,
  showSearch = false,
  isEditing = false,
  isLoading = false,
  onFilterOption,
  onTabClick,
  onSearch,
  onDataSort,
  children,
  variant = 'admin-tabs',
  ...props
}: TabListProps) => {


  const [tabLabel, setTabLabel] = useState<Key>('created');
  const isPublishedTab = entries.find((e) => e.label === tabLabel)?.label.toLowerCase() === 'approved';
  const headerColumns = useMemo<string[]>(
    () => variant === "project-tabs" ? ['name', 'review', ''] :
      isEditing ? ['name', ''] : user?.is_preparer || user?.is_approver
      ? [
        ...LEGISLATION_COLUMNS, isEditing ? '' : `${user?.is_approver && isPublishedTab
          ? 'approved at' : `${isPublishedTab ? 'approved at' : 'created at' }`
        }`
      ] : CLIENT_LEGISLATION_COLUMNS,
    [isEditing, user?.is_preparer, user?.is_approver, isPublishedTab, variant]
  );


  return (
    <Tabs
      className={styles.root}
      data-variant={variant}
      data-count={entries.length}
      data-distribute={distribute}
      onSelectionChange={setTabLabel}
      {...props}
    >
      <TabList aria-label={`Tablist`} className={styles.root__tablist} >
        {Children.toArray(entries.map(({ label, count }, index) => (
          <Tab id={label || ''} key={`${label}-${index + count}`}>
            <span>{label}</span>
            {count ? <strong>{count}</strong> : ''}
          </Tab>
        )))}
      </TabList>

      {showSearch ? (
        <section className={styles.root__extra}>
          <SearchFilter
            id={"Search-filter"}
            onSearch={onSearch}
            onDataSort={onDataSort}
            onFilterOptionSelect={onFilterOption}
          />
          <div
            className={styles.root__title}
            data-user-is-admin={user.is_approver || user.is_preparer}
            data-is-editing={isEditing}
            data-variant={variant}
          >
            {entries[selectedTab]?.entries.length ? headerColumns.map((title: string, index: number) => (
              <span key={`title-${title}-${index+20}`}>{title}</span>
            )) : null}
          </div>
        </section>
      ) : null}

      {Children.map(children, (child, index) => (
        <TabPanel id={entries[index].label} className={styles.root__tabs}>
          {child}
        </TabPanel>
      ))}
    </Tabs>
  )

};

export default CustomTabList
