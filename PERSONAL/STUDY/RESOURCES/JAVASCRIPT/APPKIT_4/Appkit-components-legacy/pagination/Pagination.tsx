import * as React from 'react';
import { useCallback, useRef, useEffect } from 'react';
import ClassNames from 'classnames';
import { Input } from '../field';
import { KEY_VALUES, useControlled } from '../utils';

export interface PaginationProps {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    defaultCurrent?: number;
    current?: number;
    /** Total pages */
    total?: number;
    disabled?: boolean;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onPageChange?: (page: number) => void;
    onChange?: (page: number) => void;
    toPreviousPage?: string;
    toNextPage?: string;
    ofWord?: string;
}

// function usePrevious<T>(value: T): T | undefined {
//     const ref = useRef<T>();
//     useEffect(() => {
//         ref.current = value;
//     });
//     return ref.current;
// }

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(({
    prefixCls: customizePrefixCls,
    className,
    current,
    defaultCurrent = 1,
    total = 1,
    disabled,
    onBlur,
    onFocus,
    onPageChange,
    toPreviousPage = '',
    toNextPage = '',
    ofWord = 'of',
    ...props
}, ref
) => {

    const MIN = 1;

    const prefixCls = customizePrefixCls ? `${customizePrefixCls}-pagination` : 'ap-pagination';
    const classNames = ClassNames(prefixCls, className);
    const [currentPage, setCurrentPage, isControlled] = useControlled(current, current || defaultCurrent);
    const [inputValue, setInputValue] = React.useState(currentPage);


    const inputRef = useRef<HTMLInputElement>(null);

    const prev = (event: React.SyntheticEvent) => {
        const current = Math.max(Number(currentPage) - 1, 1);
        if (current < 1) {
            return;
        }
        setInputValue(current);
        setCurrentPage(current);
        onPageChange?.(current)
    };

    const next = useCallback((event: React.SyntheticEvent) => {

        const current = Math.min(Number(currentPage) + 1, total);
        if (current > total) {
            return;
        }
        setInputValue(current);
        setCurrentPage(current);
        onPageChange?.(current)
    }, [currentPage, total]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === KEY_VALUES.ENTER) {
            if (!(event.target instanceof HTMLDivElement)) {
                return;
            }
            const { key } = event.target?.['dataset'];
            if (key === 'previous') {
                prev(event);
            } else {
                next(event);
            }

        }
    };

    const getSafeValue = useCallback(
        e => {
            const inputValue = e.target.value;
            let value;
            if (inputValue === '') {
                value = inputValue;
            } else if (isNaN(Number(inputValue))) {
                value = currentPage;
            } else if (inputValue > total) {
                value = total;
            } else {
                value = Number(inputValue);
            }
            return value;
        },
        [total, MIN]
    );


    const handleInputBlur = useCallback(
        event => {

            const value = getSafeValue(event);
            if (value !== currentPage) {
                setCurrentPage(value);
                onPageChange?.(value);
            }


        },
        [onPageChange, total, setCurrentPage, currentPage]
    );


    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === KEY_VALUES.UP || e.key === KEY_VALUES.DOWN) {
            e.preventDefault();
        }
    };

    // const isValid = (page: number) => {

    //     return (
    //       isInteger(page) &&
    //       page !== this.state.current &&
    //       isInteger(total) &&
    //       total > 0
    //     );
    //   };


    const handleChange = (page: number) => {
        if (page > total || page < 1) {
            return;
        }
        if (page !== currentPage) {
            setCurrentPage(page);
            onPageChange?.(page);
            setInputValue(page);
        }
    }

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
        const value = getSafeValue(e);
        if (inputValue !== value) {
            setInputValue(value);
        }
        // @ts-ignore
        if (e.key === KEY_VALUES.ENTER) {
            handleChange(value);
            // @ts-ignore
        } else if (e.key === KEY_VALUES.UP) {
            handleChange(value + 1);
            // @ts-ignore
        } else if (e.key === KEY_VALUES.DOWN) {
            handleChange(value - 1);
        }
    }

    const renderPrev = () => {
        const disabled: boolean = currentPage === 1;
        return (
            <div
                role="button"
                aria-label={"previous"}
                aria-disabled={disabled}
                data-key={"previous"}
                className={ClassNames(
                    `${prefixCls}-btn-prev`,
                    disabled && 'disabled',
                    toPreviousPage && 'large'
                )}
                tabIndex={disabled ? undefined : 0}
                onClick={disabled ? () => { } : prev}
                onKeyDown={disabled ? () => { } : handleKeyDown}
            >
                <span className="Appkit4-icon icon-left-chevron-outline"></span>
                {toPreviousPage && <span className={`${prefixCls}-btn-text`}>{toPreviousPage}</span>}
            </div>
        );
    }

    const renderNext = () => {
        const disabled: boolean = currentPage >= total;
        return (
            <div
                role="button"
                aria-label={"next"}
                aria-disabled={disabled}
                className={ClassNames(
                    `${prefixCls}-btn-next`,
                    disabled && 'disabled',
                    toNextPage && 'large'
                )}
                tabIndex={disabled ? undefined : 0}

                data-key={"next"}
                onClick={disabled ? () => { } : next}
                onKeyDown={disabled ? () => { } : handleKeyDown}
            >
                {toNextPage && <span className={`${prefixCls}-btn-text`}>{toNextPage}</span>}
                <span className="Appkit4-icon icon-right-chevron-outline"></span>
            </div>
        );
    }

    const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        onFocus?.(event);
    };

    return (
        // @ts-ignore
        <div className={classNames} ref={ref} {...props}>
            {renderPrev()}
            <label className={`${prefixCls}-field`}>
                <Input
                    type='text'
                    ref={inputRef}
                    hideTitleOnInput
                    value={String(inputValue)}
                    onBlur={handleInputBlur}
                    // @ts-ignore
                    onChange={(v, e) => handleKeyUp(e)}
                    onFocus={handleInputFocus}
                    onKeyDown={handleInputKeyDown}
                    onKeyUp={handleKeyUp}
                    disabled={disabled}
                />
                <span className={`${prefixCls}-total`}>
                    <span>{ofWord}</span>
                    <span>{total}</span>
                </span>
            </label>
            {renderNext()}
        </div>
    );
});


Pagination.displayName = 'Pagination';

export default Pagination;



