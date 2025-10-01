import * as React from "react";
import { cloneElement } from 'react';
import ClassNames from 'classnames';

interface DefaultProps {
  prefixCls?: string;
  className?: string;
}

interface IBreadcrumbProps extends DefaultProps {
  separator?: React.ReactNode;
}

export interface BreadcrumbProps
  extends React.HTMLAttributes<HTMLElement>,
  IBreadcrumbProps { }

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (props, ref) => {
    const {
      prefixCls: customizePrefixCls,
      children,
      separator,
      className,
      ...rest
    } = props;


    const prefixCls = customizePrefixCls ? `${customizePrefixCls}-breadcrumb` : 'ap-breadcrumb';

    const count = React.Children.count(children);
    const clones = React.Children.toArray(children).map((child: any, index) => {
      return cloneElement(
        child,
        {
          prefixCls,
          separator,
          currentPage: index + 1 === count
        },
      )
    });

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumbs"
        className={ClassNames(prefixCls, className)}
        {...rest}
      >
        <ol className={`${prefixCls}-ol`}>
          {clones}
        </ol>
      </nav >
    )
  }
);

export default Breadcrumb;

Breadcrumb.displayName = 'Breadcrumb';
