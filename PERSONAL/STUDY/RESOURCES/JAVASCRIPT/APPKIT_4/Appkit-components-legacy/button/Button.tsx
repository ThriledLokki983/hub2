import React, { forwardRef, useEffect } from 'react';
import classnames from 'classnames';
import { KEY_VALUES, mergeRefs } from '../utils';


interface IButtonProps {
  /**
   * The kind of the button
   */
  kind?: 'primary' | 'secondary' | 'tertiary' | 'negative' | 'text',
  /**
   * The type aria attribute of HTML button element semantics, apply to the main button
   */
  type?: 'submit' | 'reset' | 'button',
  /**
   * The role aria attribute of HTML semantics, apply to the main button
   */
  // role?: 'button' | 'link',
  /**
   * If `true`, the button will be disabled
   */
  disabled?: boolean,
  /**
   * if `true`, display loading icon
   */
  isLoading?: boolean,
  /**
   * The content of the button
   */
  children?: string | React.ReactNode,
  /**
   * No style button
   */
  isNoStyleButton?: Boolean,
  /**
   * Whether the button is an add button
   */
  add?: Boolean,
  /**
   * Name of the icon
   */
  icon?: string,
  /**
   * Whehter the button is compact
   */
  compact?: Boolean,
  /**
   * The inline style of the component
   */
  style?: React.CSSProperties,
  /**
   * TThe style class names of the component
   */
  className?: string,
  loading?: boolean,
  onClick?: (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => void
};

export interface ButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'>,
  IButtonProps { }

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {

  const {
    kind = 'primary',
    type = 'button',
    add = false,
    icon = '',
    compact = false,
    disabled = false,
    children = '',
    style,
    loading = false,
    isLoading = false,
    className,
    isNoStyleButton,
    tabIndex = 0,
    role = 'button',
    onFocus,
    onBlur,
    onClick,
    ...others
  } = props;

  const divRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  const [keyboardFocus, setKeyboardFocus] = React.useState(true);

  const isLoadingBtn =  ('loading' in props);

  // useEffect(() => {
  //   const eventHandler = (event: KeyboardEvent) => {
  //     const keycode = event.which;
  //     if (keycode === 9) {
  //       const ele = buttonRef.current?.querySelector('.ap-button');
  //       ele?.classList.add('keyboard-focus');
  //     }
  //   }

  //   const eventClickHandler = (event: MouseEvent) => {
  //     const ele = buttonRef.current?.querySelector('.ap-button');
  //     ele?.classList.remove('keyboard-focus');
  //   }

  //   window.addEventListener('keydown', eventHandler);
  //   window.addEventListener('click', eventClickHandler);

  //   return () => {
  //     window.removeEventListener('keydown', eventHandler);
  //     window.removeEventListener('click', eventClickHandler);
  //   };
  // });


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setKeyboardFocus(false);

    if (loading) {
      return;
    };
    onClick?.(event);
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setKeyboardFocus(false);
  }

  const handleButtonFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
    if (loading) {
      return;
    };
    onFocus?.(event);
  }

  const handleButtonBlur = (event: React.FocusEvent<HTMLButtonElement>) => {
    setKeyboardFocus(true);
    if (loading) {
      return;
    };
    onBlur?.(event);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === KEY_VALUES.TAB) {
      setKeyboardFocus(true);
    } else if (event.key === KEY_VALUES.ENTER || event.key === KEY_VALUES.SPACE) {
      event.preventDefault();
      onClick?.(event);
    }
  }
  
  const classes = classnames('ap-button', `ap-button-${kind}`, className, {
    'ap-button-icon-only': add,
    'ap-button-icon': add || icon,
    'ap-button-compact': compact,
    'ap-button-loading': !add && isLoadingBtn,
    'in-loading': loading,
    'keyboard-focus': keyboardFocus
  });

  const classNameIcon: string = classnames('Appkit4-icon', icon, {
    'icon-plus-outline': add && !icon
  });

  const classNameLoading: string = classnames('ap-button-label', {
    'hidden': isLoadingBtn && loading,
  });

  const classNameAnimation: string = classnames('ap-button-loading-icon', {
    'hidden': true,
    'loading-animation': loading
  });

  let stmer;

  if (loading) {
    stmer = setTimeout(() => {
      if (divRef.current) {
        (divRef.current as HTMLElement).classList?.remove('hidden');
      }
    }, 300)
  } else {
    clearTimeout(stmer);
    if (divRef.current) {
      (divRef.current as HTMLElement).classList?.add('hidden');
    }
  }


  return (
    <button
      ref={mergeRefs(ref, buttonRef)}
      className={classes}
      style={style}
      disabled={disabled}
      onFocus={handleButtonFocus}
      onBlur={handleButtonBlur}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      aria-disabled={disabled}
      aria-label={add ? "add" : undefined}
      tabIndex={loading ? -1 : tabIndex}
      role={role}
      type={type}
      {...others}
    >
      {
        isLoadingBtn ?
          <>
            <span className="label-hidden">
              {icon && <span className={classNameIcon}></span>}
              {children && <span className='ap-font-medium' >{children}</span>}
            </span>
            <span className={classNameLoading}>
              {icon && <span className={classNameIcon}></span>}
              {children && <span className='ap-font-medium'>{children}</span>}
            </span>
            <span ref={divRef} className={classNameAnimation}></span>
          </> : add ? <span className={classNameIcon}></span> : (
            <>
              {icon && <span className={classNameIcon}></span>}
              {children && <span className='ap-button-label ap-font-medium'>{children}</span>}
            </>
          )
      }
    </button >
  );
});

Button.defaultProps = {
  kind: 'primary'
};

export default Button;
