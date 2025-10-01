import React, { forwardRef } from 'react';


interface IColumnProps {
    sortKey?: string,
    sortId?: string,
    style?: React.CSSProperties,
    slot?: string,
    prefix?: string,
    className?: string,
    sortFunc1?: (a: any, b: any) => number,
    sortFunc2?: (a: any, b: any) => number,
    children?: React.ReactNode
}

export interface ColumnProps extends React.HTMLAttributes<HTMLTableCellElement>,
    IColumnProps { }

const Column = forwardRef<HTMLTableCellElement, ColumnProps>((props, ref) => {
    const {
        sortKey = '',
        sortId = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now(),
        slot = 'end',
        prefix,
        sortFunc1,
        sortFunc2,
        children
    } = props;

    return (
        <th ref={ref}>
            <span>{children}</span>
        </th>
    );
})

export default Column