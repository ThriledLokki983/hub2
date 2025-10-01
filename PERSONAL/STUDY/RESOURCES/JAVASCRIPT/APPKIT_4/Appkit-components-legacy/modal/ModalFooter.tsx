import * as React from 'react';
import ClassNames from 'classnames';

interface IModalFooterProps {
  /**
   * The content of the ModalBody
   */
  children?: React.ReactNode,
  /**
   * The style class names of the component
   */
  className?: string,
  /**
   * The inline style of the component
   */
  style?: React.CSSProperties,
};


export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement>,
  IModalFooterProps { }

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>((
  {
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
}
)

export default ModalFooter;
