import { useState, useLayoutEffect } from 'react';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import { restore } from 'helpers/utils';

import { Onboarding } from 'components';

import { useUserContext } from 'contexts';
import { PATH_LOGIN_FAIL, PATH_LOGOUT, PATH_NAVIGATOR, PATH_PROJECTS } from 'configs/paths';
import { STORAGE_KEY_ONBOARDED } from 'configs/onboarding/onboarding';

import styles from './Home.module.scss';


const Home = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [isAlreadyOnboarded, _] = useState(
    restore(STORAGE_KEY_ONBOARDED, { permanent: true }) as boolean ?? false
  );

  const { user } = useUserContext();

  // Go to teh navigator page if the user is already onboarded
  useLayoutEffect(() => {
    if (!user.authenticated) {
      if (matchPath(location.pathname, PATH_LOGIN_FAIL)) {
        navigate(PATH_LOGIN_FAIL, { state: { from: '/' } });
        return;
      }

      navigate(PATH_LOGOUT, { state: { from: '/' } });
      return;
    }

    if (user.profile.is_onboarded && isAlreadyOnboarded) {
      user.is_admin
      ? navigate(PATH_PROJECTS)
      : navigate(PATH_NAVIGATOR);
      return;
    }
  }, [
    isAlreadyOnboarded,
    location.pathname,
    navigate,
    user.authenticated,
    user.is_admin,
    user.profile.is_onboarded,
  ]);

  return (
    <section className={styles.root}>
      {/* Will remove this component at some point and directly render the onboarding here */}
      <Onboarding isOnboarded={user.profile.is_onboarded && isAlreadyOnboarded } user={user}/>
    </section>
  );

};

export default Home;
