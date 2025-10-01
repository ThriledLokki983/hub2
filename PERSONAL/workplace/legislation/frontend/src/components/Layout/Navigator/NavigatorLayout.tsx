import { useLayoutEffect } from 'react';
import { Outlet, useOutletContext, useNavigate, matchPath, useLocation } from 'react-router-dom';

import { useAppStateContext } from 'contexts';
import { PATH_NAVIGATOR_LANDING, PATH_NAVIGATOR } from 'configs/paths';
import { Footer } from 'components';

import { UserInterface } from 'hooks/interfaces';

import styles from './NavigatorLout.module.scss';


interface OutletContextProps {
  user: UserInterface
}

const NavigatorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { stateDispatch, stateActions } = useAppStateContext();
  const outletContext = useOutletContext<OutletContextProps>();

  const isNavigatorHomePage = Boolean(matchPath(PATH_NAVIGATOR, location.pathname));


  /**
   * Redirect to the all legislation page if the legislation ID is not provided.
   * Update global title.
   * Note: this is needed when this page is rendered outside `react-router`.
  */
  useLayoutEffect(() => {
    stateDispatch(stateActions.updatePageTitle(`Navigator`));

    if (isNavigatorHomePage) {
      navigate(PATH_NAVIGATOR_LANDING, { replace: true });
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateDispatch, stateActions, navigate, isNavigatorHomePage]);

  return (
    <>
      <main id="content" className={styles.root}>
        <Outlet context={{ user: outletContext.user }}/>
      </main>
      <Footer data-is-admin={outletContext.user.is_admin} data-page='navigator'/>
    </>
  );

};

export default NavigatorLayout;
