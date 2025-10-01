import * as React from 'react';
import { ValueType,  SelectValue, ItemDataType, FocusItemType } from './Select';

export interface FlattenOptionData<ItemDataType> {
  key: React.Key;
  label?: React.ReactNode;
  value?: ValueType;
  data: ItemDataType;
  isGroup?: boolean;
  [key: string]: any;
}

export interface OptionListContextProps {
  onSelect: (value: ValueType, item: ItemDataType, event: React.SyntheticEvent, keyboard?: boolean) => void;
  parsedItems?: any[];
  flattenItems: FlattenOptionData<ItemDataType>[];
  selectedValues: SelectValue,
  childrenAsData?: boolean;
  focusItemValue?: FocusItemType,
  searchWord?: string;
  disabledItemValues?: any[];
}
// @ts-ignore
const OptionListContext = React.createContext<OptionListContextProps>(null);

OptionListContext.displayName = 'OptionListContext';

export default OptionListContext;