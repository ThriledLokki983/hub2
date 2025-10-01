import React from 'react';
import { Link } from 'react-router-dom';
import {
  PATH_JOURNEY_DASHBOARD,
  PATH_TIMELINE,
  PATH_MY_PROPERTIES,
  PATH_FINANCIAL_DASHBOARD,
} from 'configs/paths';
import {
  ButtonRedesigned as Button,
  ButtonSetRedesigned as ButtonSet,
} from 'components/redesigned';
import { HomeProps } from './Home.interface';
import styles from './HomeRedesigned.module.scss';

/**
 * Redesigned Home page component
 * Implements the new HuisHelder design system with a cosmic, luxurious aesthetic
 *
 * @param props - Component properties
 * @returns React component
 */
const HomeRedesigned: React.FC<HomeProps> = ({
  onRefresh,
  upcomingTasks = [],
  financialSummary,
}) => {
  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('nl-NL', {
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
      {/* Hero Section - Cosmic Design */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>
            Welkom bij <span>HuisHelder</span>
          </h1>
          <p>
            Uw persoonlijke gids voor een zorgeloze huisreis in Nederland. Wij maken het kopen en
            verkopen van uw woning eenvoudig en transparant.
          </p>
          <ButtonSet>
            <Button url={PATH_JOURNEY_DASHBOARD} variant="primary">
              Bekijk uw huisreis
            </Button>
            <Button onClick={onRefresh} variant="secondary">
              Vernieuwen
            </Button>
          </ButtonSet>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.decorationCircle}></div>
          <img
            src="/assets/house-illustration.svg"
            alt="Huis illustratie"
            className={styles.heroHouse}
            onError={e => {
              // Fallback if image doesn't exist
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      </section>

      {/* Journey Cards Section */}
      <section className={styles.cardsSection}>
        <h2 className={styles.sectionHeading}>Uw woningoverzicht</h2>
        <div className={styles.cardsGrid}>
          <Link to={PATH_JOURNEY_DASHBOARD} className={styles.card}>
            <div className={styles.cardIcon}>🏡</div>
            <h3>Huisreis</h3>
            <p>Bekijk de voortgang van uw woonreis</p>
          </Link>

          <Link to={PATH_TIMELINE} className={styles.card}>
            <div className={styles.cardIcon}>📅</div>
            <h3>Tijdlijn</h3>
            <p>Belangrijke data en mijlpalen</p>
          </Link>

          <Link to={PATH_MY_PROPERTIES} className={styles.card}>
            <div className={styles.cardIcon}>🔑</div>
            <h3>Mijn woningen</h3>
            <p>Beheer uw huidige en nieuwe woning</p>
          </Link>
        </div>
      </section>

      {/* Financial Overview Section */}
      <section className={styles.financialSection}>
        <h2 className={styles.sectionHeading}>Financieel Overzicht</h2>
        <div className={styles.financialCards}>
          <div className={styles.financeCard}>
            <h3>Geschatte hypotheek</h3>
            <div className={styles.financeAmount}>{formatCurrency(mortgageAmount)}</div>
            <Link to={PATH_FINANCIAL_DASHBOARD} className={styles.cardLink}>
              Bereken uw opties →
            </Link>
          </div>

          <div className={styles.financeCard}>
            <h3>Maandelijkse netto kosten</h3>
            <div className={styles.financeAmount}>{formatCurrency(monthlyNetCost)}</div>
          </div>

          <div className={styles.financeCard}>
            <h3>Aanvullende kosten</h3>
            <div className={styles.financeAmount}>
              {formatCurrency(financialSummary?.additionalCosts || 0)}
            </div>
            <Link to={PATH_JOURNEY_DASHBOARD} className={styles.cardLink}>
              Bekijk details →
            </Link>
          </div>
        </div>
        <div className={styles.infoNote}>
          <p>Ga naar uw huisreis dashboard om financiële details te bekijken en bij te werken</p>
        </div>
      </section>

      {/* Tasks Section */}
      <section className={styles.tasksSection}>
        <div className={styles.sectionHeading}>
          <h2>Openstaande taken</h2>
          <Link to={PATH_JOURNEY_DASHBOARD} className={styles.viewAll}>
            Alle taken →
          </Link>
        </div>

        <div className={styles.tasksList}>
          {hasTasks ? (
            upcomingTasks.slice(0, 3).map(task => (
              <div className={styles.taskItem} key={task.id}>
                <div className={styles.taskIcon}>📋</div>
                <div className={styles.taskContent}>
                  <h4>{task.title}</h4>
                  <p>Deadline: {task.dueDate}</p>
                </div>
                <Link
                  to={`${PATH_JOURNEY_DASHBOARD}/tasks/${task.id}`}
                  className={styles.taskAction}
                >
                  →
                </Link>
              </div>
            ))
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
        <h2 className={styles.sectionHeading}>Over HuisHelder</h2>
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

export default HomeRedesigned;
