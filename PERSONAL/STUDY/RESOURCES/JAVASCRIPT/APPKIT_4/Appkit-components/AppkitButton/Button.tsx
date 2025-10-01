import React, { forwardRef } from 'react';
import classnames from 'classnames';
import { KEY_VALUES } from '../../../configs/config';
import { mergeRefs } from '../../../util/helpers';

interface IButtonProps {
  kind?: 'primary' | 'secondary' | 'tertiary' | 'negative' | 'text',
  type?: 'submit' | 'reset' | 'button',
  disabled?: boolean,
    expand?: boolean,
  isLoading?: boolean,
  children?: string | React.ReactNode,
  isNoStyleButton?: Boolean,
  add?: Boolean,
  icon?: string,
  compact?: Boolean,
  style?: React.CSSProperties,
  className?: string,
  loading?: boolean,
  onClick?: (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => void
}

export interface ButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'>,
  IButtonProps { }

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const {
        kind = 'primary',
        type = 'button',
        add = false,
        icon = '',
        expand = false,
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

    const isLoadingBtn = ('loading' in props);

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
        }
        onClick?.(event);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>): void => {
        setKeyboardFocus(false);
    };

    const handleButtonFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
        if (loading) {
            return;
        }
        onFocus?.(event);
    };

    const handleButtonBlur = (event: React.FocusEvent<HTMLButtonElement>) => {
        setKeyboardFocus(true);
        if (loading) {
            return;
        }
        onBlur?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === KEY_VALUES.TAB) {
            setKeyboardFocus(true);
        } else if (event.key === KEY_VALUES.ENTER || event.key === KEY_VALUES.SPACE) {
            event.preventDefault();
            onClick?.(event);
        }
    };

    const classes = classnames('ap-button', `ap-button-${kind}`, className, {
        'ap-button-icon-only': add,
        'ap-button-icon': add || icon,
        'ap-button-compact': compact,
        'ap-button-loading': !add && isLoadingBtn,
        'in-loading': loading,
        'keyboard-focus': keyboardFocus,
        'ap-button-expand': expand || null,
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
        }, 300);
    } else {
        clearTimeout(stmer);
        if (divRef.current) {
            (divRef.current as HTMLElement).classList?.add('hidden');
        }
    }

    const renderContents = () => {
        if (isLoadingBtn) {
            return (<>
                <span className='label-hidden'>
                    {icon && <span className={classNameIcon}></span>}
                    {children && <span className='ap-font-medium' >{children}</span>}
                </span>
                <span className={classNameLoading}>
                    {icon && <span className={classNameIcon}></span>}
                    {children && <span className='ap-font-medium'>{children}</span>}
                </span>
                <span ref={divRef} className={classNameAnimation}></span>
            </>);
        }

        if (add) {
            return (<span className={classNameIcon}></span>);
        }

        return (<>
            {icon && <span className={classNameIcon}></span>}
            {children && <span className='ap-button-label ap-font-medium'>{children}</span>}
        </>);
    };

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
            aria-label={add ? 'add' : undefined}
            tabIndex={loading ? -1 : tabIndex}
            role={role}
            type={type}
            {...others}
        >
            {renderContents()}
        </button >
    );
});

Button.displayName = 'Button';

Button.defaultProps = {
    kind: 'primary',
};

export default Button;
