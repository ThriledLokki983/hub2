import { LoaderProps } from './Loader.interface';

import styles from './Loader.module.scss';

const Loading = ({ amount = 3, char = '•', ...props }: LoaderProps) => {

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
