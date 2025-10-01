import { Link } from 'react-router-dom';
import { BackLinkProps } from './BackLink.interface';

import styles from './BackLink.module.scss';
import ChevronIcon from 'assets/icons/left-chevron-outline.svg?react';


const BackLink = ({
  to = -1,
  children,
  onClick = () => null,
  showIcon = true,
  ...props
}: BackLinkProps) => {

  return (
    <nav className={styles.root} back-link="" {...props}>
      <Link to={to} onClick={onClick}>
        {showIcon ? <ChevronIcon aria-hidden="true" /> : null}
        <span>{children}</span>
      </Link>
    </nav>
  );

};

export default BackLink;
