import * as React from 'react';
import classNames from 'classnames';


interface DefaultProps {
    prefixCls?: string;
    className?: string;
}

export interface BreadcrumbSeparatorProps extends DefaultProps, React.HTMLAttributes<HTMLSpanElement> {
    children?: React.ReactNode;
}

const BreadcrumbSeparator = React.forwardRef<
    HTMLSpanElement,
    BreadcrumbSeparatorProps
>(({ prefixCls: customizePrefixCls, className, ...props }, ref) => {

    const prefixCls = customizePrefixCls ? `${customizePrefixCls}-breadcrumb` : 'ap-breadcrumb';

    return (
        <span
            ref={ref}
            aria-hidden={true}
            className={classNames(`${prefixCls}-separator`, className)}
            {...props}
        />
    );
});

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export default BreadcrumbSeparator;