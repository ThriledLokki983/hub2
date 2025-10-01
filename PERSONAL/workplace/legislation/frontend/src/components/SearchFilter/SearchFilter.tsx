import React from 'react'

import { SearchField, FilterSort, } from '..';

import { SearchFilterProps } from './SearchFilter.interface';
import styles from './SearchFilter.module.scss'


const SearchFilter = ({ onSearch, onDataSort, onFilterOptionSelect, id = '', ...props }: SearchFilterProps) => {
  return (
    <div className={styles.root__search} {...props}>
      <SearchField
        id={`search-filter-${id}`}
        label="Search legislation"
        name="search_legislation"
        onSearch={onSearch!}
        scrollOnFocus
      />
      <FilterSort
        id={`search-filter-sort-${id}`}
        label="Relevance"
        name='relevance'
        onSearch={onSearch}
        onSort={onDataSort}
        onOptionSelect={onFilterOptionSelect}
        scrollOnFocus
      />
  </div>
  );

};

export default SearchFilter;
