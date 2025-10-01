import { FilterSortProps } from './FilterSort.interface';
import { useState } from 'react'

import { Button, ReadOnlySelect } from '..';

import BubbleSort from 'assets/icons/bubble-sort-outline.svg?react';
import styles from './FilterSort.module.scss';

const FILTER_OPTIONS = ['Last Updated', 'Created Date'];


const FilterSort = ({ onSort, onOptionSelect, id = 'date-sort-filter' }: FilterSortProps) => {
  const [sortValue, setSortValue] = useState<string>('desc');

  /**
   * Handle sort change.
   */
  const onSortButtonClickHandler = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLElement;
    const sortValue = target.dataset.sortValue || 'asc';
    setSortValue((prev) => prev === 'asc' ? 'desc' : 'asc');
    onSort(e, sortValue);
  };


  return (
    <div className={styles.root}>
      <ReadOnlySelect
        id={id}
        options={FILTER_OPTIONS}
        name="legislation_filter_combobox"
        onSelect={onOptionSelect}
      />
      <Button
        variation="transparent"
        onClick={onSortButtonClickHandler}
        type='button'
        data-sort-value={sortValue}
        data-active-sort={sortValue === 'asc'}
      >
        <BubbleSort />
      </Button>
      <span></span>
    </div>
  );

};

export default FilterSort
