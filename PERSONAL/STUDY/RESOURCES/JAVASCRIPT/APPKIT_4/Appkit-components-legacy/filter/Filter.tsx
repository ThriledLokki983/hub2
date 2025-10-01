import * as React from "react";
import ClassNames from "classnames";
import { _uuid, useControlled, KEY_VALUES, toArray } from '../utils';
import { slideTrigger } from '../utils/animation';
import { Checkbox } from "../checkbox";
import { Radio } from "../radio";
import classNames from "classnames";

type ValueType = string | number;

export interface ItemDataType {
    value?: ValueType;
    label?: React.ReactNode;
    desc?: string;
    status?: string;
    disabled?: boolean;
    [key: string]: any;
}

export interface FilterProps {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    filterListClassName?: string;
    filterListStyle?: React.CSSProperties;
    value?: ValueType | ValueType[];
    defaultValue?: ValueType | ValueType[];
    multiple?: boolean;
    valueKey?: string;
    labelKey?: string;
    title?: string | React.ReactNode;
    data: ItemDataType[];
    expand?: boolean;
    onRenderTreeIcon?: (expand: boolean) => React.ReactNode;
    onSelect?: (vals: any) => void;
    children?: React.ReactNode;
}

const Filter = React.forwardRef<HTMLDivElement, FilterProps>((props, ref) => {
    const {
        id,
        className,
        title,
        data,
        value: valueProp,
        defaultValue,
        multiple = false,
        valueKey = 'value',
        labelKey = 'label',
        expand: expandProp,
        onRenderTreeIcon,
        filterListClassName,
        filterListStyle,
        children,
        onSelect,
        ...restProps
    } = props;

    const [expand, setExpand] = React.useState(expandProp || false);

    const listRef = React.useRef(null);
    const triggerRef = React.useRef(null);
    const [internalValue, setInternalValue] = useControlled(valueProp, defaultValue || []);

    let cursorIndex = -1;

    let controlsId = id || `list-${_uuid(8, 16)}`;

    const renderIcon = () => {
        const expandIconClasses = ClassNames('Appkit4-icon icon-down-chevron-outline', {
            'rotate': expand
        });

        let expandIcon = <span className={expandIconClasses} aria-hidden />;

        if (typeof onRenderTreeIcon === 'function') {
            const customIcon = onRenderTreeIcon(expand);
            expandIcon =
                customIcon !== null ? (
                    <div className='custom-icon'>{customIcon}</div>
                ) : (
                    expandIcon
                );
        }
        return expandIcon;
    };

    const filterListClasses = ClassNames('ap-filter-list', filterListClassName, {
        'hide': !expand,
        'show': expand
    });

    const handleExpand = () => {
        const newExpand = !expand;
        setExpand(newExpand);

        newExpand && slideTrigger(false, listRef.current, 300);
        !newExpand && slideTrigger(true, listRef.current, 300);
    }

    const handleItemClick = (item: ItemDataType) => {
        const value = item[valueKey];
        if (item.disabled) {
            return;
        }
        let vals = [];
        if (multiple) {
            vals = toArray(internalValue);
            if (vals.includes(value)) {
                vals = vals.filter(ele => {
                    return ele !== value;
                });
            } else {
                vals = vals.concat(value);
            }
            setInternalValue(vals);
        } else {
            vals = value;
            setInternalValue(value);
        }

        onSelect?.(vals);
    };

    const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        const key = event.key;
        switch (key) {
            case KEY_VALUES.DOWN:
                event.preventDefault();
                if (expand) {
                    if (listRef.current) {
                        const focusableEle = (listRef.current as HTMLElement).querySelector('.ap-filter-item-container.ap-filter-item-hover');
                        (focusableEle as HTMLElement).focus();
                    }
                } else {
                    if (event.altKey) {
                        handleExpand();
                    }
                }
                break;
        }
    }

    const handleItemKeyDown = (event: React.KeyboardEvent<HTMLLIElement>, item: ItemDataType) => {
        const key = event.key;

        const targetEle = event.target as HTMLElement;
        switch (key) {
            case KEY_VALUES.DOWN:
                event.preventDefault();
                let nextEle = findNextEle(targetEle);
                if (!nextEle) {
                    nextEle = (event.target as HTMLElement).closest('.ap-filter')?.querySelector('.ap-filter-button');
                }
                nextEle?.focus();
                break;
            case KEY_VALUES.UP:
                event.preventDefault();
                let preEle = findPreEle(targetEle);
                if (!preEle) {
                    preEle = (event.target as HTMLElement).closest('.ap-filter')?.querySelector('.ap-filter-button');
                }
                preEle?.focus();
                break;
            case KEY_VALUES.SPACE:
            case KEY_VALUES.ENTER:
                event.preventDefault();
                handleItemClick(item);
        }
    }


    const findNextEle = (ele: any): any => {
        if (!ele.closest('.ap-filter-item-container')) {
            return;
        }
        if (ele.closest('.ap-filter-item-container').nextElementSibling) {
            let nextInputEle = ele.closest('.ap-filter-item-container').nextElementSibling.querySelector('input');
            if (nextInputEle && !nextInputEle.disabled) {
                return ele.closest('.ap-filter-item-container').nextElementSibling;
            } else {
                return findNextEle(ele.closest('.ap-filter-item-container').nextElementSibling);
            }
        } else {
            return findNextEle(ele.closest('.ap-filter-item-container').parentElement);
        }
    }

    const findPreEle = (ele: any): any => {
        if (!ele.closest('.ap-filter-item-container')) {
            return;
        }
        if (ele.closest('.ap-filter-item-container').previousElementSibling) {
            let preInputEle = ele.closest('.ap-filter-item-container').previousElementSibling.querySelector('input');
            if (preInputEle && !preInputEle.disabled)
                return ele.closest('.ap-filter-item-container').previousElementSibling;
            else
                return findPreEle(ele.closest('.ap-filter-item-container').previousElementSibling);
        } else {
            return findNextEle(ele.closest('.ap-filter-item-container').parentElement);
        }
    }

    const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const keyCode = event.keyCode;
        if (expand && (keyCode >= 65 && keyCode <= 90 || keyCode >= 97 && keyCode <= 122)) {
            event.preventDefault();
            event.stopPropagation();
            const arr: any = [];
            if (listRef.current) {
                const nameEles = (listRef.current as HTMLElement).querySelectorAll('.ap-filter-item-container-left-name');
                nameEles.forEach((element: any) => {
                    element.innerText && arr.push(element.innerText);
                });

                cursorIndex = arr.findIndex((text: string, id: number) => {
                    return text.toLowerCase().indexOf(String.fromCharCode(keyCode).toLowerCase()) === 0 && id > cursorIndex && !data[id]?.disabled;
                });

                if (cursorIndex === -1) {
                    cursorIndex = arr.findIndex((text: any, id: number) => {
                        return text.toLowerCase().indexOf(String.fromCharCode(keyCode).toLowerCase()) === 0 && !data[id]?.disabled;
                    });
                }

                if (cursorIndex > -1) {
                    (nameEles[cursorIndex]?.closest('.ap-filter-item-container') as HTMLElement)?.focus();
                }
            }
        }
    }

    return (
        <div
            ref={ref}
            className={ClassNames("ap-filter", className)}
            onKeyDown={handleSearchKeyDown}
            {...restProps}
        >
            <button
                ref={triggerRef}
                type="button"
                className="ap-filter-button"
                aria-expanded={expand}
                data-toggle="filter"
                aria-controls={controlsId}
                onClick={handleExpand}
                onKeyDown={handleTriggerKeyDown}
            >
                <span className="ap-filter-button-title ap-font-medium">{title}</span>
                {renderIcon()}
            </button>
            <ul
                id={controlsId}
                className={filterListClasses}
                style={filterListStyle}
                ref={listRef}
                aria-multiselectable={multiple}
            >
                {
                    data?.map((item: ItemDataType, index) => {
                        const { desc, status, disabled } = item;

                        const value = item[valueKey];
                        const label = item[labelKey];
                        const checked = multiple ? toArray(internalValue).includes(value) : value === internalValue;

                        const itemClasses = ClassNames('ap-filter-item-container', {
                            'not-allowed': disabled,
                            'ap-filter-item-hover': !disabled
                        });

                        return (
                            <li
                                key={index}
                                className={itemClasses}
                                role={multiple ? 'checkbox' : 'radio'}
                                aria-live="off"
                                aria-disabled={disabled}
                                aria-checked={checked}
                                onClick={() => handleItemClick(item)}
                                onKeyDown={event => handleItemKeyDown(event, item)}
                                aria-label={checked ? `${label}${desc}` : `${label}${desc} `}
                                tabIndex={disabled ? -1 : 0}
                                data-key={index}
                                // @ts-ignore
                                name="filterItem"
                            >
                                <div className="ap-filter-item-container-left">
                                    {
                                        multiple ?
                                            <Checkbox checked={checked} disabled={disabled} tabIndex={-1}></Checkbox> :
                                            <Radio checked={checked} disabled={disabled} tabIndex={-1}></Radio>
                                    }
                                    {status && <span className={`ap-filter-item-container-left-status ${status}`} aria-hidden></span>}
                                    <span className={classNames("ap-filter-item-container-left-name", { disabled })} aria-label={label} aria-hidden>{label}</span>
                                </div>
                                <div
                                    className={ClassNames('ap-filter-item-container-num', { 'disabled': disabled })}
                                    aria-label={desc}
                                    aria-hidden
                                >
                                    {desc}
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    );
})

export default Filter;