import { useEffect } from 'react';

import { PATH_HOME } from 'configs/paths';

import { Button, ButtonSet } from 'components';
import { useAppStateContext } from 'contexts';

import styles from './NotFound.module.scss';

const NotFound = () => {
  const { stateDispatch, stateActions } = useAppStateContext();

  /**
   * Update global title.
   * Note: this is needed when this page is rendered outside `react-router`.
   */
  useEffect(() => {
    stateDispatch(stateActions.updatePageTitle(`Page not found`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <article className={styles.root}>
      <h2>Page not found</h2>
      <p>
        Sorry, we couldn&apos;t find the page you&apos;re looking for ¯\_(ツ)_/¯ <br />
        <small style={{ opacity: 0.65 }}>Error: 404 (Page not Found)</small>
      </p>
      <ButtonSet>
        <Button url={PATH_HOME}>Return to homepage</Button>
      </ButtonSet>
    </article>
  );
};

export default NotFound;
