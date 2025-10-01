import React, { useCallback, useState, useEffect } from 'react';
import classNames from 'classnames';
import { useControlled, useClickOutside } from '../../../hooks';
import { KEY_VALUES } from '../../../configs/config';
import {
    transformData,
    shouldDisplay,
    useFocusItemValue,
    onMenuKeyDown,
} from './utils';
import { DropdownMenuItem } from '../Select';

export type ValueType = string | number;

export type ItemDataType = {
    value?: ValueType;
    label?: string;
    disabled?: boolean;
    [key: string]: any;
};

export interface SearchProps {
    style?: React.CSSProperties;
    className?: string;
    searchType?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string | undefined;
    onSearch?: (value: string, event: React.SyntheticEvent) => void;
    disabled?: boolean;
    children?: React.ReactNode;
    labelKey?: string;
    valueKey?: string;
    ariaLabel?: string;
    noResultFound?: React.ReactNode;
    noHistoryMsg?: React.ReactNode;
    data?: ItemDataType[];
    onChange?: (
        value: string,
        event: React.ChangeEvent<HTMLInputElement> | React.SyntheticEvent
    ) => void;
    // inputRef?: React.Ref<HTMLInputElement>;
    searchBy?: (keyword: string, item: ItemDataType) => boolean;
    onSelect?: (
        value: string,
        item: ItemDataType,
        event: React.SyntheticEvent
    ) => void;
    /** Called on close */
    onClose?: () => void;
    onOpen?: () => void;
    LocalStorageKey?: string;
    limitHistory?: number;
    showHistory?: boolean;
    onHistoryChange?: (histories: ItemDataType[]) => void;
    /** The callback triggered by keyboard events. */
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus?: React.FocusEventHandler;
    onBlur?: React.FocusEventHandler;
    noList?: boolean;
    tabIndex?: number;
    searchValue?: string;
    onClear?: () => void;
}

// export type SearchProps = ISearchProps &
//     React.HTMLAttributes<HTMLInputElement>;

