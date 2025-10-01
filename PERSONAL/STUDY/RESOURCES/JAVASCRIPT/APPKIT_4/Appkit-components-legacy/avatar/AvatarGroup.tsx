import * as React from 'react';
import Avatar, { AvatarProps } from './Avatar';

export interface AvatarGroupProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  // prefixCls?: string;
  max?: number;
  maxStyle?: React.CSSProperties;
  // size?: AvatarProps['size'];
  withMask?: boolean;
  spacing?: number;
}

const AvatarGroup: React.FC<
  AvatarGroupProps
> = ({
  // size,
  children,
  max = 5,
  className,
  withMask = false,
  spacing = -4,
  style,
  ...rest
}) => {
    const childrenWithProps =
      React.Children.map(children as React.ReactElement[],
        (
          child,
          index,
        ) => {
          let isFirstAvatar = index === 0;
          return React.cloneElement(
            child,
            {
              mask: withMask && (isFirstAvatar ? '' : 'mask'),
              key: `avatar-key-${index}`,
              style: { ['marginLeft']: spacing, ...child.props.style }
            },
          );
        },
      );

    const flexStyle = { display: 'inline-flex' };

    const numOfChildren = childrenWithProps.length;
    if (max && max < numOfChildren) {
      let childrenShow = childrenWithProps.slice(0, max);
      const excess = numOfChildren - max;
      childrenShow.unshift(<Avatar label={`+${excess}`} />);
      return (
        <div role="group" className={'ap-avatar-group'} style={{ ...flexStyle, ...style }} {...rest}>
          {childrenShow}
        </div>
      );
    }

    return (
      <div role="group" className={'ap-avatar-group'} style={{ ...flexStyle, ...style }} {...rest}>
        {childrenWithProps}
      </div>
    );
  };

AvatarGroup.displayName = 'AvatarGroup';

export default AvatarGroup;