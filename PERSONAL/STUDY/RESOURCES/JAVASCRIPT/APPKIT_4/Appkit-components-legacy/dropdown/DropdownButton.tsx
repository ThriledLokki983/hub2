import * as React from 'react';
import { useMemo, useCallback, useState, useLayoutEffect } from 'react';
import classNames from 'classnames';
import { Button, ButtonGroup, ButtonProps } from '../button';
import { DropdownMenu, OptionListContext } from '../select';
import useOptions from '../select/useOptions';
import { KEY_VALUES, useClickOutside } from '../utils';
import { useFocusItemValue, onMenuKeyDown } from './utils';

import { flattenItemsFun } from '../select/utils';

export type ValueType = number | string;

export type ItemDataType = {
    label?: string;
    value?: string;
    url?: string;
    descValue?: string;
    disabled?: boolean;
    [key: string]: any;
}

export interface DropdownButtonProps {
    // prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    type?: 'submit' | 'reset' | 'button';
    role?: 'button' | 'link';
    // The className of dropdown menu
    dropdownClassName?: string;
    // The style of dropdown menu
    dropdownStyle?: React.CSSProperties;
    visible?: boolean;
    // whether a button group is displayed
    splitButton?: boolean;
    buttonId?: string;
    kind?: ButtonProps['kind'];
    disabled?: boolean;
    compact?: boolean;
    buttonsRender?: (buttons: React.ReactNode[]) => React.ReactNode[];
    // Internal
    apperance?: string;
    // if splitButton is true, triggers when left button is clicked
    onClick?: (event: React.SyntheticEvent) => void;
    // triggers when a dropdown item is clicked
    onSelect?: (value: ValueType, item: ItemDataType, event: React.SyntheticEvent) => void;
    // riggers when the dropdown appears/disappears
    onVisibleChange?: (visible: boolean) => void;
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    // icon?: React.ReactNode;
    // title?: string;
    data: ItemDataType[],
    // Config popup height
    listHeight?: number;
    dropdownMatchWidth?: number | boolean;
    value?: ValueType;
    labelKey?: string;
    valueKey?: string;
    childrenKey?: string;
    children?: React.ReactNode;
    disabledItemValues?: any[];
    dropdownItemArialabel?: boolean;
    prefixTemplate?: (item: ItemDataType) => React.ReactNode;
    suffixTemplate?: (item: ItemDataType) => React.ReactNode;
}

