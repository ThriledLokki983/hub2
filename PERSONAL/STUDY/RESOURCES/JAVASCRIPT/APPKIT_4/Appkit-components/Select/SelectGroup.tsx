import type * as React from 'react';


export interface SelectGroupProps {
  label?: string | React.ReactNode;
  children?: React.ReactNode;
}

export interface OptionGroupFC extends React.FC<SelectGroupProps> {
  isSelectOptGroup: boolean;
}

const SelectGroup: OptionGroupFC = () => null;
SelectGroup.isSelectOptGroup = true;

export default SelectGroup;