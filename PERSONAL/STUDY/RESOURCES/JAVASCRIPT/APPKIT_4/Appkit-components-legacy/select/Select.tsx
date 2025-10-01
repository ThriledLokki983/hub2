import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useControlled, KEY_VALUES, useClickOutside, usePortal } from '../utils';
import ClassNames from "classnames";
import OptionListContext from './OptionListContext';
import DropdownMenu from "./DropdownMenu";
import { Input } from '../field'
import { flattenItemsFun } from './utils';
import { _uuid, toArray } from '../utils';
import useOptions from './useOptions';
import useFilterOptions from './useFilterOptions';
import classNames from 'classnames';
import { align } from '../utils/positionElement';


export type ValueType = string | number;
export type SelectValue = ValueType | ValueType[]

export type FocusItemType = {
    keyboard?: boolean;
    value?: ValueType;
}

export type ItemDataType = {

    key?: string;
    value?: string;
    label?: React.ReactNode;
    disabled?: boolean;
    children?: ItemDataType[];
    [key: string]: any;
}

export type RenderDOMFunc = () => HTMLElement;

export interface SelectProps {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    prefixCls?: string;
    placeholder?: string;
    children?: React.ReactNode;

    multiple?: boolean,

    searchable?: boolean;
    searchPlaceholder?: string;
    searchKeyword?: string;
    onSearch?: (value: string) => void;
    autoClearSearchValue?: boolean;

    data?: any[];
    value?: SelectValue;
    defaultValue?: SelectValue;
    disabledItemValues?: any[];
    valueKey?: string;
    labelKey?: string;
    childrenKey?: string;
    required?: boolean;
    disabled?: boolean;
    noResultFound?: React.ReactNode;

    visible?: boolean;
    defaultActiveFirstOption?: boolean;
    onVisibleChange?: (open: boolean) => void;
    onSelect?: (value: any) => void;
    onChange?: (value: string) => void;
    onClear?: () => void;

    listHeight?: number;
    listItemHeight?: number;
    dropdownMatchWidth?: boolean | number;
    dropdownStyle?: React.CSSProperties;
    dropdownClassName?: string;
    getPopupContainer?: RenderDOMFunc;
    dropdownAlwaysDown?: boolean;
    dropdownRenderMode?: string;

    // showSelectAll?: boolean;

    // optionFilterProp?: string;

    filterOption?: boolean | ((value: string, option: ItemDataType) => boolean);
    valueTemplate?: (value: SelectValue) => React.ReactNode;
    itemTemplate?: (label: React.ReactNode, item: ItemDataType) => React.ReactNode;
    badgeTemplate?: (item: ItemDataType) => React.ReactNode;
    prefixTemplate?: (item: ItemDataType) => React.ReactNode;
    suffixTemplate?: (item: ItemDataType) => React.ReactNode;
    /** Whether using virtualized list */
    virtualized?: boolean;
}

