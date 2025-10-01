import { useMemo, Fragment } from 'react';
import { useUserContext } from 'contexts';
import { AlertBar } from '..';

import { TopContentProps } from './TopContent.interface';
import styles from './TopContent.module.scss';

const TopContent = ({
  content,
  isDetails = false,
  showAlert = false,
  children,
  ...rest
}: TopContentProps) => {

  const { user } = useUserContext();

  const userFirstName = useMemo(
    () => user.profile.first_name || 'User',
    [user]
  );

  return (
    <section className={styles.root} data-header-content data-details={isDetails} {...rest}>
      {!isDetails ? (
        <Fragment>
          <h3>Hey, {userFirstName}</h3>
          <p>Navigate and stay compliant with tailored sustainability regulations based on your role and expertise.</p>
        </Fragment>
      ) : null}
      {showAlert ? (
        <div className={styles.root__alert}>
          <AlertBar variation={"warning"}>
            <span>{ content || "Please note that the data below is a test sample data. Also, some functionalities may not be available yet...."}</span>
          </AlertBar>
        </div>
      ) : null}
      {children}
    </section>
  );

};

export default TopContent;