const DropdownButton = React.forwardRef<HTMLDivElement, DropdownButtonProps>((props, ref) => {
    const {
        className,
        type = 'button',
        role = 'button',
        dropdownClassName,
        dropdownStyle,
        disabled,
        children,
        visible: visibleProp = false,
        onVisibleChange,
        getPopupContainer,
        buttonsRender,
        buttonId,
        splitButton,
        kind = 'primary',
        compact = false,
        data,
        apperance = 'button',
        onClick,
        onSelect,
        listHeight,
        dropdownMatchWidth = false,
        labelKey = 'label',
        valueKey = 'value',
        childrenKey = 'children',
        disabledItemValues,
        value,
        dropdownItemArialabel = false,
        prefixTemplate,
        suffixTemplate,
        ...restProps
    } = props;

    let leftButton, rightButton;
    const popupRef = React.useRef<HTMLDivElement>(null);
    const targetRef = React.useRef<HTMLElement>(null);

    const [visible, setVisible] = useState(visibleProp);
    const [internalValue, setInternalValue] = useState(value || '');

    const { flattenItems, mergedItems: parsedItems } = useOptions<ItemDataType>(data, children, childrenKey, valueKey, labelKey);

    const displayItems = React.useMemo(
        () =>
            flattenItemsFun(parsedItems, { childrenKey, valueKey, labelKey }),
        [parsedItems],
    );

    const dropdownProps = {
        id: 'groupdropdown',
        role: 'menu',
        disabled,
        visible,
        // getPopupContainer: getPopupContainer || popupRef?.current,
        className: classNames('ap-button-dropdown', dropdownClassName),
        style: dropdownStyle,
        // listHeight: listHeight || 256,
        // onVisibleChange,
        dropdownItemArialabel,
        prefixTemplate,
        suffixTemplate
    };

    const buttonAriaAttributes: React.ButtonHTMLAttributes<HTMLButtonElement> = useMemo(() => {
        return {
            'aria-haspopup': true,
            'aria-expanded': visible,
            'aria-controls': (buttonId ? buttonId : splitButton ? 'group' : 'menu') + 'dropdown',
            className: splitButton ? 'group-right' : '',
            compact,
            disabled,
            ref: targetRef
        };
    }, [visible, buttonId, splitButton, compact]);

    const buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement> =
        useMemo(() => {
            return {
                id: buttonId,
                ...buttonAriaAttributes,
                // visible
            };
        }, [buttonId, buttonAriaAttributes, visible]);

    useLayoutEffect(() => {
        if (visible && popupRef.current) {
            if (typeof dropdownMatchWidth === 'number') {
                popupRef.current.style.width = `${dropdownMatchWidth}px`;
            } else if (dropdownMatchWidth) {
                const width = targetRef.current?.offsetWidth;
                popupRef.current.style.width = `${width}px`;
            }
        }
    }, [popupRef.current, visible, dropdownMatchWidth]);

    const hideOnClickOutside = () => {
        if (visible) {
            setVisible(false);
            onVisibleChange?.(false);
        }
    };

    const {
        focusItemValue,
        setFocusItemValue,
        onKeyDown: handleKeyDown,
        findFocusItemIndex,
    } = useFocusItemValue(internalValue, visible, {
        items: flattenItems,
        labelKey,
        valueKey,
        disabledItemValues,
    });

    const handleKeyDownEvent = (event: React.KeyboardEvent) => {

        const { key } = event;
        const isDown = key === KEY_VALUES.DOWN;
        const isUp = key === KEY_VALUES.UP;
        const isEnter = key === KEY_VALUES.ENTER
        const isSpace = key === KEY_VALUES.SPACE;

        if ((isEnter || isSpace) && !splitButton) {
            onClick?.(event);
        }

        if (!visible) {
            if (isEnter || isDown || isSpace || isUp) {
                event.preventDefault();
                setVisible(true);
                onVisibleChange?.(true);
                // void -> visible
                // UP -> reverse
                // DOWN
                findFocusItemIndex(((item: any, index: number) => {
                    if (index === -1 && item.length > 0) {
                        setFocusItemValue({ keyboard: true, value: item[0][valueKey] });
                    } else if (index > -1) {
                        setFocusItemValue({ keyboard: true, value: item[index][valueKey] });
                    }
                }), '', isUp)
            }
            return;
        }

        onMenuKeyDown(event, {
            enter: handleSelect,
            esc: handleClose
        });

        handleKeyDown(event);
    }

    const handleClose = (event: any) => {
        if (visible) {
            event.stopPropagation();
        }
        setVisible(false);
        onVisibleChange?.(false)
    }

    const onInternalSelect = useCallback((v: any, item: any, event: any) => {
        setInternalValue(v);
        setFocusItemValue({ keyboard: false, value: v });
        setVisible(false);
        onSelect?.(v, item, event);
        onVisibleChange?.(false);
    }, [onSelect, displayItems]);


    const handleToggle = (event: React.SyntheticEvent) => {
        if (disabled) {
            return;
        }
        event.stopPropagation();
        const newVisible = !visible;
        setVisible(newVisible);
        setFocusItemValue({ ...focusItemValue, keyboard: false });
        onVisibleChange?.(newVisible);
        if (splitButton) {
            return;
        }
        onClick?.(event);
    }

    const handleSelect = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!focusItemValue.value) {
            return;
        }

        setInternalValue(focusItemValue.value!);
        setVisible(false);

        const index = flattenItems.findIndex((item: ItemDataType) => item[valueKey] === focusItemValue.value)

        onSelect?.(focusItemValue.value, flattenItems[index], event);
        onVisibleChange?.(false);

    }, [visible, onSelect, onVisibleChange, focusItemValue]);

    useClickOutside({
        enabled: visible,
        isOutside: event => !popupRef.current?.contains(event.target as HTMLElement) && !targetRef.current?.contains(event.target as HTMLElement),
        handle: hideOnClickOutside
    });

    const handleLeftClick = (e: React.SyntheticEvent) => {
        if (disabled) {
            return;
        }
        onClick?.(e);
    }

    rightButton = (
        <Button
            kind={kind}
            disabled={disabled}
            // @ts-ignore
            onClick={handleToggle}
            onKeyDown={handleKeyDownEvent}
            {...buttonProps}
        >
            {!splitButton && children}
            <span className={classNames("Appkit4-icon icon-down-chevron-outline", { 'rotate': visible, 'disabled': disabled })} aria-hidden></span>
        </Button>
    )

    if (splitButton) {
        leftButton = (
            <Button
                kind={kind}
                disabled={disabled}
                compact={compact}
                // @ts-ignore
                onClick={handleLeftClick}
                className="group-left"
                role={role}
                type={type}
            >
                {children}
            </Button>
        )
    }

    const [leftButtonToRender, rightButtonToRender] = buttonsRender!([leftButton, rightButton]);

    const wrapperClassed = classNames(className, {
        'ap-field-dropdown-wrapper': apperance === 'field',
        'ap-buttons-wrapper': apperance === 'button'
    })

    const selectContext = React.useMemo(() => {
        return {
            flattenItems: displayItems,
            onSelect: onInternalSelect,
            focusItemValue,
            selectedValues: internalValue,
            disabledItemValues
        };
    }, [
        displayItems,
        onInternalSelect,
        focusItemValue,
        internalValue,
        disabledItemValues
    ]);

    return (

        <div className={wrapperClassed} {...restProps}>
            {apperance === 'button' ?
                <ButtonGroup
                    className={classNames(className, {
                        [`ap-group-buttons`]: splitButton,
                        [`ap-menu-buttons`]: !splitButton
                    })}
                    {...restProps}
                >
                    {leftButtonToRender}
                    {rightButtonToRender}
                </ButtonGroup> :
                React.cloneElement(children as React.ReactElement, {
                    onKeyDown: handleKeyDownEvent,
                    onClick: handleToggle,
                    ref: targetRef
                })
            }
            <OptionListContext.Provider value={selectContext}>
                {
                    // @ts-ignore
                    (apperance === 'button' && visible || apperance === 'field') && <DropdownMenu ref={popupRef} {...dropdownProps}></DropdownMenu>
                }
            </OptionListContext.Provider>
        </div >
    );
});

DropdownButton.defaultProps = {
    buttonsRender: (buttons: React.ReactNode[]) => buttons,
};

DropdownButton.displayName = 'DropdownButton';

export default DropdownButton;
