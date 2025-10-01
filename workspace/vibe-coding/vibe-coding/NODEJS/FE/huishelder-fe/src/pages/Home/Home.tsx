import React from 'react';
import { Link } from 'react-router-dom';
import {
  PATH_JOURNEY_DASHBOARD,
  PATH_TIMELINE,
  PATH_MY_PROPERTIES,
  PATH_FINANCIAL_DASHBOARD,
} from 'configs/paths';
import { Button, ButtonSet } from 'components';
import { HomeProps } from './Home.interface';
import styles from './Home.module.scss';

/**
 * Home page presenter component - handles UI rendering
 * This follows the presenter part of the Container/Presenter pattern
 *
 * @param props - Component properties
 * @returns React component
 */
const Home: React.FC<HomeProps> = ({
  user: _user,
  isLoading: _isLoading,
  error: _error,
  onUpdateProfile: _onUpdateProfile,
  isUpdating: _isUpdating,
  onRefresh,
  journey: _journey,
  currentMilestone: _currentMilestone,
  upcomingTasks = [],
  financialSummary,
  hasJourneyErrors: _hasJourneyErrors,
}) => {
  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get mortgage amount from financial summary if available
  const mortgageAmount = financialSummary?.estimatedMortgage || 0;
  const monthlyNetCost = financialSummary?.monthlyNetCost || 0;

  // Check if we have any upcoming tasks
  const hasTasks = upcomingTasks && upcomingTasks.length > 0;
  return (
    <article className={styles.root}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welcome to HuisHelder</h1>
          <p>Your personal guide for a worry-free home journey in the Netherlands</p>
          <ButtonSet>
            <Button url={PATH_JOURNEY_DASHBOARD} variant="primary">
              View your home journey
            </Button>
            <Button onClick={onRefresh} variant="secondary">
              Refresh
            </Button>
          </ButtonSet>
        </div>
      </section>

      {/* Journey Snapshot Panel */}
      <section className={styles.journeySnapshot}>
        <h2>Your Housing Overview</h2>

        <div className={styles.journeyCards}>
          <Link to={PATH_JOURNEY_DASHBOARD} className={styles.journeyCard}>
            <div className={styles.cardIcon}>🏡</div>
            <h3>Home Journey</h3>
            <p>Track the progress of your home journey</p>
          </Link>

          <Link to={PATH_TIMELINE} className={styles.journeyCard}>
            <div className={styles.cardIcon}>📅</div>
            <h3>Timeline</h3>
            <p>Important dates and milestones</p>
          </Link>

          <Link to={PATH_MY_PROPERTIES} className={styles.journeyCard}>
            <div className={styles.cardIcon}>🔑</div>
            <h3>My Properties</h3>
            <p>Manage your current and new homes</p>
          </Link>
        </div>
      </section>

      {/* Financial Overview */}
      <section className={styles.financialSection}>
        <h2>Financial Overview</h2>
        <div className={styles.financialCards}>
          <div className={styles.financeCard}>
            <h3>Estimated Mortgage</h3>
            <div className={styles.financeAmount}>
              {financialSummary
                ? new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 0,
                  }).format(financialSummary.estimatedMortgage)
                : '€0'}
            </div>
            <Link to={PATH_FINANCIAL_DASHBOARD} className={styles.cardLink}>
              Calculate your options →
            </Link>
          </div>
          <div className={styles.financeCard}>
            <h3>Monthly Net Costs</h3>
            <div className={styles.financeAmount}>
              {financialSummary
                ? new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 0,
                  }).format(financialSummary.monthlyNetCost)
                : '€0'}
            </div>
          </div>
          <div className={styles.financeCard}>
            <h3>Additional Costs</h3>
            <Link to={PATH_JOURNEY_DASHBOARD} className={styles.viewDetails}>
              View details
            </Link>
          </div>
        </div>
        <div className={styles.infoNote}>
          <p>Go to your home journey dashboard to view and update financial details</p>
        </div>
      </section>

      {/* Tasks Section */}
      <section className={styles.tasksSection}>
        <h2>Pending Tasks</h2>
        <div className={styles.tasksList}>
          <div className={styles.emptyTaskList}>
            <div className={styles.emptyStateIcon}>📋</div>
            <p>Go to your home journey dashboard to view your tasks</p>
            <Button url={PATH_JOURNEY_DASHBOARD} variant="primary">
              Go to tasks
            </Button>
          </div>
        </div>
      </section>

      {/* About HuisHelder Section */}
      <section className={styles.aboutSection}>
        <h2>About HuisHelder</h2>
        <p>
          HuisHelder guides you through the entire process of buying or selling a home in the
          Netherlands. From finding the perfect property, arranging financing, to signing with the
          notary - we ensure you navigate each step with confidence.
        </p>
        <ButtonSet>
          <Button url="/company/about" variant="secondary">
            More about us
          </Button>
          <Button url="/company/contact" variant="secondary">
            Contact
          </Button>
        </ButtonSet>
      </section>
    </article>
  );
};

export default Home;
