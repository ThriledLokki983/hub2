import { useMemo } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

import { AsideProps } from './Aside.interface';
import { Tour } from 'components';
import { PATH_NAVIGATOR_LANDING } from 'configs/paths';
import styles from './Aside.module.scss';

const Aside = ({ user, onNext, onPrevious, children, ...props }: AsideProps) => {
  const location = useLocation();
  const isLandingPage = Boolean(matchPath(location.pathname, PATH_NAVIGATOR_LANDING));
  const showAsideTour = useMemo(() => user.show_aside_tour, [user.show_aside_tour]);

  /**
   * Handle next button in the tour guide
   */
  const onNextTourHandler = () => {
    if (onNext && typeof onNext === 'function') {
      onNext();
    }
  };

  /**
   * Handle Previous button in the tour guide
   */
  const onPreviousTourHandler = () => {
    if (onPrevious && typeof onPrevious === 'function') {
      onPrevious();
    }
  };

  return (
    <aside
      className={styles.root}
      data-show-guide={showAsideTour}
      {...props}
    >
      {children}

      {showAsideTour && isLandingPage ? (
        <Tour
          user={user}
          firstButton=''
          onNext={onNextTourHandler}
          onPrevious={onPreviousTourHandler}
          data-first-tour
        />
      ): null}
    </aside>
  );

};

export default Aside;
