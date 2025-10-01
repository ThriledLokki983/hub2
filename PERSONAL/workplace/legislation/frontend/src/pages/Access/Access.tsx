import { useEffect } from 'react';
import { matchPath, useNavigate } from 'react-router-dom';
import { restore } from 'helpers/utils';

import { useUser } from 'hooks';
import { PATH_LOGIN_FAIL, PATH_LOGOUT, PATH_PROJECTS } from 'configs/paths';
import { Button, ButtonSet, IconComponent } from 'components';
import styles from './Access.module.scss';
import { getCookie } from 'react-use-cookie';
import { CSRF_TOKEN_COOKIE_NAME } from 'configs/constants';


const Access = () => {
  const navigate = useNavigate();

  const isFailedLogin = restore('failed_login', { permanent: false });
  const { user } = useUser();

  // For admins and people who have access - redirect them back to the home page
  useEffect(() => {
    // Go straight to the failed page
    if (isFailedLogin) {
      navigate(PATH_LOGIN_FAIL);
    }

    // If user is already logged out, then stay at the logout page
    if (!getCookie(CSRF_TOKEN_COOKIE_NAME) && !matchPath(location.pathname, PATH_LOGIN_FAIL)) {
      navigate(PATH_LOGOUT);
      return;
    }

    if (user.profile.has_access && user.is_admin && getCookie(CSRF_TOKEN_COOKIE_NAME)) {
      // navigate(PATH_PROJECTS);
    }
  }, [isFailedLogin, navigate, user]);


  return (
    <section className={styles.root}>
      <article className={styles.root__content}>
        <h2>Access Pending for the Sustainability Legislation Navigator</h2>
        <div>
          {/* <h6>What is the Sustainability Legislation Navigator ?</h6> */}
          <p>
          It looks like you don’t have access to the tool at the moment. If your email address is associated with an active project, you will receive access shortly as we set up your profile. Please check back later.
          </p>
        </div>
        {/* <ButtonSet>
          <Button variation='primary' disabled>
            Learn more about the Sustainability Legislation Navigator
          </Button>
          {user.profile.has_access ? (
            <Button url="/" variation='transparent'>Go home</Button>
          ) : null }
        </ButtonSet> */}
      </article>
      <article className={styles.root__icon}>
        <IconComponent name="AccessPageIcon" />
      </article>
    </section>
  );

};

export default Access;
