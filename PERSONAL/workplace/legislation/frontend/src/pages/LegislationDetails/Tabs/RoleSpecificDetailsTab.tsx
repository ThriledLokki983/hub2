import { useState, useMemo, useEffect, Children } from 'react';

import { Accordion, AccordionItem, Aside } from 'components';
import { Filter } from 'hooks/interfaces/legislation.interface';
import { AdminData, Legislation } from 'hooks/interfaces';
import EmptyRolesIcon from 'assets/icons/empty-roles.svg?react';
import useUserContext from 'contexts/UserContext';
import { JOB_ROLE_KEY } from 'configs/legislation/legislation';
import styles from '../LegislationDetails.module.scss';

const DEFAULT_DETiLS = { identifier: '', data: '', details: [], name: '', title: '' };

interface RoleSpecificBasedProps {
  legislation: Legislation;
  adminData: AdminData;
  showContent: boolean;
  selectedNav: string;
  jobRoleData: any;
  isFirstTab: boolean;
  filters: Filter[];
  isEditing: boolean;
  data: Legislation;
  setIsEditing?: (val: boolean) => void;
}

interface NavDetails {
  identifier: string;
  data: any;
  details: any[];
  name: string;
  title: string;
}


const RoleSpecificDetailsTab = ({
  showContent,
  jobRoleData,
  selectedNav,
  isFirstTab,
  filters,
  data,
}: RoleSpecificBasedProps) => {

  const { user } = useUserContext();
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [navDetails, setNavDetails] = useState<NavDetails>(DEFAULT_DETiLS);
  const [selectedNavIndex, setSelectedNavIndex] = useState(selectedNav);

  // check if the Job roles is completely empty
  const isEmptyJobRoles = useMemo(() => {
    return jobRoleData?.length === 0;
  }, [jobRoleData?.length]);


  /**
   * Handles accordion click event
   * @param activeKeys
   */
  const onClickAccordion = (activeKeys: string[]) => {
    setActiveKeys(activeKeys);
  };


  /**
   * Set the value for the selected nav
   */
  useEffect(() => {
      setSelectedNavIndex(selectedNav);
  }, [jobRoleData, selectedNav]);

  // set thew active keys
  useEffect(() => {
    const detailsData = jobRoleData?.find((role: any) => role.identifier === selectedNavIndex);

    if (detailsData && detailsData?.details?.length) {
      setActiveKeys([detailsData.details[0].title.toLowerCase()]);
    }
  }, [jobRoleData, selectedNavIndex])


  /**
   * Get the current nav tab details.
   */
  useEffect(() => {

    if (jobRoleData?.length) {
      const foundDetails = jobRoleData?.find((role: any) => role.identifier === selectedNavIndex);
      if (foundDetails) {
        return setNavDetails(foundDetails);
      } else {
        return setNavDetails(jobRoleData?.at(0));
      }
    }
  }, [jobRoleData, jobRoleData?.length, selectedNavIndex]);


  // Get the job roles
  const jobRoles = useMemo(
    () => filters
      .find((f) => f.label === JOB_ROLE_KEY)
      ?.data.map((d) => ({
        ...d,
        data: jobRoleData?.find((role: any) => role.name.toLowerCase() === d.name.toLowerCase()),
      })) || [],
    [filters, jobRoleData]
  );


  /**
   * Handle Nav Tab click.
   */
  const navTabClickHandler = (e: any) => {
    const index = e.currentTarget.getAttribute('data-filter-index');
    setSelectedNavIndex(index);
    e.preventDefault();
  };


  /**
   * Show the details if the selectedNavIndex is the same as the navDetails identifier
   */
  const showDetails = useMemo(() => selectedNavIndex === navDetails?.identifier, [selectedNavIndex, navDetails]);

  return (
    <article hidden={!showContent} className={styles.root__details}>
      <div className={styles.root__intro}>
        <div className={styles.root__role_content}>
          <div className={styles.root__detailrow}>
            <span data-title>background</span>
            <span data-subtitle>{data?.background || 'No background provided for this legislation.'}</span>
          </div>
          <div className={styles.root__detailrow}>
            <span data-title>risk of non compliance</span>
            <span data-subtitle data-is-empty={!data?.non_compliance_risk?.length}>{data?.non_compliance_risk || 'No known risk of non compliance to this legislation.'}</span>
          </div>
        </div>
      </div>
      <div className={styles.root__roles}>
        {/* Aside */}
        {isEmptyJobRoles ? null : (
          <Aside data-first-tab={isFirstTab} data-details user={user}>
            <header className={styles.root__header}>
              <h4 className={styles.root__header__title}>Identified roles:</h4>
            </header>

            {/* Sidebar Navigation */}
            <nav className={styles.root__tabpanelnav}>
              <ul data-nav>
                {jobRoles.filter((role) => role.data !== undefined).map((role: any, index: number) => (
                  <li
                    className={styles.root__roleitem}
                    role='presentation'
                    key={`role-${role.label}-${index}`}
                    data-id={role.identifier}
                  >
                    <button
                      role="tab"
                      type='button'
                      data-filter-index={role.identifier}
                      id={role.identifier}
                      aria-selected={role.identifier === selectedNavIndex}
                      tabIndex={role.identifier === selectedNavIndex ? 0 : -1}
                      onClick={navTabClickHandler}
                    >
                      <span>{role.label}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 7" fill="none">
                        <path d="M0.846141 1.007C0.717953 1.13519 0.717953 1.34301 0.846141 1.4712L5.99995 6.625L11.1542 1.4712C11.2181 1.40688 11.25 1.32288 11.25 1.23888C11.25 1.15488 11.2181 1.07088 11.1542 1.007C11.026 0.878815 10.8182 0.878815 10.69 1.007L5.99995 5.69705L1.31033 1.007C1.18214 0.878815 0.97433 0.878815 0.846141 1.007"/>
                      </svg>
                    </button>
                  </li>
                ))}
                </ul>
            </nav>
          </Aside>
        )}

        {/* Details expandable */}
        {isEmptyJobRoles ? (
          <article data-empty-roles>
            <div data-icon-block>
              <EmptyRolesIcon />
            </div>
            <h3>There are currently no role specific details for this legislation.</h3>
          </article>
        ) : <Accordion
            multiple={false}
            onClick={onClickAccordion}
            activeKeys={activeKeys}
            data-role-view
            accordionId={navDetails?.identifier}
          >
            {showDetails ? navDetails.details?.map((detail: any, index: number) => {
              return (
                <AccordionItem
                  key={`role-${detail.title?.toLowerCase()}-${index}`}
                  contentTitle={detail?.title}
                  itemKey={detail?.title?.toLowerCase()}
                  data-is-first={index === 0}
                  isLarge
                  data-role-view
                >
                  <div>
                    <ul className={styles.root__notes}>
                      {Children.toArray(detail?.notes?.map((note: any, index: number) => (
                        <li>
                          <div>
                            <span>{index+1}.</span>
                            <span>{note}</span>
                          </div>
                        </li>
                      )))}
                    </ul>
                    {}
                  </div>
                </AccordionItem>
              );
            }) : (
              <AccordionItem
                key={`role-${'no-content'}`}
                description='No content provided'
                itemKey={'no-content'}
                isLarge
                isEmpty
                toggleFromHeaderIconOnly
              >
                <div>
                  <p>No content provided</p>
                </div>
              </AccordionItem>
              )}
        </Accordion>}
      </div>
    </article>
  );

};

export default RoleSpecificDetailsTab;
