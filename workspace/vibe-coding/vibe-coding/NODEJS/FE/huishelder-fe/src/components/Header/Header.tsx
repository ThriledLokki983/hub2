import { Link, NavLink } from 'react-router-dom';

import { PATH_HOME } from 'configs/paths';
import ROUTES from 'configs/routes';

import { useUserContext } from 'contexts';
import { CustomRouteObject } from 'configs/interfaces';
import { ProfileDropdown } from 'components';

import styles from './Header.module.scss';
// import Logo from 'assets/pwc-logo.svg?react';

/**
 * Application header component following the HuisHelder design system.
 * Features a modern, clean layout with subtle animations and interactions.
 */
const Header = () => {
  const { user, logout } = useUserContext();
  // Fixed: isLoggedIn should be true when user.profile.id exists
  const isLoggedIn = !!user?.profile?.id;

  return (
    <header className={styles.root} id="header">
      <div className={styles.root__inner}>
        <Link className={styles.root__logo} to={PATH_HOME} rel="home" aria-label="HuisHelder Home">
          {/* <Logo /> */}
          <span>
            HuisHelder
            <strong>.nl</strong>
          </span>
        </Link>

        <div className={styles.rightSection}>
          <nav className={styles.root__nav} aria-label="Main Navigation">
            <ul>
              {ROUTES.flatMap(route =>
                route.children?.filter(child => (child as CustomRouteObject).isNav),
              ).map((child, index) => {
                const customChild = child as CustomRouteObject;
                return (
                  <li key={`header-nav-${index}`}>
                    <NavLink
                      to={customChild.path!}
                      className={({ isActive }) => (isActive ? 'is-active' : '')}
                      title={customChild.label}
                      end={customChild.isEnd}
                    >
                      <span>{customChild.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <ProfileDropdown
            isLoggedIn={isLoggedIn}
            userName={user?.profile.name || user?.profile?.name}
            userEmail={user?.profile.email}
            onLogout={logout}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
