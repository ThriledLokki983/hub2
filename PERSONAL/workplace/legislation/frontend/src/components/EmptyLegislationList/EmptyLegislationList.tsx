import { EmptyLegislationListProps } from './EmptyLegislationList.interface';

import styles from './EmptyLegislationList.module.scss'


const EmptyLegislationList = ({ query, showContent, isNavigator,children, ...props }: EmptyLegislationListProps) => {
  return (
    <li className={styles.root} hidden={!showContent} {...props}>
      <span className={styles.root__empty}>
        {isNavigator ? (
          <>
            Sorry, we could not find any legislation that matches the selected tab or filters/query: &nbsp;
            <strong><mark>{query}</mark></strong>
          </>
          ) : (
            <>
              &nbsp; Sorry, we could not find any legislation, please apply filters and click on the 'Navigate Legislation' to try again
            </>
          )}
      </span>
      {children}
    </li>
  );

};

export default EmptyLegislationList
