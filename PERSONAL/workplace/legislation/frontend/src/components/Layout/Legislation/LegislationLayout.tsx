import { Fragment, useLayoutEffect } from 'react';
import { Outlet, useParams, useOutletContext, useNavigate } from 'react-router-dom';

import { Footer } from 'components';
import { PATH_LEGISLATION_ALL } from 'configs/paths';
import { UserInterface } from 'hooks/interfaces';

import styles from './LegislationLayout.module.scss';
interface OutletContextProps {
  user: UserInterface
}


function LegislationLayout() {

  const navigate = useNavigate();
  const { legislationId } = useParams();
  const outletContext = useOutletContext<OutletContextProps>();


  /**
   * Redirect to the all legislation page if the legislation ID is not provided.
   * Update global title.
   * Note: this is needed when this page is rendered outside `react-router`.
  */
  useLayoutEffect(() => {
    if (!legislationId) {
      navigate(PATH_LEGISLATION_ALL, { replace: true });
    }
  }, [navigate, legislationId]);

  return (
    <Fragment>
      <main id="content" className={styles.root} data-details-page={`${legislationId !== undefined}`.toString()}>
        <Outlet context={{ user: outletContext.user }}/>
      </main>
      {legislationId ? null : <Footer data-is-admin={outletContext.user.is_admin} data-page='legislation' details-page={`${legislationId !== undefined}`.toString()}/>}
    </Fragment>
  );

}

export default LegislationLayout;
