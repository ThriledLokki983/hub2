import React from "react";
import ClassNames from 'classnames';

export interface ListItemProps extends Omit<React.HTMLAttributes<HTMLLIElement>, "title"> {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  title?: React.ReactNode;
  description?: React.ReactNode;
  avatar?: React.ReactNode;
}

const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>((props, ref) => {
  const {
    className,
    title,
    description,
    avatar,
    children,

    ...restProps
  } = props;

  const classes = ClassNames('ap-list-item', className);

  return (
    <li role="option" className={classes} tabIndex={0} {...restProps}>
      {(avatar || title || description) && (
        <div className="ap-list-item-meta">
          {
            avatar && (
              <div className="ap-list-item-meta-avatar">
                {avatar}
              </div>
            )
          }
          {
            (title || description) && (
              <div className="a-list-item-meta-content">
                <div className="ap-list-item-meta-title">
                  {title}
                </div>
                <div className="ap-list-item-meta-description">
                  {description}
                </div>
              </div>
            )
          }
        </div>
      )}
      {children}
    </li >
  );
})

export default ListItem;