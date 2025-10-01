import { Outlet } from 'react-router-dom';

import { Header, Footer, FetchLoader, SkipLinks, Toast, Onboarding } from 'components';
import { useOnboarding } from 'hooks';
import { LayoutProps } from './Layout.interface';

import styles from './Layout.module.scss';

/**
 * Global layout component that follows HuisHelder design system.
 * Provides a clean, modern structure with appropriate spacing and style.
 *
 * Notes:
 * - The `Outlet` is used when rendered via router.
 * - The `children` are used when simply displaying the `Loading` page.
 */
const Layout = ({ children }: LayoutProps) => {
  const { showOnboarding, handleOnboardingComplete, closeOnboarding } = useOnboarding();

  return (
    <div className={styles.layout}>
      <Header />
      <main id="content">
        <div className={styles.container}>{children || <Outlet />}</div>
      </main>
      <Footer />
      <SkipLinks />
      <FetchLoader />
      <Toast />
      <Onboarding
        isOpen={showOnboarding}
        onClose={closeOnboarding}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
};

export default Layout;
