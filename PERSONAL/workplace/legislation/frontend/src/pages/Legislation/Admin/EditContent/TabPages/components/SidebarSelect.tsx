import { Children, useEffect, useMemo, useRef, useState } from 'react';
import { CustomCheckbox } from 'components';
import { JURISDICTION_KEY } from 'configs/legislation/legislation';

import styles from './SidebarSelect.module.scss';


interface SidebarSelectProps {
  sidebarItems: any[];
  selectedNav: string;
  name: string;
  selectedJurisdictions: string[];
  options?: string[];
  onCheckboxChange: (groupName: string, dataName: string, isChecked: boolean) => void;
  [key: string]: any;
}

// SidebarSelect
const SidebarSelect = ({
  name,
  selectedNav,
  sidebarItems,
  onCheckboxChange,
  options = [],
  selectedJurisdictions = [],
  ...props
}: SidebarSelectProps ) => {
  const checkboxRef = useRef<HTMLDivElement>(null);

  const [optionsToShow, setOptionsToShow] = useState<string[]>(options || []);
  const [selectedJurisdictionsToShow, setSelectedJurisdictionsToShow] = useState<string[]>(selectedJurisdictions || []);

  const [selectedNavIndex, setSelectedNavIndex] = useState<string>(selectedNav ||'europe');
  const activeDataIndex = useMemo(
    () => {
      const activeItem = sidebarItems.find((item) => item.identifier === selectedNavIndex);
      if (activeItem) {
        const uniqueCountries = Array.from(new Set(activeItem.countries));
        return {
          ...activeItem,
          countries: uniqueCountries,
        };
      }
      return null;
    },
    [selectedNavIndex, sidebarItems]
  );

  /**
   * Handle Nav Tab click.
   */
  const navTabClickHandler = (e: any) => {
    const index = e.currentTarget.getAttribute('data-filter-index');
    setSelectedNavIndex(index);
    e.preventDefault();
  };

  useEffect(() => {
    if (options.length > 0) {
      setOptionsToShow(options);
    } else {
      setOptionsToShow(activeDataIndex?.countries || []);
    }

    if (selectedJurisdictions.length > 0) {
      setSelectedJurisdictionsToShow(selectedJurisdictions);
    }
  }, [activeDataIndex?.countries, options, selectedJurisdictions]);


  /**
   * Set the countries whe the activeDataIndex changes
   */
  useEffect(() => {
    setOptionsToShow(activeDataIndex?.countries || []);
  }, [activeDataIndex?.countries, selectedNavIndex]);


  return (
    <div className={styles.root} {...props}>
      <nav className={styles.root__tabpanelnav} {...props}>
        <ul data-nav {...props}>
          {sidebarItems.map((role: any, index: number) => (
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
      <article className={styles.root__tabpanelcontent}>
        <div ref={checkboxRef} {...props}>
          {Children.toArray(optionsToShow.map((country: string) => {
            const isChecked = selectedJurisdictionsToShow.map(c => c.toLowerCase()).includes(country.toLowerCase());
            return (
              <CustomCheckbox
                isSelected={isChecked}
                onChange={(isChecked) => {
                  onCheckboxChange(JURISDICTION_KEY, country, isChecked);
                  setSelectedJurisdictionsToShow((prev) => {
                    if (isChecked) {
                      return [...prev, country];
                    }
                    return prev.filter((i) => i.toLowerCase() !== country.toLowerCase());
                  });
                }}
                {...props}
              >
                <span data-inner-content>{country}</span>
              </CustomCheckbox>
            );
          }))}
        </div>
      </article>
    </div>
  );

};

export default SidebarSelect;
