import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PATH_LOGIN, PATH_HOME } from 'configs/paths';
import Icon from 'components/Icon/Icon';
import styles from './Logout.module.scss';

/**
 * Logout success page following the HuisHelder design system
 * Shows a confirmation message and provides navigation options
 */
const Logout = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.logoutContainer}>
      <div className={styles.logoutCard}>
        <div className={styles.iconContainer}>
          <div className={styles.successIcon}>
            <Icon name="check-circle" phosphor="CheckCircle" weight="light" width={64} />
          </div>
        </div>

        <h1 className={styles.title}>Successfully Logged Out</h1>

        <p className={styles.message}>
          Thank you for using HuisHelder. Your session has been securely ended. We look forward to
          helping you find your perfect home soon.
        </p>

        <div className={styles.actions}>
          <Link to={PATH_LOGIN} className={styles.primaryButton}>
            <Icon name="sign-in" phosphor="SignIn" weight="light" width={20} />
            Sign In Again
          </Link>
        </div>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Need assistance? Contact our support team at{' '}
            <a href="mailto:support@huishelder.nl" className={styles.link}>
              support@huishelder.nl
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Logout;
