import React from 'react';

import styles from './ServerError.module.scss';
import { BackLink, Button, ButtonSet, IconComponent } from 'components/index';
import { PATH_HOME } from 'configs/paths';

const ServerError = () => {
  return (
    <section className={styles.root} data-main-content>
      <div className={styles.root__icon}>
        <IconComponent name="ServeErrorIcon" />
      </div>
      <h2>Something went wrong.</h2>
      <p>
        Sorry, something went terribly wrong. Please inform the technical team about this issue or go back to the
      </p>
      <BackLink showIcon={false}>previous page</BackLink>.
      <ButtonSet data-btn-set>
        <Button url={PATH_HOME}>
          Return to homepage
        </Button>
      </ButtonSet>
    </section>
  )
}

export default ServerError
