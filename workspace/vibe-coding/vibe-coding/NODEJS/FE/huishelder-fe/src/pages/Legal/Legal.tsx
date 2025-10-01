import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './Legal.module.scss';

/**
 * Legal component that serves as a wrapper for all legal-related pages
 * Provides consistent styling and structure across all legal pages
 * No longer includes Layout to avoid duplicate headers and footers
 */
const Legal: React.FC = () => {
  return (
    <div className={styles.legalPage}>
      <div className={styles.container}>
        <div className={styles.legalContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Legal;
