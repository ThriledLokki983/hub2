import { useMemo  } from 'react';
import { AvatarProps } from './Avatar.interface';

import { composeInitialsFromEmail } from 'helpers/utils';

import styles from './Avatar.module.scss';
import { UserInterface, UserProfile } from 'hooks/interfaces';

const Avatar = ({ userData, onClickHandler }: AvatarProps) => {

  const userInitials = useMemo(
    () => composeInitialsFromEmail((userData as UserProfile).email || (userData as UserInterface).profile.email),
    [userData]
  );

  return (
    <article className={styles.root}>
      <span onClick={() => onClickHandler()}>
        {userInitials}
      </span>
    </article>
  )
};

export default Avatar;
