import { useMemo, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { composeInitialsFromEmail } from 'helpers/utils';

import { DropdownMenu, Button, IconComponent, ButtonSet } from 'components';

import { HeaderProps } from './Header.interface';
import { CustomRouteObject } from 'configs/interfaces';

import ROUTES from 'configs/routes';
import { PATH_HOME, PATH_LEGISLATION, PATH_LOGOUT, PATH_NAVIGATOR, PATH_PATTERNS, PATH_PROJECTS, PATH_SETTINGS } from 'configs/paths';
import { DEVELOPMENT, ICONS, ALLOW_PROJECTS_PAGE, ALLOWED_LOCAL_ADMIN } from 'configs/constants';

import styles from './Header.module.scss';
type IconName = keyof typeof ICONS;


const Header = ({ isOnboarding, user, ...props }: HeaderProps) => {

  const profileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const appNavRoutes = useMemo(() => {
      let routes: CustomRouteObject[] = (ROUTES.flatMap(route =>
        route.children?.filter(child => (child as CustomRouteObject).isNav)
      ) as CustomRouteObject[]);

      // if user is admin, do not show the Navigator link
      // but if we are in development mode, show the Navigator link
      if (user.is_admin && !DEVELOPMENT) {
        routes = routes.filter(route => (route as CustomRouteObject).path !== PATH_NAVIGATOR);
      }

      // if its development mode, show the projects page
      if (!DEVELOPMENT && !user.is_admin) {
        routes = routes.filter(route => (route as CustomRouteObject).path !== PATH_PROJECTS);
      }

      if (!user.is_admin  && !DEVELOPMENT && !ALLOW_PROJECTS_PAGE) {
        routes = routes.filter(route => (route as CustomRouteObject).path !== PATH_PROJECTS);
      }

      return routes as CustomRouteObject[];
    }, [user.is_admin]);

   /**
   * Handle profile menu toggles.
   */
   const profileMenuToggleHandler = (isExpanding: any) => {};

  return (
    <header
      id="header"
      className={styles.root}
      data-onboarding={isOnboarding}
      data-full-width
      data-content-grid
      data-header
      {...props}
    >
      <section data-content data-header>
        <div className={styles.root__inner}>

          <Link className={styles.root__logo} to={!isOnboarding ? PATH_HOME : '#!'} rel="home" aria-label="Home">
            <IconComponent name="Logo"/>
            <span>Sustainability Legislation Navigator&nbsp;<small>(Beta version)</small></span>
          </Link>

          <nav className={styles.root__nav} aria-label="Main">
            <ul>
              {appNavRoutes.map((child, index) => {
                const customChild = child as CustomRouteObject;

                // Ensure that customChild.icon is a valid key of ICONS
                const iconName = customChild.label as IconName;
                const Icon = ICONS[iconName] ?? ICONS['Default'];

                return (
                  <li key={`header-nav-${index}`}>
                    <NavLink
                      to={customChild.path!}
                      className={({ isActive }) => isActive ? 'is-active' : ''}
                      title={customChild.label}
                      end={customChild.isEnd}
                    >
                      {Icon ? <Icon /> : null}
                      <span>{customChild.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={styles.root__profileinfo}>
            {/* Search */}
            {/* Profile type */}
            {user.is_approver || user.is_preparer ? (
              <span className={styles.root__profiletype} data-admin-label>Admin</span>
            ) : null}
            <section className={styles.root__profile}>
              <button
                className={styles.root__profileavatar}
                ref={profileMenuButtonRef}
                aria-label="Toggle profile menu"
              >
                <span data-has-image={false}>
                   <span>{composeInitialsFromEmail(user.profile.email) || `…`}</span>
                </span>
              </button>
              {/* <IconComponent name="RightChevron" /> */}
              <DropdownMenu
                type="header-profile"
                buttonRef={profileMenuButtonRef}
                onToggle={profileMenuToggleHandler}
                openDelay={150}
              >
                <p>
                  <IconComponent name="AvatarIcon" />
                  <strong>{`${user.profile.first_name} ${user.profile.last_name}`}</strong><br />
                </p>
                <ButtonSet data-btn-set>
                  <Button
                    variation='transparent'
                    url={PATH_SETTINGS}
                    size='small'
                    data-logout
                    >
                    <IconComponent name="SettingsIcon" />
                    Account settings
                  </Button>
                  <Button
                    variation='transparent'
                    url={PATH_LOGOUT}
                    size='small'
                    data-logout
                    >
                    <IconComponent name="LogoutIcon" />
                    Log Out
                  </Button>
                </ButtonSet>
                <aside>&copy; 2015 – {(new Date()).getFullYear()} PwC. All rights reserved.</aside>
              </DropdownMenu>
              </section>
          </div>

        </div>
      </section>
    </header>
  );

};

export default Header;
