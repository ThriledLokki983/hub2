import React, { forwardRef } from 'react';
import ClassNames from "classnames";


interface IPanelProps {
    title?: string;
    extra?: string | React.ReactNode,
    bordered?: boolean,
    style?: React.CSSProperties,
    children?: React.ReactNode,
    footer?: string | React.ReactNode;
}

export interface PanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    IPanelProps { }

const Panel = forwardRef<HTMLDivElement, PanelProps>((props, ref) => {
    const {
        title,
        className,
        bordered = true,
        extra,
        children,
        footer,
        ...restPorps
    } = props;


    const classNames = ClassNames("ap-panel", className, {
        "ap-panel-bordered": bordered
    });

    const header = (title || extra) &&
        (
            <div className={ClassNames('ap-panel-head', {
                'has-extra': extra
            })}>
                <div className="ap-panel-head-wrapper">
                    <div className="ap-panel-head-title" aria-label={title}>
                        <div className="ap-panel-head-title-text">
                            {title}
                        </div>
                    </div>

                </div>
            </div>
        );

    return (
        <div ref={ref} className={classNames} {...restPorps}>
            {header}
            <div className="ap-panel-body">
                <div className="ap-panel-content">
                    {children}
                </div>
                {footer && <div className="ap-panel-footer">{footer}</div>}
            </div>
            {extra && <div className="ap-panel-extra">
                {extra}
            </div>}

        </div>
    );
})

export default Panel