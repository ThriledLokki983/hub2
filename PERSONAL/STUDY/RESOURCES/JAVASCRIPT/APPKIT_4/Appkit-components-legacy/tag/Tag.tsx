import * as React from 'react';
import classNames from 'classnames';
import { KEY_VALUES, setupGetInstanceId } from '../utils';

const getInstanceId = setupGetInstanceId();

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  label?: string;
  prefixCls?: string;
  closable?: boolean;
  // closeIcon?: React.ReactNode;
  // visible?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => void;
  size?: "sm" | "lg";
  color?: string;
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({
    prefixCls: customizePrefixCls,
    className,
    style,
    id,
    icon,
    onClose,
    // closeIcon,
    color,
    closable = true,
    size = 'sm',
    disabled = false,
    label,
    children,
    title = 'clear tag',
    ...props
  },
    ref,
  ) => {
    // const [visible, setVisible] = React.useState(true);

    // React.useEffect(() => {
    //   if ('visible' in props) {
    //     setVisible(props.visible!);
    //   }
    // }, [props.visible]);

    const prefixCls = customizePrefixCls ? `${customizePrefixCls}-tag` : 'ap-tag';
    const tagId = id || `tag-${getInstanceId()}`;
    const tagClassName = classNames(prefixCls, 'ap-tag-default', className,
      {
        // [`${prefixCls}-hidden`]: !visible,
        [`${prefixCls}-${size}`]: size,
        [`${prefixCls}-disabled`]: disabled
      }
    );

    const tagStyle = {
      backgroundColor: color ? color : undefined,
      ...style,
    };

    const handleCloseClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (onClose) {
        onClose(event);
      }
      // if (e.defaultPrevented) {
      //   return;
      // }
      // if (!('visible' in props)) {
      //   setVisible(false);
      // }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      
      const { key } = event;
      if (KEY_VALUES.SPACE === key || KEY_VALUES.ENTER === key) {
        event.preventDefault();
        if (onClose) {
          onClose(event);
        }
      }

    }

    const renderCloseIcon = () => {
      if (closable) {
        return (
          <button
            type="button"
            className="Appkit4-icon icon-close-outline"
            title={title}
            disabled={disabled}
            aria-disabled={disabled}
            aria-labelledby={tagId}
            onClick={handleCloseClick}
            onKeyDown={handleKeyDown}
          />
        );
      }
      return null;
    };

    if (!label) {
      typeof children === 'string' ? label = children : label = children?.toString();
    }

    const tagNode = (
      <div
        ref={ref}
        className={tagClassName}
        id={tagId}
        style={tagStyle}
        aria-label={label}
        {...props}
      >
        {icon}
        <span className={`${prefixCls}-label`} title={label}>
          {label || children}
        </span>
        {renderCloseIcon()}
      </div>
    );

    return tagNode;
  });

Tag.displayName = 'Tag';

export default Tag;