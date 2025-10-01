
import * as React from 'react';
import { ValueType } from './Select';

export interface Option {
    keepEmpty?: boolean;
  }

  export interface FlattenOptionData<OptionType> {
    label?: React.ReactNode;
    data: OptionType;
    key: React.Key;
    value?: ValueType;
    isGroup?: boolean;
  }
  

export default function toArray(
    children: React.ReactNode,
    option: Option = {},
  ): React.ReactElement[] {
    let ret: React.ReactElement[] = [];
  
    React.Children.forEach(children, (child: any) => {
      if ((child === undefined || child === null) && !option.keepEmpty) {
        return;
      }
  
      if (Array.isArray(child)) {
        ret = ret.concat(toArray(child));
      } else {
        ret.push(child);
      }
    });
  
    return ret;
  }

  function convertNodeToOption<OptionType>(
    node: React.ReactElement,
  ): OptionType {
    const {
      key,
      props: { children, value, ...restProps },
    } = node as React.ReactElement;
  
    return { 
      key,
      value: value !== undefined ? value : key,
      isSelectOption: true,
      // options: null,
      children,
      ...restProps
    };
  }

export function convertChildrenToData<OptionType>(
    nodes: React.ReactNode,
    childrenKey: string,
    optionOnly: boolean = false,

  ): OptionType[] {
    return toArray(nodes).map((node: React.ReactElement, index: number)  => {
        if (!React.isValidElement(node) || !node.type) {
          return null;
        }
  
        const {
          type: { isSelectOptGroup },
          key,
          props: { children, ...restProps },
        } = node as React.ReactElement & {
          type: { isSelectOptGroup?: boolean };
        };
  
        if (optionOnly || !isSelectOptGroup) {
          return convertNodeToOption(node);
        }
  
        return {
          key: `__AP_SELECT_GRP__${key === null ? index : key}__`,
          isSelectOptGroup: true,
          label: key,
          ...restProps,
          [childrenKey]: convertChildrenToData(children, childrenKey),
        };
      })
  }

function getText(rootChild: any) {
    let res = ''
    const rr = (child: any) => {
      if (typeof child === 'string' || typeof child === 'number') {
        res += child
      } else if (Array.isArray(child)) {
        child.forEach(c => rr(c))
      } else if(child && child.props) {
        const { children } = child.props
  
        if (Array.isArray(children)) {
          children.forEach(c => rr(c) )
        } else {
          rr(children)
        }
      }
    }
  
    rr(rootChild)
  
    return res
  }

  export function flattenItemsFun<OptionType>(
    options: OptionType[],
    params: any
  ): FlattenOptionData<OptionType>[] {
    const { childrenAsData, childrenKey, valueKey, labelKey } = params;

    const flattenList: FlattenOptionData<OptionType>[] = [];
  
    function dig(list: OptionType[], isGroupOption: boolean) {
      list.forEach((data: any) => {
        const label = data[labelKey];

        if (isGroupOption || !(childrenKey in data)) {
          const value = data[valueKey];

          flattenList.push({
            key: data.key,
            isGroup: false,
            data,
            [labelKey]: label,
            [valueKey]: value
          });
        } else {
          let grpLabel = label;
          if (grpLabel === undefined && childrenAsData) {
            grpLabel = data[labelKey];
          }
  
          // Option Group
          flattenList.push({
            key: data.key,
            isGroup: true,
            data,
            [labelKey]: grpLabel,
          });
  
          dig(data[childrenKey], true);
        }
      });
    }
  
    dig(options, false);
    return flattenList;
  }


export {
    getText
}