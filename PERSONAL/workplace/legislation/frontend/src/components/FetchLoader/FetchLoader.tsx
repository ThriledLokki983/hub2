import { useAppStateContext } from 'contexts';

import styles from './FetchLoader.module.scss';


/**
 * Global fetch loader.
 * Based on: https://github.com/mui-org/material-ui/blob/master/packages/mui-material/src/LinearProgress/LinearProgress.js
 */
const FetchLoader = () => {

  const { state: appState } = useAppStateContext();

  return (
    <div className={styles.root} aria-hidden={!appState.isFetching}>
      <div className={styles.root__inner}>
        <span></span>
        <span></span>
      </div>
    </div>
  );

};

export default FetchLoader;
