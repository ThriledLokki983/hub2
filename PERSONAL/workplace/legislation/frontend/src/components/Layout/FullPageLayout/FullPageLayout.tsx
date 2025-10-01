import { Fragment, useLayoutEffect } from 'react'
import { Outlet, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { Footer } from 'components';
import { UserInterface } from 'hooks/interfaces';
import { FullPageLayoutProps } from './FullPageLayout.interface';
import { PATH_PROJECTS_ALL } from 'configs/paths';
import styles from './FullPageLayout.module.scss';


interface OutletContextProps {
  user: UserInterface
}

const FullPageLayout = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const { user } = useOutletContext<OutletContextProps>();

  /**
  * Redirect to the all Projects page if the project ID is not provided.
  * Note: this is needed when this page is rendered outside `react-router`.
  */
  useLayoutEffect(() => {
    if (!projectId) {
      navigate(PATH_PROJECTS_ALL, { replace: true });
    }
  }, [navigate, projectId]);


  return (
    <Fragment>
      <main id="content" className={styles.root} data-is-project-details-page={projectId !== null && !location.pathname.includes("logs")}>
        <Outlet context={{ user: user }}/>
      </main>
      {projectId ? null : <Footer data-is-admin={user.is_admin} data-page='projects'/>}
    </Fragment>
  );

};

export default FullPageLayout;
