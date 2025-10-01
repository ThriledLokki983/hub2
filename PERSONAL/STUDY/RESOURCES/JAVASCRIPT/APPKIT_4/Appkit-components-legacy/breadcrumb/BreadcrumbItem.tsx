
import React, { Children, Component } from 'react';
import ClassNames from 'classnames';
import { BreadcrumbProps } from './Breadcrumb';


export interface BreadcrumbItemProps extends BreadcrumbProps {
  currentPage?: boolean;
  lastChild?: boolean;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLSpanElement>;
}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  (props, ref) => {

    const {
      className,
      separator,
      currentPage,
      children,
      prefixCls = 'ap-breadcrumb',
      ...rest
    } = props;

    const renderSeparator = () => {
      if (!currentPage) {
        return (
          <div
            aria-hidden
            className={`${prefixCls}-separator`}
          >
            {separator || <span className="Appkit4-icon icon-right-chevron-outline"></span>}
          </div>
        )
      }
      return null;
    }

    const Comp = currentPage ? "span" : "a";

    return (
      <li className={ClassNames(`${prefixCls}-item`, className, { 'last': currentPage })} {...rest}>
        {children}
        {renderSeparator()}
      </li>
    );
  }
);

export default BreadcrumbItem;
