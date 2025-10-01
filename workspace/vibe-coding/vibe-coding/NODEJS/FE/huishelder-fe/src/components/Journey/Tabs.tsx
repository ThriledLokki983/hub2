import React, { useState, ReactNode, KeyboardEvent, useRef, useEffect } from 'react';
import classNames from 'classnames';
import styles from './Tabs.module.scss';

export interface Tab {
  id: string;
  label: ReactNode;
  content: ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultActiveTab, onTabChange }) => {
  const [activeTabId, setActiveTabId] = useState<string>(defaultActiveTab || tabs[0]?.id || '');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Initialize refs array when tabs change
  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, tabs.length);
  }, [tabs]);

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    // Handle keyboard navigation
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        if (index < tabs.length - 1) {
          const nextTab = tabRefs.current[index + 1];
          if (nextTab) {
            nextTab.focus();
            handleTabClick(tabs[index + 1].id);
          }
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (index > 0) {
          const prevTab = tabRefs.current[index - 1];
          if (prevTab) {
            prevTab.focus();
            handleTabClick(tabs[index - 1].id);
          }
        }
        break;
      case 'Home':
        e.preventDefault();
        if (tabs.length > 0) {
          const firstTab = tabRefs.current[0];
          if (firstTab) {
            firstTab.focus();
            handleTabClick(tabs[0].id);
          }
        }
        break;
      case 'End':
        e.preventDefault();
        if (tabs.length > 0) {
          const lastTab = tabRefs.current[tabs.length - 1];
          if (lastTab) {
            lastTab.focus();
            handleTabClick(tabs[tabs.length - 1].id);
          }
        }
        break;
      default:
        break;
    }
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsHeader} role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={el => (tabRefs.current[index] = el)}
            role="tab"
            aria-selected={activeTabId === tab.id}
            id={`tab-${tab.id}`}
            aria-controls={`tabpanel-${tab.id}`}
            className={classNames(styles.tabButton, {
              [styles.active]: activeTabId === tab.id,
            })}
            onClick={() => handleTabClick(tab.id)}
            onKeyDown={e => handleKeyDown(e, index)}
            tabIndex={activeTabId === tab.id ? 0 : -1}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className={styles.tabContent}
        role="tabpanel"
        id={`tabpanel-${activeTabId}`}
        aria-labelledby={`tab-${activeTabId}`}
        tabIndex={0}
      >
        {activeTab?.content}
      </div>
    </div>
  );
};

export default Tabs;
