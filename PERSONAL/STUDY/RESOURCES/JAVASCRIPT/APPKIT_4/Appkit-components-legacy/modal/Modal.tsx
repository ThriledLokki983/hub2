import React, { useEffect, useState } from "react";
import ClassNames from "classnames";
import { KEY_VALUES, usePortal } from '../utils';

import { getScrollWidth } from '../utils/getScrollWidth';

import createFocusTrap from 'focus-trap';

interface IModalProps {

  wrapperStyle?: React.CSSProperties;
  wrapperClassName?: string;

  children?: React.ReactNode,

  footer?: React.ReactNode,
  /**
   * The value of z-index property in css
   */
  zIndex?: number,
  /**
   * The modal visibility
   */
  visible?: boolean,
  /**
   * Cancel callback function
   */
  onCancel?: Function,

  onOpen?: Function,
  /**
  * Callback after modal closed with a parameter which is modalId.
  */
  onClose?: Function
  backdropStyle?: object,
  /**
   * The placement of modal
   */
  placement?: string,
  maskCloseable?: boolean,
  /**
   * Title text of the dialog
   */

  confirm?: Function,
  appModalId?: string,
  closeOnPressEscape?: boolean,
  closable?: boolean,
  initialFocusIndex?: number
  /**
   * Title text of the dialog
   */
  title?: string,
  header?: React.ReactNode;
  icons?: React.ReactNode;
  ariaCloseIconLabel?: string;
  bodyStyle?: React.CSSProperties;
  modalStyle?: React.CSSProperties;
  footerStyle?: React.CSSProperties;
};

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement>,
  IModalProps { }

let activeElement: any = null;
let closeElement;
export const StaticModal = React.forwardRef<HTMLDivElement, ModalProps>((props, ref) => {
  const {
    style,
    backdropStyle,
    className,
    children,
    footer,
    visible = false,
    onOpen,
    onClose,
    onCancel,
    zIndex,
    placement = 'center',
    maskCloseable = true,
    title = '',
    appModalId,
    closeOnPressEscape = true,
    wrapperClassName,
    wrapperStyle,
    footerStyle,
    icons,
    header,
    closable = true,
    ariaCloseIconLabel,
    bodyStyle,
    modalStyle,
    initialFocusIndex = -1,
    ...otherProps
  } = props;

  const escapeRef: any = React.useRef(null);
  const modalRef: any = React.useRef(null);
  const [keyboardFocus, setKeyboardFocus] = React.useState(false);


  escapeRef.current = (e: { key: string; }) => {
    if (closeOnPressEscape && e.key === KEY_VALUES.ESC) {
      handleClose?.(e);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", escapeRef.current, false);
  }, [])

  useEffect(() => {

    if (visible) {
      typeof onOpen === 'function' && onOpen();
      if (modalRef.current) {
        activeElement = document.activeElement;

        const focusable = modalRef.current.querySelectorAll('button, [href], input, select, textarea, li, a,[tabindex]:not([tabindex="-1"])');
        let focusIndex = initialFocusIndex >= 0 ? initialFocusIndex : focusable.length + initialFocusIndex;
        const focusTrap = createFocusTrap(modalRef.current, {
          // initialFocus: focusable[focusIndex] || focusable[0],
          initialFocus: focusable[0],
          clickOutsideDeactivates: true,
          escapeDeactivates: true
        });
        setTimeout(() => {
          focusTrap.activate();
        }, 50)
      }
    } else {

      typeof onClose === 'function' && onClose();

      setTimeout(() => {
        // setKeyboardFocus(true);
        if (activeElement && document.activeElement && (['body', 'button'].indexOf(document.activeElement.tagName.toLowerCase()) > -1)) {
          activeElement.focus();
        }
      }, 350);
    }
  }, [visible])


  const wrapperClasses = ClassNames("ap-modal-wrapper", wrapperClassName,
    {
      "show": visible,
    }
  );

  const modalClasses = ClassNames("ap-modal", className);

  const handleClose = (e: any): void => {
    onCancel?.();
    window.removeEventListener("keydown", escapeRef.current, false);
    escapeRef.current = null;
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>): void => {
    // setKeyboardFocus(false);
  }

  const wrapperClickHandle = (event: any): void => {
    if (event?.target.closest('.ap-modal') || !event?.target.closest('.ap-modal-wrapper')) return;
    if (maskCloseable) {
      onCancel?.();
    }
  }

  let ariaLabel;
  if (title && title.length > 0) {
    ariaLabel = 'the modal of ' + title;
  }

  const alignItemsStyle = placement === 'top' ? 'flex-start' : placement === 'bottom' ? 'flex-end' : 'center';
  const justifyContentStyle = placement === 'top' ? 'center' : placement === 'bottom' ? 'center' : placement;

  const innerWrapperStyle = { alignItems: alignItemsStyle, justifyContent: justifyContentStyle, ...wrapperStyle };

  const closeclasses = ClassNames(' ap-modal-header-icon ap-modal-header-close', {
    // 'keyboard-focus': keyboardFocus
  })

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === KEY_VALUES.TAB) {
      // setKeyboardFocus(true);
    }
  }

  return (
    <div className="ap-modal-root" style={{ visibility: visible ? 'visible' : 'hidden' }}>
      <div
        id={appModalId}
        className={wrapperClasses}
        style={innerWrapperStyle}
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={wrapperClickHandle}
      >

        <div ref={modalRef} className={modalClasses} style={modalStyle}>
          <div className="ap-modal-header">
            {header}
            <div className="ap-modal-title">
              {title}
            </div>
            <div className="ap-modal-header-icons">
              {icons}
            </div>
            {closable &&
              <div className="ap-modal-header-close-wrapper">
                <button
                  type="button"
                  className={closeclasses}
                  aria-label={ariaCloseIconLabel || 'Close'}
                  onClick={handleClose}
                  onKeyDown={handleKeyDown}
                  onMouseDown={handleMouseDown}
                >
                  <span className="Appkit4-icon icon-close-outline"></span>
                </button>
              </div>}

          </div>

          <div className="ap-modal-body" style={bodyStyle}>
            {children}
          </div>
          {footer && <div className="ap-modal-footer" style={footerStyle}>
            <span></span>
            <div className="ap-modal-footer-customize">
              {footer}
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
})

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>((props: ModalProps, ref) => {
  const { Portal } = usePortal();
  useEffect(() => {

    if (props.visible) {
      let scrollWidth = getScrollWidth();
      if (document.body.style.overflow !== 'hidden') {
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = scrollWidth + 'px';
      }


    } else {
      setTimeout(() => {
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
      }, 350);
    }
  }, [props.visible])
  useEffect(() => {

    return () => {
      setTimeout(() => {
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
      });
    }
  }, [])
  return <Portal>
    <StaticModal ref={ref} {...props} />
  </Portal>
})
