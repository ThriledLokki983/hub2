import { useMemo, Fragment } from 'react';
import { Outlet, useLocation, matchPath, useParams } from 'react-router-dom';

import { Header, FetchLoader, SkipLinks, Toast } from 'components';
import { useUserContext } from 'contexts';

import { PATH_ACCESS, PATH_HOME, PATH_LOGIN_FAIL, PATH_LOGOUT } from 'configs/paths';
import { LayoutProps } from './Layout.interface';

import styles from './Layout.module.scss';


/**
 * Global layout.
 *
 * Notes:
 * - The `Outlet` is used when rendered via router.
 * - The `children` are used when simply displaying the `Loading` page.
 */
const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { legislationId, projectId } = useParams();
  const { user } = useUserContext();


  // Determine if the current page is the logout page.
  const isLogoutPage = useMemo(
    () => Boolean(matchPath(location.pathname, PATH_LOGOUT)) || Boolean(matchPath(location.pathname, PATH_LOGIN_FAIL)),
    [location.pathname],
  );

  // Determine if the current page is the onboarding page.
  const isOnboardingPage = useMemo(
    () => Boolean(matchPath(location.pathname, PATH_HOME)),
      // || Boolean(matchPath(location.pathname, PATH_ACCESS)) ,
    [location.pathname]
  );

  // Determine if we are on the access page
  const isOnAccessPage = useMemo(
    () => Boolean(matchPath(location.pathname, PATH_ACCESS)),
    [location.pathname]
  );

  return (
    <section
      className={styles.layout}
      data-layout-content
      data-is-settings-page={location.pathname.includes('settings')}
      data-full-width={isLogoutPage}
      data-is-onboarding={isOnboardingPage}
      data-show-guide={user.show_guided_tour}
      data-is-details-page={`${legislationId !== undefined}`.toString()}
      data-is-project-page={!location.pathname.includes('logs') && projectId !== null}
    >
      {/* Render the header on all pages except the logout page. */}
      {!isLogoutPage && !isOnboardingPage ? (
        <Fragment>
          <Header
            user={user}
            isOnboarding={isOnboardingPage || isOnAccessPage}
            data-is-access={isOnAccessPage}
            data-show-guide={user.show_guided_tour}
          />
            <Outlet context={{ user }}/>
            {children}
        </Fragment>
      ) : (
        <Fragment>
          {/* {!isLogoutPage ? <Header isOnboarding={isOnboardingPage} user={user}/> : null } */}
          <main id="content" data-full-width={isLogoutPage} data-is-onboarding={isOnboardingPage}>
            <Outlet context={{ user }}/>
            {children}
          </main>
        </Fragment>
      )}
      <SkipLinks/>
      <FetchLoader />
      <Toast />
    </section>
  );

};

export default Layout;
