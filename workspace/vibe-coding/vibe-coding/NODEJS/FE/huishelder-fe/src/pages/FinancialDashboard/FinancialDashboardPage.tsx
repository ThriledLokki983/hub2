import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '../../components';
import FinancialDashboard from '../../components/FinancialDashboard';
import styles from './FinancialDashboard.module.scss';
import { PATH_JOURNEY_DASHBOARD, PATH_LOGIN } from '../../configs/paths';
import useUserContext from '../../contexts/UserContext';

/**
 * Financial Dashboard page
 * Protected by authentication
 */
const FinancialDashboardPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const returnPath = location.state?.returnUrl || PATH_JOURNEY_DASHBOARD;

  // Use conditional rendering instead of AuthGuard component
  const { user, loading } = useUserContext();

  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  if (!user?.authenticated) {
    // Store the current path in localStorage for redirect after login
    localStorage.setItem('intendedRedirect', location.pathname);
    return <Navigate to={PATH_LOGIN} replace />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <a
          href="#"
          className={styles.backLink}
          onClick={e => {
            e.preventDefault();
            navigate(returnPath, { state: { fromFinancialDashboard: true } });
          }}
        >
          <span className={styles.backIcon}>←</span> Terug naar huisreis
        </a>
      </div>
      <FinancialDashboard />
      <div className={styles.footer}>
        <Button
          variation="secondary"
          onClick={() => {
            navigate(returnPath, {
              state: { fromFinancialDashboard: true },
            });
          }}
        >
          Terug naar huisreis
        </Button>
      </div>
    </div>
  );
};

export default FinancialDashboardPage;
