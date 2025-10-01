import React from 'react';
import ClassNames from 'classnames';

interface IModalFooterProps {
  children?: React.ReactNode,
  className?: string,
  style?: React.CSSProperties,
}

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement>,
  IModalFooterProps { }

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(({
    style = { justifyContent: 'flex-end' },
    className = '',
    children,
    ...others
}: ModalFooterProps, ref) => {
    const classNames = ClassNames('ap-modal-footer', className);
    return (
        <div className={classNames} ref={ref} style={style} {...others}>
            <div className='ap-modal-footer-customize'>{children}</div>
        </div>
    );
});

ModalFooter.displayName = 'ModalFooter';
export default ModalFooter;
