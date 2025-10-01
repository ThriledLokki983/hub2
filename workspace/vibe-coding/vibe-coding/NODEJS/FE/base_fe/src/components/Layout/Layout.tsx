import { Outlet } from 'react-router-dom';

import { Header, FetchLoader, SkipLinks, Toast } from 'components';
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

  return (
    <section className={styles.layout}>
      <Header />
      <main id="content">
        <Outlet />
        {children}
      </main>
      <SkipLinks/>
      <FetchLoader />
      <Toast />
    </section>
  );

};

export default Layout;
