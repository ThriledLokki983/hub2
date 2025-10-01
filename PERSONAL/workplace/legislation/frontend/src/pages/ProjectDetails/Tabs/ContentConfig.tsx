import React, { Children, Fragment, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { getRelativeDateTime } from "helpers/dateTime";
import { composeProjectUrl, formatAndExtractAllAttributes } from "helpers/projects/projects";
import { EMPTY_ATTRIBUTES } from "configs/project/project";

import { Button, EmptyLegislationList, IconComponent, Loader, TabList } from "components/index";

import { Legislation, UserInterface } from "hooks/interfaces";
import { EditComponentProps } from "./interface";
import { ConfigLegislation, SelectedAttributes } from "hooks/interfaces/project.interface";
import { LegislationTabs } from "pages/ProjectEdit/Tabs/interfaces";
import Card from "pages/ProjectEdit/Tabs/ContentConfigEditTab/Card";

import styles from "../Index.module.scss";


const ContentConfig = ({
  user,
  project,
  selectedIndex,
  isPending = false,
  setIsEditing,
  isEditing,
  clientLegislations = [],
  setCurrentEditCard,
  helperFn = {
    onSort: () => {},
    onSearch: () => {},
    onDropDown: () => {},
  },
  filteredList = [],
  query = '',
}: EditComponentProps & {
  user: UserInterface,
  isPending?: boolean;
  clientLegislations?: ConfigLegislation[];
  helperFn?: {
    onSort: (e: SyntheticEvent<Element, Event>) => void;
    onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDropDown: (filterValue: string) => void;
  };
  filteredList?: LegislationTabs[];
  query?: string;
  setCurrentEditCard: (legislation: Legislation) => void;
  setIsEditing: (isEditing: boolean) => void;
  isEditing: boolean;
}) => {

  const [selectedTab, setSelectedTab] = useState(0);
  const [allSelectedAttributes, setAllSelectedAttributes] = useState<SelectedAttributes>(EMPTY_ATTRIBUTES);


  /**
   * Extract all unique attributes from the associated legislations
   */
  useEffect(() => {
    if (!clientLegislations.length || selectedIndex !== 3) return;
    const data = formatAndExtractAllAttributes(clientLegislations?.map((l: any) => l.legislation));
    setAllSelectedAttributes(data);
  }, [clientLegislations, selectedIndex]);


  /**
   * Get the relative date for the legislation
   * @param legislation
   * @returns
   */
  const getRelativeDate = (legislation: any) => {
    const { value, label } = getRelativeDateTime(legislation.created_at || '', { includeTime: true });
    return `${value} ${label} ago`;
  };


  /**
   * Get the total count of the legislations
   */
  const totalLegislationCount = useMemo(() => filteredList.reduce((acc, tab) => acc + tab.count, 0), [filteredList]);


  return (
    <section
      className={styles.root__content_configuration}
      data-hidden={!(selectedIndex === 3)}
      data-is-empty={!clientLegislations.length}
      data-create-content
    >

      {/* Aside */}
      <aside>
        <header>
          <h6>Selected attributes</h6>
        </header>
        {Children.toArray(Object.keys(allSelectedAttributes).map((key: string) => (
          <ul>
            <span>{allSelectedAttributes[key].label}</span>
            {!allSelectedAttributes[key].data.length && isPending ? (
              <li> <Loader /></li>
            ) : null}
            {Children.toArray(allSelectedAttributes[key].data?.sort((a, b) => a.name.localeCompare(b.name))
              .map((att) => ({ ...att, name: att.name.slice(0, 42)})).map((attribute: any) => (
              <li>
                <span>{attribute?.name}</span>
              </li>
            )))}
            {allSelectedAttributes[key].data.length ? (
              null
            ) : (
              <li data-empty><small>No attributes available for this group.</small></li>
            )}
          </ul>
        )))}
      </aside>

      {/* Legislation List */}
      <article data-legislation-content>
        <header>
          <h6>
            Configured legislation list
            &nbsp;| <span>{totalLegislationCount || 0} result{totalLegislationCount > 1 ? 's' : ''}</span>
          </h6>
        </header>

        <div data-legislation-list>
          <TabList
            user={user}
            query={query}
            entries={filteredList}
            onDataSort={helperFn.onSort}
            isEditing={false}
            selectedTab={selectedTab}
            onSearch={helperFn.onSearch}
            setSelectedTab={setSelectedTab}
            onFilterOption={helperFn.onDropDown}
            variant="project-tabs"
            showSearch
          >
            {filteredList.map((tab, index) => (
                <Fragment key={index}>
                  {isPending ?  <Loader data-details /> : (
                    <ul data-tab-list>
                      {Children.toArray(tab.entries.length ? tab.entries.map((configLeg: any, _i: number) => (
                        <Card
                          user={user}
                          query={query}
                          configLeg={configLeg}
                          setIsEditing={setIsEditing}
                          setCurrentEditCard={setCurrentEditCard}
                          isFiltering={false}
                          type="details"
                        />
                      )) : (
                        <EmptyLegislationList showContent={tab.entries.length === 0} query={query} />
                      ))}
                    </ul>
                  )}
                </Fragment>
              ))}
            </TabList>
        </div>
      </article>
    </section>
  );

};

export default ContentConfig;
