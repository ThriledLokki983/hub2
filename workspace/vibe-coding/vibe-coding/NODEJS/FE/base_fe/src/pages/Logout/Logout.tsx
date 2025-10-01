import { PATH_HOME } from 'configs/paths';

import { Button, ButtonSet } from 'components';

import styles from './Logout.module.scss';


const Logout = () => {

  return (
    <article className={styles.root}>
      <h2>You're logged out</h2>
      <p>
        You can now close your browser tab, or leave this website. <br/>
        If you return you to this website, you'll automatically log in again.
      </p>
      <ButtonSet>
        <Button variation="secondary" url={PATH_HOME}>
          Return to homepage
        </Button>
      </ButtonSet>
    </article>
  );

};

export default Logout;
