import * as React from 'react';
import ClassNames from 'classnames';

interface IModalBodyProps {
  /**
   * The content of the ModalBody
   */
  children?: React.ReactNode,
  /**
   * The inline style of the component
   */
  style?: React.CSSProperties,
  /**
   * The style class names of the component
   */
  className?: string
};

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
})


export default ModalBody;
