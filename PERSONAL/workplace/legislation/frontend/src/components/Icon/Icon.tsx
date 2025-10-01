import { FC } from 'react';
import { IconProps } from './Icon.interface';

import * as AllIcons from 'assets/icons/icons';
import styles from './Icon.module.scss';
import Icons from 'assets/icons/sprite.svg';


/**
 * @TODO: further memoize this component?
 */
export const Icon = ({ width = 24, height = 24, color = 'black', name = 'common', ...props }: IconProps) => {

  return (
    <svg
      className={`${styles.root} icon-${name}`}
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height ?? width}
      color={color}
      {...props}
    >
      {/* <use xlinkHref={`/sprite.svg#icon-${name}`} /> */}
      <use xlinkHref={`${Icons}#icon-${name}`} />
    </svg>
  );
};

export const IconComponent = ({ name, ...props }: { name: string, [key: string]: any }) => {
  const MainIconComponent = (AllIcons as unknown as { [key: string]: FC<any> })[name];

  if (!MainIconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <MainIconComponent {...props} aria-hidden="true" />;
};

export default Icon;
