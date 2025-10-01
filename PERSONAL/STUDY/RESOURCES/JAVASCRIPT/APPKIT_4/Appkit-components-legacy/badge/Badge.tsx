import * as React from 'react';
import ClassNames from 'classnames';
import { KEY_VALUES } from '../utils';

export interface BadgeProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  type?: 'primary' | 'primary-outlined' | 'danger' | 'danger-outlined' | 'warning' | 'warning-outlined' | 'success' | 'success-outlined' | 'info' | 'info-outlined';
  size?: 'sm' | 'lg';
  rounded?: boolean,
  textColor?: string;
  role?: string;
  tabIndex?: number | undefined;
  value?: string;
  onClick?: (event: React.SyntheticEvent) => void;
}

const Badge: React.FC<BadgeProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    type = 'primary',
    className,
    size = 'sm',
    rounded = false,
    children,
    role,
    tabIndex,
    value,
    onClick,
    ...restProps
  } = props;

  const prefixCls = customizePrefixCls ? `${customizePrefixCls}-badge` : 'ap-badge';

  let isRounded;
  if (!value) {
    isRounded = false;
  } else if (/[^\x00-\xff]/.test(value)) {
    isRounded = value.length <= 1;
  } else {
    isRounded = value.length <= 2;
  }

  const clickable = role === 'button' || role === 'link';

  const classNames = ClassNames(prefixCls, className, {
    [`${prefixCls}-${type}`]: type,
    [`${prefixCls}-${size}`]: size,
    [`${prefixCls}-round`]: isRounded || rounded,
    'gesture': clickable
  });

  const onkeydown = (event: React.KeyboardEvent) => {
    const key = event.key;
    if ((KEY_VALUES.ENTER === key || KEY_VALUES.SPACE === key) && role === 'button' ||
      (KEY_VALUES.ENTER === key && role === 'link')) {
      onClick?.(event);
    }
  }

  return (
    <div
      className={classNames}
      role={role}
      tabIndex={clickable ? 0 : tabIndex}
      onClick={clickable ? onClick : undefined}
      onKeyDown={clickable ? onkeydown : undefined}
      {...restProps}
    >
      <span className="ap-badge-text">
        {value}
      </span>
    </div>

  )
};

Badge.displayName = 'Badge';

Badge.defaultProps = {
  type: 'primary' as BadgeProps['type'],
  size: 'medium' as BadgeProps['size'],
  rounded: false as BadgeProps['rounded']
};


export default Badge;








