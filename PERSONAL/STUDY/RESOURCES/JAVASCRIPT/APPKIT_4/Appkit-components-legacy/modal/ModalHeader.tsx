import * as React from 'react';
import ClassNames from 'classnames';
import { stringify } from 'querystring';


interface IModalHeaderProps {
  /**
   * Whether to close the modal dialog when the mask (area outside the modal) is clicke
   */
  closable?: boolean,
  onCancel?: Function,
  /**
   * Title text of the dialog
   */
  title?: string,
  icons?: React.ReactNode,
  headerComponent?: Function,
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

  ariaCloseIconLabel?: string;
};

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement>,
  IModalHeaderProps { }

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>((props, ref) => {
  const {
    style,
    className = '',
    children,
    closable = true,
    onCancel,
    title,
    icons,
    ariaCloseIconLabel,
    headerComponent = () => { },
    ...others
  } = props;

  const classNames = ClassNames('ap-modal-header', className);

  const handleClick = (e: any): void => {
    if (closable && onCancel) {
      onCancel(e);
    }
  };

  return (
    <div className={classNames} ref={ref} style={style} {...others}>
      {headerComponent()}
      <div className="ap-modal-title">
        {title}
      </div>
      <div className="ap-modal-header-icons">
        {icons}
        {closable &&
          <button
            type="button"
            className="ap-modal-header-icon ap-modal-header-close"
            aria-label={ariaCloseIconLabel || 'Close'}
            onClick={handleClick}
          >
            <span className="Appkit4-icon icon-close-outline"></span>
          </button>}
      </div>
    </div>
  );
});

ModalHeader.displayName = 'ModalHeader';

export default ModalHeader;
