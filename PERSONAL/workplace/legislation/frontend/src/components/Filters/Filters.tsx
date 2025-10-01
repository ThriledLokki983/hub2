import { useState, Fragment, useMemo } from 'react'
import { uuid } from '@grrr/utils';
import { Accordion, AccordionItem, Checkbox, Loader } from 'components';

import { FiltersProps } from './Filters.interface';
import { Filter } from "hooks/interfaces/legislation.interface";

const Filters = ({
  onSideFilterChange,
  userRoles = [],
  filters = [],
  children,
  ...rest
}: FiltersProps) => {

  const legislationFilterAccordionId = useMemo(() => uuid(), []);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);


  /**
   * Handles accordion click event
   * @param activeKeys
   */
  const onClickAccordion = (activeKeys: string[]) => {
    setActiveKeys(activeKeys);
  };


  /**
   * Handles checkbox change event
   */
  const checkboxChangeHandler = (checked: boolean, option: Filter, name: string) => {
    if (typeof onSideFilterChange === 'function' && onSideFilterChange !== undefined) {
      onSideFilterChange(checked, option, name);
    }
  };


  return (
    <Fragment>
      <Accordion
        multiple={false}
        activeKeys={activeKeys}
        accordionId={`filter-accordion-${legislationFilterAccordionId}`}
        onClick={onClickAccordion}
        {...rest}
      >
        {filters.length ? filters.map((filter) => (
          <AccordionItem
            key={filter.label}
            title={filter.name}
            itemKey={filter.name.toLocaleLowerCase()}
            {...rest}
          >
            <ul>
              {filter.data.map((o, index: number) => (
                <li
                  key={`option-${o.name?.toLocaleLowerCase()}-${index}`}
                  data-checkbox-id={o.identifier}
                  data-hide-value={filter.name.toLowerCase() === 'product or service' && o.name === 'All' && o.label === 'All'}
                >
                  <Checkbox
                    name={o.name}
                    value={o.name}
                    data-is-filter
                    inputId={o.name.toLowerCase()}
                    data-filter-name={o.name}
                    checked={o.is_approved}
                    defaultChecked={o.is_approved}
                    onChange={(checked: boolean, e: any) => {
                      checkboxChangeHandler(checked, filter, o.name)
                    }}
                  >
                    {o.name}
                  </Checkbox>
                </li>
              ))}
              {!filter.data.length && <li data-empty>No options available for filtering</li>}
            </ul>
          </AccordionItem>
        )) : <Loader data-medium /> }
      </Accordion>
      {children}
    </Fragment>
  );

};

export default Filters;