const MainSearch = React.forwardRef<HTMLInputElement, SearchProps>(
    (props, ref) => {
        const {
            className,
            searchType = 'primary',
            defaultValue = '',
            value: valueProp,
            placeholder = 'Search',
            searchValue: searchValueProp,
            onSearch,
            disabled,
            children,
            ariaLabel,
            valueKey = 'value',
            labelKey = 'label',
            onSelect,
            onChange,
            data = [],
            searchBy,
            noResultFound = 'Nothing matches your results',
            noHistoryMsg = 'No recent searches',
            onClose,
            onOpen,
            LocalStorageKey = 'searchKeywords',
            limitHistory = 10,
            showHistory: showHistoryProp = false,
            onHistoryChange,
            onKeyDown,
            onFocus,
            onBlur,
            noList,
            tabIndex,
            onClear,
            ...otherProps
        } = props;
        const tmp: React.ReactNode[] = [];
        let items: ItemDataType[] = [];
        const [value, setValue] = useState('');
        const [nodes, setNodes] = useState<React.ReactNode[] | React.ReactNode>(
            [],
        );
        const [searchValue, setSearchValue, isControlled] = useControlled(
            searchValueProp,
            defaultValue,
        );
        const [focus, setFocus] = useState(false);
        const [keyboardFocus, setKeyboardFocus] = useState(false);
        const [activeSearch, setActiveSearch] = useState(false);
        const [showPressIcon, setShowPressIcon] = useState(false);
        const [showDeleteIcon, setShowDeleteIcon] = useState(false);
        const [showList, setShowList] = useState(false);
        const [showBlank, setShowBlank] = useState(false);
        const [showHistory, setShowHistory] = useState(false);

        const containerRef = React.useRef(null);
        const inputRef = React.useRef<HTMLInputElement>(null);
        const buttonRef = React.useRef(null);
        const overlayRef = React.useRef(null);

        useEffect(() => {
            // eslint-disable-next-line no-unused-expressions
            defaultValue !== '' && setSearchValue(defaultValue);
        }, []);

        useEffect(() => {
            const eventHandler = (event: KeyboardEvent) => {
                const { key, shiftKey } = event;
                if (KEY_VALUES.TAB === key) {
                    setKeyboardFocus(true);
                    if (keyboardFocus && showList && shiftKey) {
                        setShowList(false);
                    }
                }
            };

            const eventClickHandler = () => {
                setKeyboardFocus(false);
            };

            const keyupEvent = (event: KeyboardEvent) => {
                const { key } = event;
                if (KEY_VALUES.TAB === key) {
                    // eslint-disable-next-line no-unused-expressions
                    !(containerRef.current! as HTMLElement)?.contains(
                        document.activeElement as HTMLElement,
                    ) && showList && setShowList(false);
                }
            };

            window.addEventListener('keyup', keyupEvent);
            window.addEventListener('keydown', eventHandler);
            window.addEventListener('click', eventClickHandler);

            return () => {
                window.removeEventListener('keyup', keyupEvent);
                window.removeEventListener('keydown', eventHandler);
                window.removeEventListener('click', eventClickHandler);
            };
        });

        items = React.useMemo(() => {
            if ('data' in props) {
                const datalist = transformData(data);
                items = datalist?.filter(
                    shouldDisplay(
                        searchBy,
                        searchValue,
                        searchValue !== '' ? '' : value,
                    ),
                ) || [];
                if (items.length > 0) {
                    setShowBlank(false);
                } else {
                    setShowBlank(true);
                }
                return items;
            }
            return [];
        }, [searchValue, value, showHistory]);

        const getHistories = () => {
            const historiesString = localStorage.getItem(LocalStorageKey);
            let histories: ItemDataType[] = [];

            if (historiesString) {
                histories = JSON.parse(historiesString) as ItemDataType[];
            }
            return histories;
        };

        const {
            focusItemValue,
            setFocusItemValue,
            onKeyDown: handleKeyDown,
        } = useFocusItemValue(value, {
            items: showHistory ? getHistories() : items,
            valueKey,
        });

        const handleKeyDownEvent = (event: React.KeyboardEvent) => {
            onMenuKeyDown(event, {
                enter: handleEnter,
                esc: () => handleClose(event, true),
            });
            handleKeyDown(event);

            // onKeyDown?.((event.target as HTMLInputElement).value, event);
        };

        useEffect(() => {
            if (showHistory) {
                renderSearchHistory();
            }
        }, [showHistory, focusItemValue]);

        const handleEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
            const buttonEle = buttonRef.current! as HTMLElement;
            if (event.key === KEY_VALUES.SPACE) {
                // eslint-disable-next-line no-unused-expressions
                focusItemValue !== '' && event.preventDefault();
            }
            if (searchType === 'primary') {
                if (
                    event.key === KEY_VALUES.SPACE
                    && !buttonEle.contains(event.target as HTMLElement)
                ) {
                    return;
                }
                handlePrimarySearch(event);
                return;
            }

            if (searchType === 'secondary' && !('data' in props)) {
                if (buttonEle.contains(event.target as HTMLElement)) {
                    handleClean(event);
                }
                return;
            }

            if (buttonEle.contains(event.target as HTMLElement)) {
                handleClean(event);
                return;
            }

            if (!(searchValue === '' && !showList)) setShowList(!showList);

            if (!focusItemValue) {
                return;
            }

            const focusItem = showHistory
                ? getHistories().find(
                    (item: any) => item[valueKey] === focusItemValue,
                )
                : items.find((item: any) => item[valueKey] === focusItemValue);

            const searchValueTemp = focusItem?.[labelKey];

            setSearchValue(searchValueTemp);
            setValue(searchValueTemp);
            setFocusItemValue('');
            handleSelect(searchValueTemp, focusItem!, event);
            saveHistory(focusItem!);

            if (value !== searchValueTemp) {
                // focusItemValue
                handleChangeValue(searchValueTemp, event); // focusItemValue
            }
            if (searchValueTemp.length > 0) {
                setShowDeleteIcon(true);
            }
            handleClose();
        };

        const handleSelect = useCallback(
            (value: any, item: ItemDataType, event: React.SyntheticEvent) => {
                onSelect?.(value, item, event);
            },
            [onSelect],
        );

        const handleClean = (event: React.SyntheticEvent<Element, Event>) => {
            (inputRef?.current! as HTMLElement).focus();
            setValue('');
            setSearchValue('');
            setFocus(true);
            // setShowDeleteIcon(false);
            if ('data' in props) {
                setShowList(true);
                setShowBlank(true);
            }
            onClear?.();
            onChange?.('', event);
        };

        const handleChangeValue = useCallback(
            (value: any, event: React.SyntheticEvent) => {
                onChange?.(value, event);
            },
            [onChange],
        );

        const handleInputKeyDown = (
            event: React.KeyboardEvent<HTMLInputElement>,
        ) => {
            const value = (event.target as HTMLInputElement).value;
            onKeyDown?.(event);
        };

        const handleInputChange = (
            event: React.ChangeEvent<HTMLInputElement>,
        ) => {
            const value = event.target?.value;
            if (value.length > 0) {
                switch (searchType) {
                case 'primary':
                    setShowPressIcon(true);
                    break;
                case 'secondary':
                    setShowDeleteIcon(true);
                    if ('data' in props) {
                        setShowList(true);
                        setShowHistory(false);

                        if (items.length > 0) {
                            setShowBlank(false);
                        } else {
                            setShowBlank(true);
                        }
                    }
                    break;
                default:
                    break;
                }
            } else {
                switch (searchType) {
                case 'primary':
                    setShowPressIcon(false);
                    break;
                case 'secondary':
                    setShowHistory(false);
                    setShowDeleteIcon(true);
                    if ('data' in props) {
                        setShowList(true);
                        setShowBlank(true);
                    }
                    break;
                default:
                    break;
                }
            }
            setFocusItemValue('');
            setFocus(true);
            setSearchValue(value);
            // Once change, will reset selected value to trigger re-filter
            setValue('');
            onChange?.(value, event);
        };

        const handleClose = (
            event?: React.SyntheticEvent,
            shouldClear = false,
        ) => {
            if (showList) {
                setShowList(false);
                // setFocus(false);
                onClose?.();
                event?.preventDefault();
            } else {
                // eslint-disable-next-line no-unused-expressions
                shouldClear && setSearchValue('');
                // eslint-disable-next-line no-unused-expressions
                shouldClear && setValue('');
                // eslint-disable-next-line no-unused-expressions
                isControlled && onClear?.();
                // eslint-disable-next-line no-unused-expressions
                isControlled && onChange?.('', event!);
                // (inputRef.current as HTMLElement).blur();
            }
        };

        const handleOpen = useCallback(() => {
            setFocus(true);
            onOpen?.();
        }, [onOpen]);

        const handleItemSelect = useCallback(
            (value: any, item: any, event: React.SyntheticEvent) => {
                const nextItemValue = item[labelKey];
                setSearchValue(nextItemValue);
                setValue(nextItemValue);
                setFocusItemValue('');
                handleSelect(value, item, event);
                saveHistory(item);

                if (value !== nextItemValue) {
                    handleChangeValue(nextItemValue, event);
                }
                handleClose(event);
            },
            [
                value,
                setValue,
                handleSelect,
                handleChangeValue,
                handleClose,
                setFocusItemValue,
            ],
        );

        const handleInputFocus = useCallback(
            (event: React.FocusEvent<HTMLInputElement>) => {
                event.preventDefault();
                event.stopPropagation();
                const value = event.target.value;

                switch (searchType) {
                case 'primary':
                    if (value.length > 0) {
                        setShowPressIcon(true);
                    }
                    break;

                case 'secondary':
                    setShowDeleteIcon(true);
                    if (value.length > 0) {
                        if ('data' in props) {
                            setShowList(true);
                        }
                    }
                    if (props.showHistory) {
                        const histories = getHistories();
                        if (histories.length > 0) {
                            setShowList(true);
                            setShowBlank(false);
                            setShowHistory(true);
                            renderSearchHistory();
                        }
                    } else {
                        setShowHistory(false);
                    }
                    break;
                default:
                    break;
                }
                setFocus(true);
                onFocus?.(event);
            },
            [onFocus, handleOpen],
        );

        const handleInputBlur = useCallback(
            (event: React.FocusEvent<HTMLInputElement>) => {
                const value = event.target.value;
                switch (searchType) {
                case 'primary':
                    if (value.length > 0) {
                        setActiveSearch(true);
                    } else {
                        setActiveSearch(false);
                    }
                    break;
                case 'secondary':
                    if (value.length > 0) {
                        setShowDeleteIcon(true);
                        setActiveSearch(true);
                    } else {
                        setShowDeleteIcon(false);
                        setActiveSearch(false);
                    }
                    break;
                default:
                    break;
                }
                setFocus(false);
                onBlur?.(event);
            },
            [onBlur],
        );

        const handlePrimarySearch = (event: React.SyntheticEvent) => {
            setShowPressIcon(false);
            if (searchValue.length > 0) {
                setActiveSearch(true);
            }

            onSearch?.(searchValue, event);
            if (buttonRef.current) {
                (buttonRef.current as HTMLElement).blur();
            }
            if (inputRef.current) {
                (inputRef.current as HTMLElement).blur();
            }
            setKeyboardFocus(false);
        };

        const hideOnClickOutside = (event: any) => {
            handleClose(event);
            (inputRef.current as HTMLElement).blur();
        };

        useClickOutside({
            enabled: true,
            isOutside: (event) => !(containerRef.current! as HTMLElement)?.contains(event.target as HTMLElement),
            handle: showList ? hideOnClickOutside : () => null,
        });

        const saveHistory = (item: ItemDataType) => {
            if (searchType === 'secondary' && 'data' in props && props.showHistory) {
                const historiesString = localStorage.getItem(LocalStorageKey);
                let histories: ItemDataType[] = [];

                if (historiesString) {
                    histories = JSON.parse(historiesString) as ItemDataType[];
                    if (histories.length === limitHistory) histories.pop();

                    const index = histories.findIndex(
                        (history: any) => history[valueKey] === item[valueKey],
                    );
                    if (index > -1) {
                        return;
                    }
                    histories.unshift(item);
                } else {
                    histories = [item];
                }
                localStorage.setItem(
                    LocalStorageKey,
                    JSON.stringify(histories),
                );
                onHistoryChange?.(histories);
            }
        };

        const searchTypeNode = () => {
            const classes = classNames('ap-search-after-icon', {
                'delete-icon': searchType === 'secondary',
                'enter-icon': searchType === 'primary',
                showPressIcon: showPressIcon,
                showDeleteIcon: showDeleteIcon,
                active: searchType === 'secondary' && searchValue.length > 0,
            });

            const iconClassed = classNames('Appkit4-icon', {
                'icon-return-outline': searchType === 'primary',
                'icon-circle-delete-outline': searchType === 'secondary',
            });

            const searchTypeProps = {
                ref: buttonRef,
                role: 'button',
                'aria-disabled': showPressIcon,
                tabIndex:
                    disabled || (searchType === 'primary' && !showPressIcon)
                    || (searchType === 'secondary' && searchValue.length === 0)
                        ? -1
                        : 0,
                'aria-hidden': !showPressIcon,
                'aria-label':
                    ariaLabel || searchType === 'primary'
                        ? 'start MainSearch'
                        : 'clear',
                className: classes,
                onClick:
                    searchType === 'primary'
                        ? handlePrimarySearch
                        : handleClean,
            };

            return (
                <span {...searchTypeProps}>
                    <i className={iconClassed} aria-hidden></i>
                </span>
            );
        };

        const containerClasses = classNames('ap-search-container', className, {
            show: searchType !== 'primary' && showList,
          });

        const renderSearchHistory = () => {
            const historiesString = localStorage.getItem(LocalStorageKey);
            let tmp;
            if (historiesString) {
                const histories = JSON.parse(historiesString) as ItemDataType[];
                if (histories.length === 0) {
                    setShowHistory(true);

                    // setShowBlank(true);
                    (inputRef.current! as HTMLElement).focus();
                    tmp = (
                        <div className="ap-option-item noResult">
                            <span className="ap-option-label">
                                {noHistoryMsg}
                            </span>
                        </div>
                    );

                    setNodes(tmp);
                    return;
                }
                tmp = [];

                for (let index = 0; index < histories.length; index += 1) {
                    const item: any = histories[index];
                    const newLi = (
                        <div
                            key={index}
                            className={classNames("ap-option-item", { 'moved': item[valueKey] === focusItemValue })}
                            role="listitem"
                            tabIndex={-1}
                            onClick={(event) => handleItemSelect(item[valueKey], item, event)}
                        >
                            <div className="ap-option-left">
                                <label className="ap-option-label">
                                    {item[labelKey]}
                                </label>
                            </div>
                            <span
                                role="button"
                                aria-label="clear recent history"
                                className="recent-delete-icon"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    histories.splice(index, 1);
                                    localStorage.setItem(
                                        LocalStorageKey,
                                        JSON.stringify(histories),
                                    );
                                    renderSearchHistory();
                                    onHistoryChange?.(histories);
                                }}
                                tabIndex={0}
                                onKeyDown={(event: React.KeyboardEvent<HTMLSpanElement>) => {
                                    event.stopPropagation();
                                    const { key } = event;
                                    if (key === KEY_VALUES.ENTER || key === KEY_VALUES.SPACE) {
                                        histories.splice(index, 1);
                                        localStorage.setItem(
                                            LocalStorageKey,
                                            JSON.stringify(histories),
                                        );
                                        renderSearchHistory();
                                        onHistoryChange?.(histories);
                                    }
                                }}
                            >
                                <i className="Appkit4-icon icon-close-outline"></i>
                            </span>
                        </div>
                    );
                    tmp.push(newLi);
                }

                setNodes(tmp);
            }
        };

        return (
            <div
                className={containerClasses}
                ref={containerRef}
                {...otherProps}
            >
                <div className="search-result" aria-live="assertive"></div>
                <div
                    className={classNames('ap-search-input', {
                        disabled: disabled,
                        focus: focus,
                        'keyboard-focus': keyboardFocus,
                      })}
                    onKeyDown={handleKeyDownEvent}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        role="searchbox"
                        className="ap-field-input"
                        tabIndex={0}
                        value={searchValue}
                        placeholder={placeholder}
                        autoComplete="off"
                        aria-disabled={disabled}
                        aria-label={ariaLabel}
                        aria-activedescendant=""
                        disabled={disabled}
                        onKeyDown={handleInputKeyDown}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        onChange={handleInputChange}
                    />
                    <i
                         className={classNames('Appkit4-icon icon-search-outline', {
                            activeSearch: activeSearch,
                          })}
                        aria-hidden
                    ></i>
                    {searchTypeNode()}
                </div>

                {showList && searchType !== 'primary' && (
                    <div className="ap-search-list" ref={overlayRef}>
                        {showList && items?.map((item: any, index) => (
                            <DropdownMenuItem
                                key={index}
                                role="option"
                                //   tabIndex={item.disabled ? -1 : 0}
                                disabled={item.disabled}
                                // aria-disabled={item.disabled}
                                // aria-checked={item[valueKey] === value}
                                active={item[valueKey] === value}
                                focus={focusItemValue === item[valueKey]}
                                onSelect={handleItemSelect}
                                data={item}
                                value={item[valueKey]}
                                label={item[labelKey]}
                                highlightWords={searchValue}
                                showIncreaseArrow={true}
                            />
                        ))}
                        {showList && showBlank && items.length === 0
                            && !showHistory && (
                            <div className="ap-option-item noResult">
                                <span className="ap-option-label">
                                    {noResultFound}
                                </span>
                            </div>
                        )}
                        {showHistory && nodes}
                    </div>
                )}
            </div>
        );
    },
);

MainSearch.displayName = 'MainSearch';

export default MainSearch;