const Select: React.FC<SelectProps> = (props) => {
    const {
        id,
        className,
        style,
        prefixCls = 'ap-dropdown',
        data,
        children,
        value: valueProp,
        defaultValue = [],
        required,
        disabled,
        searchable = false,
        defaultActiveFirstOption,
        dropdownMatchWidth = true,
        noResultFound = 'Nothing matches your results',
        virtualized,
        listHeight,
        listItemHeight,
        searchPlaceholder = 'Search',
        searchKeyword: searchKeywordProp,
        placeholder = 'Dropdown',
        onSearch,
        autoClearSearchValue = true,
        visible: visibleProp = false,
        onVisibleChange,
        getPopupContainer,
        dropdownAlwaysDown = true,
        dropdownRenderMode = 'default',
        dropdownStyle,
        dropdownClassName,
        multiple,
        // mode = 'select',
        // showSelectAll = false,
        onSelect,
        filterOption,
        // optionFilterProp,
        valueTemplate,
        itemTemplate,
        badgeTemplate,
        prefixTemplate,
        suffixTemplate,
        valueKey = 'value',
        labelKey = 'label',
        childrenKey = 'children',
        disabledItemValues,
        ...restProps
    } = props;

    const childrenAsData = !!(!data && children);
    const [internalValue, setInternalValue, isControlled] = useControlled(valueProp, defaultValue);
    const [visible, setVisible] = useState(!disabled && visibleProp);
    const [searchWord, setSearchWord] = useState(searchKeywordProp || '');
    const [focusItemValue, setFocusItemValue] = useState<FocusItemType>({
        keyboard: false,
        value: ''
    });

    const popupRef = React.useRef<HTMLDivElement>(null);
    const targetRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    let controlsId = id || `list-${_uuid(8, 16)}`;

    const allSelectedString = "All selected";

    useEffect(() => {
        if (visible && popupRef.current && targetRef.current) {

            const containerWidth = targetRef.current?.offsetWidth;
            if (typeof dropdownMatchWidth === 'number') {
                popupRef.current.style.width = `${dropdownMatchWidth}px`;
            } else if (dropdownMatchWidth) {
                popupRef.current.style.width = `${containerWidth}px`;
            }
        }
    }, [popupRef.current, visible, dropdownMatchWidth]);

    const toggleOpen = useCallback(() => {
        if (disabled) {
            return;
        }

        let newVisible = !visible;
        setTimeout(() => {
            if (!newVisible && searchable && searchWord) {
                let searchWordTemp = searchWord;
                if (autoClearSearchValue) {
                    searchWordTemp = '';
                }
                onSearch?.(searchWordTemp);
                setSearchWord(searchWordTemp);
            }
        }, 300);

        setVisible(newVisible);
        onVisibleChange?.(newVisible);

    }, [disabled, visible, searchable, searchWord, autoClearSearchValue, multiple, onVisibleChange, onSearch]);


    const handleClickOutsidePopup = useCallback((event: MouseEvent) => {
        if (containerRef.current?.contains(event.target as HTMLElement)) {
            return;
        }

        if (visible) {
            toggleOpen();
        }
    }, [toggleOpen, visible, containerRef]);


    const hideOnClickOutside = (event) => {
        if (visible) {
            toggleOpen();
        }
    };

    useClickOutside({
        enabled: dropdownRenderMode === 'default' ? true : false,
        isOutside: event => !containerRef.current?.contains(event.target as HTMLElement) && !popupRef.current?.contains(event.target as HTMLElement),
        handle: hideOnClickOutside
    });

    useClickOutside({
        enabled: dropdownRenderMode === 'portal' ? true : false,
        isOutside: event => !popupRef.current?.contains(event.target as HTMLElement),
        handle: handleClickOutsidePopup
    });


    // @ts-ignore
    const { itemValues, mergedItems: parsedItems, flattenItems } = useOptions<ItemDataType>(data, children, childrenKey, valueKey, labelKey);

    const allStatus = useMemo(() => {
        let disabledLen = 0;
        flattenItems.forEach((flattenItem: ItemDataType) => {
            if (flattenItem.isSelectOption) {
                if (flattenItem.disabled) {
                    disabledLen++;
                }
            }
        });

        const total = itemValues.length;
        const activeLen = toArray(internalValue).length;
        const allActive = total - disabledLen - Math.abs(disabledLen - activeLen) - activeLen === 0;
        const allDisabled = disabledLen === total;

        return { _allActive: allActive, _allDisabled: allDisabled };

    }, [children, internalValue]);

    const { _allActive: allActive, _allDisabled: allDisabled } = allStatus;

    const text = useMemo(() => {
        let value = null;
        if (valueTemplate && typeof valueTemplate === 'function') {
            value = valueTemplate(internalValue);
            return value;
        }

        let selectedString = '';
        const len = toArray(internalValue).length;
        if (allActive) {
            selectedString = 'All Seleted';
        } else if (multiple && len > 0) {
            selectedString = `${len} items selected`;
        } else {
            const index = flattenItems.findIndex((item: ItemDataType) => item[valueKey] === internalValue)
            if (index > -1) {
                selectedString = flattenItems[index][labelKey];
            }
        }

        return selectedString

    }, [placeholder, internalValue, allActive, valueTemplate, multiple]);

    const filteredItems = useFilterOptions(parsedItems, childrenKey, labelKey, searchWord, filterOption);

    const displayItems = React.useMemo(
        () =>
            flattenItemsFun(filteredItems, { childrenAsData, childrenKey, valueKey, labelKey }),
        [filteredItems, childrenAsData],
    );


    const handleValueChange = (v: ValueType) => {
        if (!multiple) {
            setInternalValue(v);
            toggleOpen();
            onSelect?.(v);
            return;
        }

        let newValues: ValueType[] = [].concat(internalValue as []);
        if (newValues.includes(v)) {
            newValues = newValues.filter(i => i !== v);
        } else {
            newValues.push(v);
        }

        setInternalValue(newValues);
        onSelect?.(newValues);
    };

    const onInternalSelect = useCallback((v, item, e, k) => {
        let value = internalValue;
        let vals = [];
        if (isControlled) {
            if (multiple) {
                value = toArray(value);
                if (value.includes && value.includes(v)) {
                    vals = value.filter(ele => {
                        return ele !== v;
                    });
                } else {
                    vals = value.concat(v);
                }

            } else {
                vals = v;
            }
            onSelect?.(vals);
            if (!multiple) {
                toggleOpen();
            }
        } else {
            handleValueChange(v);
        }

        if (!k) {
            let newFocusValue = { keyboard: false, value: v };
            setFocusItemValue(newFocusValue);
        }

    }, [toggleOpen, handleValueChange, onSelect, internalValue]);

    const getFocusableItems = () => {
        return displayItems.filter((item: any) => (
            !item.isGroup &&
            !item.data.disabled &&
            !disabledItemValues?.includes(item[valueKey])
        ));
    }

    const findFocusItemValue = (offset: number, isUp?: boolean) => {
        let focusableItems = getFocusableItems();

        if (isUp) {
            focusableItems = focusableItems.reverse();
        }
        const { value } = focusItemValue;
        if (focusableItems.length > 0) {
            let focusValue = (focusableItems[0] as any)[valueKey];
            let index = -1;

            if (!value && value !== 0) {
                for (let i = 0; i < focusableItems.length; ++i) {
                    const value = (focusableItems[i] as any)[valueKey];
                    if ((!multiple && internalValue === value) || (multiple && (internalValue as ValueType[]).includes(value))) {
                        index = i;
                    }
                }
                if (index > -1) {
                    focusValue = (focusableItems[index] as any)[valueKey];
                } else {
                    focusValue = (focusableItems[0] as any)[valueKey];
                }

                setFocusItemValue({ keyboard: true, value: focusValue });
                return;
            }

            const len = focusableItems.length;
            const focusItemIndex = focusableItems.findIndex((item: any) => item[valueKey] === value);

            if (offset === 0 && value !== undefined) {
                focusValue = (focusableItems[focusItemIndex] as any)[valueKey];
                setFocusItemValue({ keyboard: true, value: focusValue });
            }

            let newIndex = focusItemIndex;

            if (offset > 0) {
                newIndex = focusItemIndex + 1 >= len ? 0 : focusItemIndex + 1;
            } else if (offset < 0) {
                newIndex = focusItemIndex - 1 < 0 ? len - 1 : focusItemIndex - 1;
            }

            focusValue = (focusableItems[newIndex] as any)[valueKey];

            setFocusItemValue({ keyboard: true, value: focusValue });
        }
    }

    const findFocusItemValueWithSearch = (key: string) => {
        const filterItems = displayItems.filter((item: any) => (
            !item.isGroup &&
            !item.data.disabled &&
            !disabledItemValues?.includes(item[valueKey]) &&
            item[labelKey]?.toString()[0].toLowerCase() === key.toLowerCase()
        ));

        if (filterItems && filterItems.length === 0) {
            return;
        }

        const { value } = focusItemValue;
        const len = filterItems.length;
        const focusItemIndex = filterItems.findIndex((item: any) => item[valueKey] === value);
        let newIndex = focusItemIndex;
        newIndex = focusItemIndex + 1 >= len ? 0 : focusItemIndex + 1;
        let focusValue = (filterItems[newIndex] as any)[valueKey];

        setFocusItemValue({ keyboard: true, value: focusValue });

    }

    useEffect(() => {
        const eventHandler = (event: KeyboardEvent) => {
            const keycode = event.which;
            if (keycode === 9) {
                const ele = targetRef.current?.querySelector('.ap-field-wrapper');
                ele?.classList.add('keyboard-focus');
            }
        }

        const eventClickHandler = (event: MouseEvent) => {
            const ele = targetRef.current?.querySelector('.ap-field-wrapper');
            ele?.classList.remove('keyboard-focus');
        }

        window.addEventListener('keydown', eventHandler);
        window.addEventListener('click', eventClickHandler);

        return () => {
            window.removeEventListener('keydown', eventHandler);
            window.removeEventListener('click', eventClickHandler);
        };
    });

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {

        const { key } = event;
        const isDown = key === KEY_VALUES.DOWN;
        const isUp = key === KEY_VALUES.UP;
        const isEnter = key === KEY_VALUES.ENTER
        const isSpace = key === KEY_VALUES.SPACE;

        if (!visible) {
            if (isEnter || isDown || isSpace || isUp) {
                event.preventDefault();
                toggleOpen();
                findFocusItemValue(0, isUp);
            }
        } else {
            switch (key) {

                case KEY_VALUES.UP:
                case KEY_VALUES.DOWN: {
                    let offset = 0;
                    if (key === KEY_VALUES.UP) {
                        offset = -1;
                    } else if (key === KEY_VALUES.DOWN) {
                        offset = 1;
                    }

                    if (offset !== 0) {
                        findFocusItemValue(offset);
                    }

                    targetRef.current?.focus();
                    event.preventDefault();
                    break;
                }
                // >>> Select
                case KEY_VALUES.ENTER:
                case KEY_VALUES.SPACE: {

                    if (displayItems.length === 0) {
                        return;
                    }
                    const index = flattenItems.findIndex((item: ItemDataType) => item[valueKey] === focusItemValue.value)

                    onInternalSelect(focusItemValue.value, flattenItems[index], event, true);
                    if (visible) {
                        event.preventDefault();
                    }
                    break;
                }
                // >>> Close
                case KEY_VALUES.ESC: {
                    toggleOpen();
                    targetRef.current?.focus();
                    if (visible) {
                        event.stopPropagation();
                    }
                    break;
                }
                case KEY_VALUES.TAB: {
                    if (!searchable) {
                        event.preventDefault();
                        toggleOpen();
                    }
                    break;
                }

            }
            const keyCode = event.keyCode;

            if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122)) {
                event.stopPropagation();
                findFocusItemValueWithSearch(String.fromCharCode(keyCode));
            }
        }
    }

    const onInternalSearch = (v: string) => {
        setSearchWord(v);
        onSearch?.(v);
    };

    const renderToggle = () => {
        const triggerIconClasses = ClassNames("Appkit4-icon icon-down-chevron-outline", {
            "up": visible,
            'disabled': disabled
        });

        const triggerClasses = ClassNames("ap-dropdown-select", {
            "disable": disabled
        });

        const handleClick = () => {
            let newFocusValue = { ...focusItemValue, keyboard: false };
            setFocusItemValue(newFocusValue);
            toggleOpen();
        }


        let ourProps = {
            ref: targetRef,
            role: 'button',
            'aria-controls': controlsId,
            'aria-expanded': visible,
            'aria-haspopup': true,
            // 'aria-multiselectable': multiple ? true : undefined,
            'aria-labelledby': '',
            'aria-live': 'polite',
            disabled,
            onClick: handleClick,
            tabIndex: disabled ? -1 : 0,
        }

        return (
            //@ts-ignore
            <div className={triggerClasses} {...ourProps}>
                {/* @ts-ignore */}
                <Input title={placeholder} type="text" required={required} value={text} ref={inputRef} textReadonly disabled={disabled} />
                <i
                    className={triggerIconClasses}
                    title={"toggle icon"}
                    aria-hidden
                    aria-expanded={visible}
                />
            </div >
        );
    }

    const selectWrapper = ClassNames(prefixCls, className, {
        [`${prefixCls}-multiple`]: multiple,
        [`${prefixCls}-single`]: !multiple,
        "disabled": disabled,
    });

    const context = React.useMemo(() => {
        return {
            disabledItemValues,
            parsedItems: flattenItems,
            flattenItems: displayItems,
            onSelect: onInternalSelect,
            selectedValues: internalValue,
            childrenAsData,
            focusItemValue,
            searchWord
        };
    }, [
        disabledItemValues,
        flattenItems,
        displayItems,
        onInternalSelect,
        internalValue,
        childrenAsData,
        focusItemValue,
        searchWord
    ]);


    React.useEffect(() => {
        if (dropdownRenderMode === 'portal') {
            const alignHandle = () => {
                if (popupRef.current && visible) {
                    align(containerRef.current, popupRef.current, 'bottom', !dropdownAlwaysDown, 8, false, true);
                }
            }
            alignHandle();
            window.addEventListener('scroll', alignHandle);
            window.addEventListener('resize', alignHandle);
            return () => {
                window.removeEventListener('scroll', alignHandle);
                window.removeEventListener('resize', alignHandle);
            };
        }


    }, [visible, dropdownRenderMode]);

    const dropdownMenu = (portal?: boolean) => {
        return (
            <DropdownMenu
                id={controlsId}
                role={"listbox"}
                style={dropdownStyle}
                className={classNames('ap-dropdown-list', dropdownClassName, {
                    'ap-dropdown-list-default': dropdownRenderMode === 'default',
                    'ap-dropdown-list-portal': dropdownRenderMode === 'portal',
                })}
                ref={popupRef}
                visible={visible}
                multiple={multiple}
                searchable={searchable}
                searchWord={searchWord}
                searchPlaceholder={searchPlaceholder}
                onSearch={onInternalSearch}
                labelKey={labelKey}
                valueKey={valueKey}
                childrenKey={childrenKey}
                itemTemplate={itemTemplate}
                badgeTemplate={badgeTemplate}
                prefixTemplate={prefixTemplate}
                suffixTemplate={suffixTemplate}
                noResultFound={noResultFound}
            >
            </DropdownMenu>
        );
    }

    let ele = null;
    if (getPopupContainer || dropdownRenderMode === 'portal') {
        let popupContainer = getPopupContainer?.();
   
        const { Portal } = usePortal({
            container: popupContainer
        });

        ele = (
            <Portal>
                {dropdownMenu(true)}
            </Portal>
        )
   
    } else {
        ele = dropdownMenu();
    }

    return (
        <div className={selectWrapper} ref={containerRef} onKeyDown={onKeyDown} style={style}>
            <OptionListContext.Provider value={context}>
                {renderToggle()}
                {
                    ele
                }
            </OptionListContext.Provider>
        </div >
    )
}

Select.displayName = "Select";

export default Select;