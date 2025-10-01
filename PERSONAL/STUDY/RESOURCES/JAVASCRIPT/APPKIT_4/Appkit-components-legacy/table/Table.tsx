import React, { useRef, forwardRef, useState, useEffect } from 'react';
import ClassNames from "classnames";
import { Checkbox } from '../checkbox';
import { KEY_VALUES } from '../utils';

interface ITableProps {
    className?: string;
    style?: React.CSSProperties;
    tableId?: string,
    originalData?: any,
    animatedSorting?: boolean,
    striped?: boolean,
    condensed?: boolean,
    sortActive?: string,
    sortPhase?: number,
    children?: React.ReactNode,
    checkable?: boolean,
    hasTitle?: boolean,
    skipInitialSort?: boolean,
    onCheckChange?: (sortedData: Array<any>) => void
}

export interface TableProps extends React.HTMLAttributes<HTMLDivElement>,
    ITableProps { }

const Table = forwardRef<HTMLDivElement, TableProps>((props, ref) => {
    const {
        originalData,
        condensed = false,
        striped,
        tableId = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now(),
        animatedSorting = true,
        children,
        checkable = false,
        hasTitle = false,
        sortActive,
        sortPhase,
        skipInitialSort,
        style,
        className,
        onCheckChange
    } = props;
    const tableRef = useRef<HTMLDivElement>(null);
    const [sortFlag, setSortFlag] = useState([] as Array<any>); // 0: initial status; 1: first sorting phase; 2: second sorting phase
    const [sortedData, setSortedData] = useState([...originalData]);

    const initStrips = () => {
        const tbody = tableRef.current?.querySelector('tbody');
        const trs = tbody?.getElementsByTagName('tr');
        trs && Array.from(trs).forEach((element: HTMLTableRowElement, i: number) => {
            if (i % 2 === 0) {
                element.classList.add('striped');
            }
        });
    }

    const initSortedData = () => {
        sortedData.forEach((data: any, i: number) => {
            data.selected = false;
            Object.assign(data, {
                _initialSortIndex: i,
                _previousSortIndex: i,
                _nextSortIndex: i,
            });
        });
    }

    useEffect(() => {
        // Initialize table strips
        initStrips();

        // Initialize sortFlag
        React.Children.forEach(children, () => {
            sortFlag.push(0);
        });

        // Initialize sortedData with four new variables
        initSortedData();
    }, [originalData])

    const renderTableHeader: any = () => {
        let results: any[] = [];

        React.Children.forEach(children, (child: any, index: number) => {
            if (!child) {
                return;
            }

            const {
                sortKey,
                sortId = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now(),
                slot = 'end',
                sortFunc1,
                sortFunc2,
                children
            } = child.props;

            const classThNames = ClassNames("header-container", {
                "start-slot": slot === 'start',
                "end-slot": slot === 'end',
                "has-sorter": sortKey
            });

            const descId = 'table-sort-' + sortId;

            const classIconNames = ClassNames('Appkit4-icon icon-sorting-outline sort-table animated');

            const animate = (element: HTMLSpanElement, animation: string) => {
                element.classList.add(animation);
                setTimeout(() => {
                    element.classList.remove(animation);
                }, 300);
            }

            const setDescription = (sort: boolean, order?: string) => {
                const descriptionNode = tableRef.current?.querySelectorAll('.ap-table-header-description-sr-only')[index];
                if (descriptionNode) {
                    descriptionNode.innerHTML = sort ? `Click to sort rows by ${sortKey} in ${order} order` : `Click to unsort rows by ${sortKey}`;
                }
            }

            const removeIconClass = () => {
                const headers = tableRef.current?.querySelectorAll('th');
                headers && Array.from(headers).forEach((element: any) => {
                    const hoverHead = element.querySelector('.header-container');
                    const icon = element.querySelector('.icon-sorting-outline');

                    icon?.classList.remove('sorted');
                    hoverHead?.classList.remove('head-sorted');
                    element.removeAttribute('aria-sort');
                });
            }

            const defaultSortFunc = (itemA: any, itemB: any) => {
                const a = itemA[sortKey], b = itemB[sortKey];
                if (!(a || a === 0)) {
                    return 1;
                }
                if (!(b || b === 0)) {
                    return -1;
                }
                if (a === b) {
                    return 0;
                }
                if (sortFlag[index] === 2) {
                    return a < b ? 1 : -1;
                } else {
                    return a > b ? 1 : -1;
                }
            }

            const sortAnimate = () => {
                const tbody = tableRef.current?.querySelector('tbody');
                const trows = tbody?.getElementsByTagName('tr');

                sortedData.forEach((row: any, i: number) => {
                    if (trows) {
                        trows[i].style.transition = 'background-color .3s, transform .3s';
                    }
                });

                let trowsHeight: Array<any> = [];
                trows && Array.from(trows).forEach((row: any, i: number) => {
                    trowsHeight[i] = row.getBoundingClientRect().height;
                });

                // Initialize trowsSortedHeight everytime data is sorted
                let trowsSortedHeight: any = [];
                sortedData.forEach((data: any, i: number) => {
                    trowsSortedHeight[i] = trowsHeight[data._previousSortIndex];
                });

                // Initialize trowsSortedHeightSum everytime data is sorted
                let trowsSortedHeightSum: any = [];
                trowsSortedHeight.reduce((a: number, b: number, i: number) => {
                    trowsSortedHeightSum[i] = a + b;
                    return a + b;
                }, 0);

                sortedData.sort((a: any, b: any) => { return a._previousSortIndex > b._previousSortIndex ? 1 : -1; });
                setSortedData([...sortedData]);

                setTimeout(() => {
                    const tbody = tableRef.current?.querySelector('tbody');
                    let trows = tbody && Array.from(tbody.getElementsByTagName('tr'));
                    if (!trows) return;

                    trows.forEach((th: any) => {
                        th.classList.remove('striped');
                    });

                    let trowsHeightSum: any = [];
                    trowsHeight.reduce((a: number, b: number, i: number) => {
                        trowsHeightSum[i] = a + b;
                        return a + b;
                    }, 0);
                    sortedData.forEach((rowData: any, i: number) => {
                        let val = trowsSortedHeightSum[rowData._nextSortIndex] - trowsHeightSum[rowData._previousSortIndex] + 4 * (rowData._nextSortIndex - rowData._previousSortIndex);
                        trows && (trows[i].style.transform = `translateY(${val}px)`);
                    });

                    setTimeout(() => {
                        sortedData.forEach((row: any, i: number) => {
                            if (trows) {
                                trows[i].style.transform = `none`;
                                trows[i].style.transition = `none`;
                            }
                        });
                        sortedData.sort((a: any, b: any) => { return a._nextSortIndex > b._nextSortIndex ? 1 : -1; });
                        setSortedData([...sortedData]);
                    }, 300); // wait for the transition time of trows
                }, 0);
            }

            const sort = () => {
                if (!sortKey) return;

                const hoverHead = tableRef.current?.querySelectorAll('.header-container')[index];
                const sortIcon = hoverHead?.querySelector('.icon-sorting-outline') as HTMLSpanElement;
                const order1 = sortFunc1! ? 'custom' : 'ascending';
                const order2 = sortFunc2! ? 'custom' : 'descending';

                if (sortFlag[index] === 2 && !skipInitialSort) {
                    sortFlag[index] = 0;
                    setSortFlag([...sortFlag]);
                    animate(sortIcon, 'rotateIn');
                    sortIcon?.classList.remove('sorted');
                    hoverHead?.classList.remove('head-sorted');
                    tableRef.current?.querySelectorAll('th')[index].removeAttribute('aria-sort');
                    setDescription(true, order1);
                    sortedData.sort((a: any, b: any) => { return a._initialSortIndex > b._initialSortIndex ? 1 : -1; });
                    // setSortedData(sortedData);
                    sortedData.forEach((data: any, i: number) => {
                        data._previousSortIndex = data._nextSortIndex;
                        data._nextSortIndex = data._initialSortIndex;
                    });
                    animatedSorting && sortAnimate();
                } else if (sortFlag[index] === 0 || (sortFlag[index] === 2 && skipInitialSort)) { // 1st sorting phase
                    sortFlag[index] = 1;
                    setSortFlag([...sortFlag]);
                    removeIconClass();
                    animate(sortIcon, 'rotateOut');
                    sortIcon?.classList.add('sorted');
                    hoverHead?.classList.add('head-sorted');
                    setDescription(true, order2);
                    let sortFunction;
                    if (sortFunc1) {
                        sortFunction = sortFunc1;
                        tableRef.current?.querySelectorAll('th')[index].removeAttribute('aria-sort');
                    } else {
                        sortFunction = defaultSortFunc;
                        tableRef.current?.querySelectorAll('th')[index].setAttribute('aria-sort', 'ascending');
                    }
                    sortedData.sort(sortFunction);
                    // setSortedData(sortedData);
                    sortedData.forEach((data: any, i: number) => {
                        data._previousSortIndex = data._nextSortIndex;
                        data._nextSortIndex = i;
                    });
                    animatedSorting && sortAnimate();
                } else if (sortFlag[index] === 1) { // 2nd sorting phase
                    sortFlag[index] = 2;
                    setSortFlag([...sortFlag]);
                    removeIconClass();
                    animate(sortIcon, 'rotateOut');
                    sortIcon?.classList.add('sorted');
                    hoverHead?.classList.add('head-sorted');
                    setDescription(false);
                    let sortFunction;
                    if (sortFunc2) {
                        sortFunction = sortFunc2;
                        tableRef.current?.querySelectorAll('th')[index].removeAttribute('aria-sort');
                    } else {
                        sortFunction = defaultSortFunc;
                        tableRef.current?.querySelectorAll('th')[index].setAttribute('aria-sort', 'descending');
                    }
                    sortedData.sort(sortFunction);
                    // setSortedData(sortedData);
                    sortedData.forEach((data: any, i: number) => {
                        data._previousSortIndex = data._nextSortIndex;
                        data._nextSortIndex = i;
                    });
                    animatedSorting && sortAnimate();
                }
            }

            useEffect(() => {
                if (sortActive !== sortKey) return;
                let nextFlag = sortPhase === 0 ? 2 : sortPhase === 1 ? 0 : 1;
                sortFlag[index] = nextFlag;
                setSortFlag([...sortFlag]);
                sort();
            }, []);

            // Add enter event for table sort
            const onkeyDown = (event: React.KeyboardEvent) => {
                if (event.key === KEY_VALUES.ENTER) {
                    event.preventDefault();
                    sort();
                }
            }

            results.push(
                <th key={index}>
                    <div aria-describedby={descId}
                        tabIndex={sortKey ? 0 : -1}
                        onClick={() => { sort() }}
                        onKeyDown={(e) => onkeyDown(e)}
                        className={classThNames}
                        role="button">
                        <span>{children}</span>
                        {sortKey && <span aria-hidden className={classIconNames}></span>}
                        {sortKey &&
                            <span className='ap-table-header-description-sr-only' id={descId}>
                                {`Click to sort rows by ${sortKey} in ascending order`}
                            </span>}
                    </div>
                </th>
            );
        });

        return results;
    };

    const renderTableBody: any = () => {
        let results: any[] = [];

        sortedData.forEach((data: any, index: number) => {
            if (!data) {
                return;
            }

            const onCheckboxChange = (value: boolean) => {
                sortedData.forEach(item => {
                    if (item == data) {
                        item.selected = value;
                    }
                });
                setSortedData([...sortedData]);
                onCheckChange?.(sortedData);
            }

            let tdList: any[] = [];
            React.Children.forEach(children, (child: any, index: number) => {
                if (!child) {
                    return;
                }

                const { sortKey, prefix } = child.props;
                if (data[sortKey]) {
                    tdList.push(
                        <td key={index}>
                            {(checkable && index === 0)
                                ? <Checkbox value={data[sortKey]} checked={data.selected} onChange={(value) => onCheckboxChange?.(value)}>
                                    <span>{prefix ? prefix : ''}{data[sortKey]}</span>
                                </Checkbox>
                                : <span>{prefix ? prefix : ''}{data[sortKey]}</span>}
                        </td>
                    );
                } else {
                    tdList.push(
                        <td key={index}></td>
                    );
                }
            });

            results.push(
                <tr key={index} className={data.selected ? 'selected' : ''}>
                    {tdList}
                </tr>
            );
        });

        return results;
    };

    const classWrapperNames = ClassNames("ap-table", className, {
        "ap-table-condensed": condensed,
        "ap-table-striped": striped,
        "ap-table-checkbox": checkable
    });

    return (
        <div className={classWrapperNames} style={style} id={tableId} ref={tableRef}>
            <table>
                {hasTitle && <thead>
                    <tr>
                        {renderTableHeader()}
                    </tr>
                </thead>}
                <tbody>
                    {renderTableBody()}
                </tbody>
            </table>
        </div>
    );
})


export default Table