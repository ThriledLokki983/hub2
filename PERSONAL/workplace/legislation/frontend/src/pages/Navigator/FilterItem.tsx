import { useState } from 'react'
import { Icon } from 'components';

import styles from './Navigator.module.scss';
import { FilterOption } from 'hooks/interfaces/legislation.interface';

interface FilterItemProps {
  option: FilterOption;
  onItemRemove: (ide: string) => void;
  hidden: boolean;
}


const FilterItem = ({ hidden, option, onItemRemove }: FilterItemProps ) => {

  const [isHiding, setIsHiding] = useState(false);
  const [isHidden, setIsHidden] = useState(hidden);

  /**
   * Handle close/remove clicks.
   */
  const removeHandler = () => {
    setIsHiding(true);
    window.setTimeout(() => setIsHidden(true), 500);
    onItemRemove(option.identifier);
  };

  return (
    <li key={option.identifier} className={styles.root}>
      <span data-label={option.label?.toLowerCase() || option.name.toLowerCase()}>{option.label}</span>
      <button
        className={styles.root__remove}
        type="button"
        onClick={removeHandler}
        aria-label={`Close warning`}
        title={`Remove: '${option.label}' filter`}
        data-filter-id={option.id}
        data-label={option.label?.toLowerCase() || option.name.toLowerCase()}
      >
        <Icon name="cross-fill" color="currentColor" />
      </button>
    </li>
  )
}

export default FilterItem
