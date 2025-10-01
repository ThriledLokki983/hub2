import React from 'react';
import { CustomSelect } from 'components';
import { TimelineFilterBarProps } from './shared';
import styles from './TimelineFilterBar.module.scss';

const TimelineFilterBar: React.FC<TimelineFilterBarProps> = ({ filters, onFilterChange }) => {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'buying', label: 'Buying' },
    { value: 'selling', label: 'Selling' },
    { value: 'shared', label: 'Shared' },
  ];

  const sortOptions = [
    { value: 'due_date', label: 'Due Date' },
    { value: 'status', label: 'Status' },
    { value: 'priority', label: 'Priority' },
  ];

  const handleStatusChange = (value: string) => {
    onFilterChange('status', value);
  };

  const handleCategoryChange = (value: string) => {
    onFilterChange('category', value);
  };

  const handleSortChange = (value: string) => {
    onFilterChange('sortBy', value);
  };

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterGroup}>
        <CustomSelect
          label="Filter by Status"
          options={statusOptions}
          value={filters.status}
          onChange={handleStatusChange}
        />
      </div>

      <div className={styles.filterGroup}>
        <CustomSelect
          label="Filter by Category"
          options={categoryOptions}
          value={filters.category}
          onChange={handleCategoryChange}
        />
      </div>

      <div className={styles.filterGroup}>
        <CustomSelect
          label="Sort By"
          options={sortOptions}
          value={filters.sortBy}
          onChange={handleSortChange}
        />
      </div>
    </div>
  );
};

export default TimelineFilterBar;
