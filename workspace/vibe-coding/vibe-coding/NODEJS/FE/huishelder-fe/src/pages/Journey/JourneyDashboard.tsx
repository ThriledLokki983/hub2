import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './JourneyDashboard.module.scss';
import journeyStyles from '../../components/Journey/Journey.module.scss';
import classNames from 'classnames';
import {
  Timeline,
  TaskList,
  FinancialSummary,
  DocumentUploadWrapper,
  Tabs,
  ToolCard,
} from '../../components/Journey';
import { useJourney } from '../../hooks/useJourney';
import useUserContext from '../../contexts/UserContext';
import { PATH_LOGIN } from '../../configs/paths';
import type { Tab } from '../../components/Journey/Tabs';

const JourneyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isLoading,
    hasErrors,
    journey,
    timeline,
    currentMilestone,
    upcomingTasks,
    financialSummary,
    requiredDocuments,
    uploadProgress,
    markTaskComplete,
    uploadDocument,
    refreshJourneyData,
  } = useJourney();

  // Get user data from context instead of useUser hook
  const { user } = useUserContext();
  const isAuthenticated = user?.authenticated || false;

  // Track the currently selected tab - we'll use this if we need to perform
  // specific actions when tabs change in the future
  const [, setActiveTab] = useState<string>('journey');

  // Track if the financial dashboard has been used
  const [financialDashboardUsed, setFinancialDashboardUsed] = useState<boolean>(
    localStorage.getItem('financialDashboardUsed') === 'true',
  );

  // Check if user has returned from financial dashboard
  useEffect(() => {
    // If we detect the financial dashboard in the previous navigation
    if (location.state && location.state.fromFinancialDashboard) {
      // Mark the dashboard as used
      localStorage.setItem('financialDashboardUsed', 'true');
      setFinancialDashboardUsed(true);
    }
  }, [location.state]);

  const handleTaskComplete = async (taskId: string): Promise<void> => {
    try {
      await markTaskComplete(taskId);
      // Force refresh to ensure UI reflects the latest task status
      refreshJourneyData();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  // Track usage of the financial dashboard and update related tasks
  const handleFinancialDashboardUsed = () => {
    // Update local storage status
    localStorage.setItem('financialDashboardUsed', 'true');
    setFinancialDashboardUsed(true);

    // If we have mortgage-related tasks, check if any need to be completed
    if (upcomingTasks && upcomingTasks.length > 0) {
      const financialTasks = upcomingTasks.filter(
        task =>
          task.title.toLowerCase().includes('financieel') ||
          task.title.toLowerCase().includes('hypotheek') ||
          task.title.toLowerCase().includes('financial') ||
          task.title.toLowerCase().includes('mortgage'),
      );

      // For demo purposes, don't auto-complete tasks, but this would be where
      // you'd implement that logic if required
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      // If not authenticated, redirect to login with current path as return URL
      navigate(PATH_LOGIN, {
        state: { returnUrl: window.location.pathname },
        replace: true,
      });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    refreshJourneyData();
  }, [refreshJourneyData]);

  if (isLoading) {
    return (
      <div className={journeyStyles.loadingContainer}>
        <div className={journeyStyles.loadingDot}></div>
        <div className={journeyStyles.loadingDot}></div>
        <div className={journeyStyles.loadingDot}></div>
      </div>
    );
  }

  if (hasErrors) {
    return (
      <div className={journeyStyles.errorState}>
        <h2>Er is iets misgegaan</h2>
        <p>Kon geen gegevens laden. Probeer het later opnieuw.</p>
        <button
          className={classNames(journeyStyles.button, journeyStyles.buttonPrimary)}
          onClick={refreshJourneyData}
        >
          Opnieuw proberen
        </button>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className={journeyStyles.errorState}>
        <h2>Geen reisinformatie beschikbaar</h2>
        <p>Er is momenteel geen huisreis actief voor uw account.</p>
      </div>
    );
  }

  // Define the tabs with their content
  const journeyTabs: Tab[] = [
    {
      id: 'journey',
      label: (
        <>
          <span role="img" aria-label="home">
            🏠
          </span>{' '}
          Uw huisreis
        </>
      ),
      content: (
        <div className={journeyStyles.sliderUp}>
          <Timeline milestones={timeline} currentMilestoneId={currentMilestone?.id} />
        </div>
      ),
    },
    {
      id: 'tasks',
      label: (
        <>
          <span role="img" aria-label="clipboard">
            📋
          </span>{' '}
          Taken & Financiën
        </>
      ),
      content: (
        <div className={journeyStyles.fadeIn}>
          <div className={journeyStyles.grid}>
            <div className={journeyStyles.gridItemHalf}>
              <TaskList
                tasks={upcomingTasks}
                onTaskComplete={handleTaskComplete}
                requiredDocuments={requiredDocuments}
                onUpload={uploadDocument}
                uploadProgress={uploadProgress}
              />
            </div>
            <div className={journeyStyles.gridItemHalf}>
              <FinancialSummary financialData={financialSummary} />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'documents',
      label: (
        <>
          <span role="img" aria-label="document">
            📄
          </span>{' '}
          Documenten
        </>
      ),
      content: (
        <div className={journeyStyles.sliderUp}>
          <DocumentUploadWrapper
            documents={requiredDocuments}
            onUpload={uploadDocument}
            uploadProgress={uploadProgress}
          />
        </div>
      ),
    },
  ];

  return (
    <div className={journeyStyles.container}>
      <div className={classNames(styles.welcomeBanner, journeyStyles.fadeIn)}>
        <h1 className={styles.welcomeTitle}>
          Welkom bij uw huisreis, {user?.profile?.first_name || 'daar'}!
        </h1>
        <p className={styles.welcomeSubtitle}>
          Volg hier uw voortgang en beheer uw taken en documenten voor uw huisaankoop.
        </p>
      </div>

      {/* Financial Dashboard Tool Card after mortgage advice milestone */}
      {timeline &&
        timeline.some(
          milestone =>
            // Show tool card if any milestone related to mortgage advice exists
            milestone.title.toLowerCase().includes('hypotheek') ||
            milestone.title.toLowerCase().includes('mortgage') ||
            (milestone.tasks &&
              milestone.tasks.some(
                task =>
                  task.title.toLowerCase().includes('hypotheek') ||
                  task.title.toLowerCase().includes('mortgage'),
              )),
        ) && (
          <div className={journeyStyles.fadeIn}>
            <div className={styles.toolSection}>
              <h3 className={styles.toolSectionTitle}>Aanbevolen tools</h3>
              <ToolCard
                title="Financieel Dashboard"
                description="Bereken uw hypotheekmogelijkheden, kosten koper en maandlasten."
                icon="📊"
                to="/financial-dashboard"
                status={financialDashboardUsed ? 'completed' : 'pending'}
                state={{ returnUrl: location.pathname + location.search }}
                onClick={handleFinancialDashboardUsed}
              />
            </div>
          </div>
        )}

      <div className={classNames(journeyStyles.fadeIn, styles.tabsWrapper)}>
        <Tabs tabs={journeyTabs} defaultActiveTab="journey" onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default JourneyDashboard;
