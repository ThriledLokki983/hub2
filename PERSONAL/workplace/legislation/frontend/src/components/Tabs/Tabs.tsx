import { Children, forwardRef } from 'react'
import { Tab, TabList, Tabs } from 'react-aria-components';

import { TabsProps } from './Tabs.interface';
import styles from './Tabs.module.scss';


const CustomTabs = forwardRef<HTMLDivElement, TabsProps>(({
  tabSelected,
  onTabClick,
  align = 'auto',
  type = 'pages',
  options = [],
  showLastTabIcon = false,
  children,
  ...props
}, ref) => {

  return (
    <Tabs
      onSelectionChange={onTabClick as any}
      className={styles.root}
      ref={ref}
      {...props}
    >
      <TabList className={styles.root__tablist} data-tabs data-align={align} data-type={type}>
        {Children.toArray(options.map(({ label, isError}, index) => (
          <Tab
            className={styles.root__tab}
            id={label}
            key={`${label}-${index}`}
            data-has-error={isError}
            data-tab
          >
            <span>{label}</span>
          </Tab>
        )))}
      </TabList>
      <div className={styles.root__actions}>
        {children}
      </div>
    </Tabs>

  );

});

export default CustomTabs;
