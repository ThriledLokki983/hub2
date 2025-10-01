import React from "react";
import { convertChildrenToData } from './utils';

export function transformData(data: any[], labelKey: string, valueKey: string) {
    if (!data) {
      return [];
    }
    return data.map(item => {
      if (typeof item === 'string') {
        return {
          [valueKey]: item,
          [labelKey]: item
        };
      }
  
      if (typeof item === 'object') {
        return item;
      }
    });
  }

export default function useOptions<ItemDataType>(
    data: ItemDataType[],
    children: React.ReactNode,
    childrenKey: string,
    valueKey: string,
    labelKey: string
) {
    return React.useMemo(() => {

        let mergedItems = transformData(data, labelKey, valueKey);

        const childrenAsData = !data;
        if (childrenAsData) {
            mergedItems = convertChildrenToData(children, childrenKey);
        }

        const flattenItems: ItemDataType[] = [];
        const itemValues: any[] = [];
    
        function dig(items: ItemDataType[], isChildren = false) {
          for (let i = 0; i < items.length; i += 1) {
            const item: any = items[i];
            if (!item[childrenKey]) {
                flattenItems.push(item);
                itemValues.push(item[valueKey]);
            } else {
                item.isGroup = true;
                dig(item[childrenKey], true);
            }
          }
        }
   
        dig(mergedItems);

        return { itemValues, mergedItems, flattenItems };

    }, [data, children, childrenKey, valueKey])

}