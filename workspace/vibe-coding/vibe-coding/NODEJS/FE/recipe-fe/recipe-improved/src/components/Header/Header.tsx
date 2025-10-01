import { Link, NavLink } from 'react-router-dom';

import { PATH_HOME } from 'configs/paths';
import ROUTES from 'configs/routes';

import { useUserContext } from 'contexts';
import { CustomRouteObject } from 'configs/interfaces';

import styles from './Header.module.scss';
import Logo from 'assets/pwc-logo.svg?react';


const Header = () => {

  const { user, logout } = useUserContext();

  return (
    <header className={styles.root} id="header">
      <div className={styles.root__inner}>

        <Link className={styles.root__logo} to={PATH_HOME} rel="home" aria-label="Home">
          <Logo />
        </Link>

        <div>
          {user.profile.name} (<button onClick={() => logout()}>Logout</button>)
        </div>

        <nav className={styles.root__nav} aria-label="Main">
          <ul>
            {ROUTES.flatMap(route =>
              route.children?.filter(child => (child as CustomRouteObject).isNav)).map((child, index) => {
              const customChild = child as CustomRouteObject;
              return (
                <li key={`header-nav-${index}`}>
                  <NavLink
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    to={customChild.path!}
                    className={({ isActive }) => isActive ? 'is-active' : ''}
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

      </div>
    </header>
  );

};

export default Header;
