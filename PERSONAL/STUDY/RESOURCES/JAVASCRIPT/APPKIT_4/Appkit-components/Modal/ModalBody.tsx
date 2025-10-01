import React from 'react';
import ClassNames from 'classnames';

interface IModalBodyProps {
  children?: React.ReactNode,
  style?: React.CSSProperties,
  className?: string
}

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement>,
  IModalBodyProps { }

const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(({
    style,
    className = '',
    children,
    ...others
}: ModalBodyProps, ref) => {
    const classNames = ClassNames('ap-modal-body', className);
    return (
        <div className={classNames} ref={ref} style={style} {...others}>
            {children}
        </div>
    );
});

ModalBody.displayName = 'ModalBody';
export default ModalBody;
