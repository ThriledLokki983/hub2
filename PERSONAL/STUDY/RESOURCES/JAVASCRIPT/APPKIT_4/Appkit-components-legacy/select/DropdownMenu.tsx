import React, { useCallback, useRef, useEffect } from "react";
import ClassNames from "classnames";
import { KEY_VALUES, mergeRefs } from '../utils';
// import { Input } from '../field';
import Search from './Search';
import DropdownMenuItem from "./DropdownMenuItem";

import OptionListContext from "./OptionListContext";
import { ValueType, ItemDataType } from './Select';
import { _uuid } from '../utils';
import { getText } from "./utils";

export interface FlattenOptionData<ItemDataType> {
  label?: React.ReactNode;
  data: ItemDataType;
  key: React.Key;
  value?: ValueType;
  isGroup?: boolean;
  [key: string]: any;
}

export interface DropdownMenuProps {
  id?: string;
  style?: React.CSSProperties;
  className?: string;
  onSearch?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  // selectAll?: React.ReactNode;
  searchable?: boolean;
  searchWord?: string;
  searchPlaceholder?: string;
  visible?: boolean;
  multiple?: boolean;
  children?: React.ReactNode;
  labelKey?: string;
  valueKey?: string;
  childrenKey?: string;
  maxHeight?: number;
  noResultFound?: React.ReactNode;
  dropdownItemArialabel?: boolean;
  itemTemplate?: (label: React.ReactNode, item: ItemDataType) => React.ReactNode;
  badgeTemplate?: (item: ItemDataType) => React.ReactNode;
  prefixTemplate?: (item: ItemDataType) => React.ReactNode;
  suffixTemplate?: (item: ItemDataType) => React.ReactNode;
  role?: string;
};

const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>((props, ref) => {
  const {
    id,
    style,
    className,
    children,
    visible = false,
    // selectAll,
    searchable,
    searchPlaceholder,
    onSearch,
    multiple,
    labelKey = 'label',
    valueKey = 'value',
    childrenKey = 'children',
    itemTemplate,
    badgeTemplate,
    prefixTemplate,
    suffixTemplate,
    noResultFound,
    maxHeight = 320,
    searchWord: searchWordProp,
    dropdownItemArialabel,
    role,
    ...restProps
  } = props;

  const containerElementRef = useRef<HTMLDivElement>(null);

  const {
    disabledItemValues,
    flattenItems = [],
    selectedValues,
    focusItemValue,
    onSelect,
    searchWord = ''
  } = React.useContext(OptionListContext);

  const styles = { ...style };

  const renderSearch = () => {
    const onSearchKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        const key = event.key;
        if (KEY_VALUES.DOWN !== key && KEY_VALUES.UP !== key && KEY_VALUES.ESC !== key) {
          event.stopPropagation();
        }
      }, [visible]);

    const handleSearch = useCallback(
      (value: any, event: React.ChangeEvent<HTMLInputElement>) => {
        onSearch?.(value, event);
      }, [onSearch]);


    const handleChange = useCallback(
      (value, event: any) => {
        onSearch?.(value, event);
      }, [onSearch]);

    return (
      <>
        {
          searchable ? (
            <div className="search-container">
              <Search
                style={{ padding: 0 }}
                placeholder={searchPlaceholder}
                value={searchWord}
                onKeyDown={onSearchKeyDown}
                onChange={handleChange}
              />
            </div>) : null
        }
      </>

    )
  }

  const handleSelect = useCallback(
    (value, item, e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault && e.preventDefault();

      onSelect?.(value, item, e);
    }, [onSelect]);

  const renderItem = (
    list: any[],
    { index, style }: { index: number; style?: React.CSSProperties }
  ) => {

    const item = list[index];
    const value = item[valueKey];
    const label = item[labelKey];

    const { isGroup, data, key: keyProp } = item;
    const key = data && data.key || keyProp || index;

    if (isGroup) {
      const groupTitle = data[labelKey];
      return (
        <div key={index} className="ap-option-group" title={getText(groupTitle)}>
          <span className="ap-group-label">
            {groupTitle !== undefined ? groupTitle : key}
          </span>
        </div>
      );
    }

    const disabled = !data && item.disabled || data?.disabled || disabledItemValues?.includes(value);
    const active = Array.isArray(selectedValues) ? selectedValues.includes(value) : selectedValues === value;

    const focus = focusItemValue?.value === value && focusItemValue?.keyboard;

    let itemElement = null;

    if (itemTemplate && typeof itemTemplate === 'function') {
      itemElement = itemTemplate(label, data);
    }

    return (
      <DropdownMenuItem
        dropdownItemArialabel={dropdownItemArialabel}
        key={index}
        active={active}
        focus={focus}
        disabled={disabled}
        value={value}
        label={label}
        data={data}
        onSelect={handleSelect}
        multiple={multiple}
        highlightWords={searchWord}
        badgeTemplate={badgeTemplate}
        prefixTemplate={prefixTemplate}
        suffixTemplate={suffixTemplate}
        role={role === 'menu' ? 'menuitem' : 'option'}
      >
        {itemTemplate ? itemTemplate(label, data) : null}
      </DropdownMenuItem>
    );
  };

  const searchComponent = renderSearch();



  return (
    <div
      id={id}
      className={ClassNames(className, {
        open: visible,
        hide: !visible
      })}
      style={styles}
      ref={mergeRefs(ref, containerElementRef)}
      role={role}
      aria-multiselectable={multiple}
      aria-labelledby="combo1-label"
      {...restProps}
    >
      {/* {selectAll} */}
      {searchComponent}

      {
        flattenItems.length === 0 ? (
          <div key="noResult" className="ap-option-item noResult">
            <span className="ap-option-label">{noResultFound}</span>
          </div>
        ) : flattenItems.map((_item, index: number) => renderItem(flattenItems, { index }))
      }
    </div>
  );
});

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;