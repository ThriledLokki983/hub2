import { useEffect } from 'react';

import { useUserContext } from 'contexts';

import styles from './Loading.module.scss';

interface LoadingProps {
  amount?: number;
  char?: string;
  [key: string]: any;
}


const Loading = ({ amount = 3, char = '•', ...props }: LoadingProps) => {

  const { logout } = useUserContext();

  // logout user if loading takes too long 250 - milliseconds
  useEffect(() => {
    if (window.location.href === '/logout') return;

    const timeout = setTimeout(() => {
      logout();
      window.location.reload();
    }, 1500);

    return () => clearTimeout(timeout);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.root} {...props}>
       {new Array(amount).fill(char).map((value, index) => (
        <span
          key={`loading-dot-${index}`}
          style={{ animationDelay: `${index * 180}ms` }}
          className={styles.root__dot}
        >
          {value}
        </span>
      ))}
    </div>
  );

};

export default Loading;
