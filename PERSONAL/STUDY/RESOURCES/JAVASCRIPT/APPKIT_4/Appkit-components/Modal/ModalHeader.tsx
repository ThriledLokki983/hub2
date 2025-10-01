import * as React from 'react';
import ClassNames from 'classnames';

interface IModalHeaderProps {
  closable?: boolean,
  onCancel?: Function,
  title?: string,
  icons?: React.ReactNode,
  headerComponent?: Function,
  children?: React.ReactNode,
  className?: string,
  style?: React.CSSProperties,
  ariaCloseIconLabel?: string;
}

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
                {closable
                    && (
                        <button
                            type="button"
                            className="ap-modal-header-icon ap-modal-header-close"
                            aria-label={ariaCloseIconLabel || 'Close'}
                            onClick={handleClick}
                        >
                            <span className="Appkit4-icon icon-close-outline"></span>
                        </button>
                    )
                }
            </div>
        </div>
    );
});

ModalHeader.displayName = 'ModalHeader';

export default ModalHeader;
