import React from 'react';
import { Link } from 'react-router-dom';
import { PATH_JOURNEY_DASHBOARD, PATH_TIMELINE, PATH_MY_PROPERTIES } from 'configs/paths';
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
  // Check if we have any upcoming tasks
  const hasTasks = upcomingTasks && upcomingTasks.length > 0;

  return (
    <article className={styles.root}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welkom bij HuisHelder</h1>
          <p>Uw persoonlijke gids voor een zorgeloze huisreis in Nederland</p>
          <ButtonSet>
            <Button url={PATH_JOURNEY_DASHBOARD} variant="primary">
              Bekijk uw huisreis
            </Button>
            <Button onClick={onRefresh} variant="secondary">
              Vernieuwen
            </Button>
          </ButtonSet>
        </div>
      </section>

      {/* Journey Snapshot Panel */}
      <section className={styles.journeySnapshot}>
        <h2>Uw woningoverzicht</h2>

        <div className={styles.journeyCards}>
          <Link to={PATH_JOURNEY_DASHBOARD} className={styles.journeyCard}>
            <div className={styles.cardIcon}>🏡</div>
            <h3>Huisreis</h3>
            <p>Bekijk de voortgang van uw woonreis</p>
          </Link>

          <Link to={PATH_TIMELINE} className={styles.journeyCard}>
            <div className={styles.cardIcon}>📅</div>
            <h3>Tijdlijn</h3>
            <p>Belangrijke data en mijlpalen</p>
          </Link>

          <Link to={PATH_MY_PROPERTIES} className={styles.journeyCard}>
            <div className={styles.cardIcon}>🔑</div>
            <h3>Mijn woningen</h3>
            <p>Beheer uw huidige en nieuwe woning</p>
          </Link>
        </div>
      </section>

      {/* Financial Overview */}
      <section className={styles.financialSection}>
        <h2>Financieel Overzicht</h2>
        <div className={styles.financialCards}>
          <div className={styles.financeCard}>
            <h3>Geschatte hypotheek</h3>
            <div className={styles.financeAmount}>
              {financialSummary
                ? new Intl.NumberFormat('nl-NL', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 0,
                  }).format(financialSummary.estimatedMortgage)
                : '€0'}
            </div>
          </div>
          <div className={styles.financeCard}>
            <h3>Maandelijkse netto kosten</h3>
            <div className={styles.financeAmount}>
              {financialSummary
                ? new Intl.NumberFormat('nl-NL', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 0,
                  }).format(financialSummary.monthlyNetCost)
                : '€0'}
            </div>
          </div>
          <div className={styles.financeCard}>
            <h3>Extra kosten</h3>
            <Link to={PATH_JOURNEY_DASHBOARD} className={styles.viewDetails}>
              Bekijk details
            </Link>
          </div>
        </div>
        <div className={styles.infoNote}>
          <p>Ga naar uw huisreis dashboard om de financiële details te bekijken en bij te werken</p>
        </div>
      </section>

      {/* Tasks Section */}
      <section className={styles.tasksSection}>
        <h2>Openstaande taken</h2>
        <div className={styles.tasksList}>
          {hasTasks ? (
            <ul className={styles.taskItems}>
              {upcomingTasks.slice(0, 3).map(task => (
                <li key={task.id} className={styles.taskItem}>
                  <Link to={PATH_JOURNEY_DASHBOARD} className={styles.taskLink}>
                    <span className={styles.taskTitle}>{task.title}</span>
                    <span className={styles.taskArrow}>→</span>
                  </Link>
                </li>
              ))}
              {upcomingTasks.length > 3 && (
                <li className={styles.viewMoreTasks}>
                  <Link to={PATH_JOURNEY_DASHBOARD}>
                    + {upcomingTasks.length - 3} meer taken bekijken
                  </Link>
                </li>
              )}
            </ul>
          ) : (
            <div className={styles.emptyTaskList}>
              <div className={styles.emptyStateIcon}>📋</div>
              <p>Ga naar uw huisreis dashboard om uw taken te bekijken</p>
              <Button url={PATH_JOURNEY_DASHBOARD} variant="primary">
                Naar taken
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* About HuisHelder Section */}
      <section className={styles.aboutSection}>
        <h2>Over HuisHelder</h2>
        <p>
          HuisHelder begeleidt u door het hele proces van het kopen of verkopen van een woning in
          Nederland. Van het zoeken naar de perfecte woning, het regelen van financiering, tot het
          tekenen bij de notaris - wij zorgen ervoor dat u met vertrouwen door elke stap navigeert.
        </p>
        <ButtonSet>
          <Button url="/company/about" variant="secondary">
            Meer over ons
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
