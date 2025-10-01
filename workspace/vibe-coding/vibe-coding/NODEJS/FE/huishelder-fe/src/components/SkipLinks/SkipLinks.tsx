import { Fragment } from 'react';

import styles from './SkipLinks.module.scss';

const SkipLinks = () => {
  return (
    <Fragment>
      <a className={styles.root} href="#">
        Skip to content
      </a>
    </Fragment>
  );
};

export default SkipLinks;
