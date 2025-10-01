import { IconProps } from './Icon.interface';
import styles from './Icon.module.scss';
import Icons from 'assets/icons/sprite.svg';
import * as PhosphorIcons from 'phosphor-react';

/**
 * Icon component that supports both sprite SVGs and Phosphor icons
 * @param {IconProps} props - Component props
 * @returns {JSX.Element} Icon component
 */
const Icon = ({
  name,
  color = '#3A4F41', // Deep Olive Green from design system
  width = 24,
  height = 24,
  phosphor,
  weight = 'regular',
  className = '',
}: IconProps) => {
  // If phosphor prop is provided, use Phosphor icon
  if (phosphor && typeof phosphor === 'string') {
    const IconComponent = PhosphorIcons[phosphor as keyof typeof PhosphorIcons] as React.FC<{
      color: string;
      size: number | string;
      weight: string;
      className: string;
    }>;

    // Check if the icon component exists in PhosphorIcons
    if (IconComponent) {
      return (
        <IconComponent
          color={color}
          size={width}
          weight={weight}
          className={`${styles.root} phosphor-icon-${phosphor} ${className}`}
        />
      );
    }
  }

  // Fallback to the existing sprite SVG system
  return (
    <svg
      className={`${styles.root} icon-${name}`}
      data-icon={name}
      fill={color}
      width={width}
      height={height || width}
      role="presentation"
      aria-hidden="true"
    >
      <use xlinkHref={`${Icons}#icon-${name}`} />
    </svg>
  );
};

export default Icon;
