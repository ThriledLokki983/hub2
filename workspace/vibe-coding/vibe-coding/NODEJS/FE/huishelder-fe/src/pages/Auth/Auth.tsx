import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { PATH_LOGIN } from 'configs/paths';
import styles from './Auth.module.scss';

/**
 * Auth container component that provides a shared layout for all authentication pages
 * following the HuisHelder design system.
 */
const Auth = () => {
  const navigate = useNavigate();

  // Redirect to login if accessed directly at /auth
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/auth') {
      navigate(PATH_LOGIN);
    }
  }, [navigate]);

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBrand}>
        <div className={styles.brandContent}>
          <h1 className={styles.brandTitle}>HuisHelder</h1>
          <p className={styles.brandTagline}>
            Your journey to finding the perfect home begins here
          </p>
        </div>
      </div>
      <div className={styles.authContent}>
        <div className={styles.logo}>
          <span>HuisHelder</span>
          <strong>.nl</strong>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Auth;
