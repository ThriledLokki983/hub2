import { useEffect } from 'react';
import { PATH_HOME } from 'configs/paths';

import { Button, ButtonSet, IconComponent, BackLink } from 'components';
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
    <section className={styles.root} data-main-content>
      <div className={styles.root__icon}>
        <IconComponent name="NotFoundIcon" />
      </div>
      <h2>Page not found</h2>
      <p>
        We could not find the page you were looking for. Please navigate back to
      </p>
      <BackLink showIcon={false}>previous page</BackLink>.
      <ButtonSet data-btn-set>
        <Button url={PATH_HOME}>
          Return to homepage
        </Button>
      </ButtonSet>
    </section>

  );

};

export default NotFound;
