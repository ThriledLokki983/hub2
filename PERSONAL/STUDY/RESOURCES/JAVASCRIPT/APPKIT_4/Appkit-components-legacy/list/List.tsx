import * as React from 'react';
import classNames from 'classnames';
import { VirtualList } from '../virtual-list';


export interface ListProps<T> extends React.HTMLAttributes<HTMLSpanElement> {
  style?: React.CSSProperties;
  bordered?: boolean,
  data: T[];
  height?: number,
  itemHeight?: number,
  renderItem?: (item: any, index: number) => React.ReactElement,
  rowKey?: ((item: any) => string) | string,
  width?: number,
  className?: string,
  itemKey: string
}

const List = React.forwardRef<HTMLDivElement, ListProps<any>>((props, ref) => {

  const {
    className,
    style,
    renderItem,
    width,
    bordered,
    data,
    height,
    itemHeight,
    itemKey,
    ...restProps
  } = props;
  const prefixCls = "ap-list";
  const classes = classNames(
    prefixCls,
    {
      [`${prefixCls}-bordered`]: bordered
    },
    className,
  );

  const renderList = (item: any, index: number) => {
    if (renderItem) {
      return renderItem(item, index);
    } else {
      return <span></span>
    }
  }

  return (
    <div className={classes} style={{ width, ...style }} {...restProps}>
      <VirtualList
        id="list"
        data={data}
        height={height}
        itemHeight={itemHeight}
        itemKey={itemKey}
        style={{ boxSizing: 'border-box' }}
      >
        {renderList}
      </VirtualList>
    </div>
  );
});

export default List;




