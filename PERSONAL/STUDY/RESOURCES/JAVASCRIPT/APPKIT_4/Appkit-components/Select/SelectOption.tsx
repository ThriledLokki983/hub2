// import React from "react";
// import ClassNames from "classnames";
// import { Checkbox } from "../Checkbox";
// import SelectContext from "./SelectContext";

// export interface SelectOptionProps {
//   prefixCls?: string;
//   style?: React.CSSProperties;
//   className?: string;
//   isActive?: boolean;
//   value: any;
//   children?: React.ReactNode;
//   selectedDisplay?: any;
//   searchableText?: string;
//   disabled?: boolean;
//   multiple?: boolean;
//   keyboardHighlight?: boolean;
// };

// export interface SelectOptionFC extends React.FC<SelectOptionProps> {
//   /** Legacy for check if is an Option Group */
//   isSelectOption: boolean;
// }

// const SelectOption: SelectOptionFC = (props) => {

//   const {
//     children,
//     value,
//     isActive,
//     selectedDisplay,
//     searchableText,
//     disabled,
//     multiple,
//     keyboardHighlight,
//     ...others
//   } = props;

//   return (
//     <SelectContext.Consumer>
//       {({ parsedOptions = [], onSelect, activeInfo }) => {




//         let option;


//         const index = parsedOptions.findIndex(p => p.value === value);
//         if (index > -1) {
//           option = parsedOptions[index];
//         }

//         let content =
//           multiple ? (
//             <Checkbox checked={option.isActive} disabled={option.isDisabled}>
//               {children}
//             </Checkbox>
//           ) : (
//             children
//           );


//         const classNames = ClassNames('ap-option-item', {
//           'disabled': option && option.isDisabled,
//           'moved': activeInfo && activeInfo.activeValue === value && activeInfo.keyboard,
//           'active': option && option.isActive
//         });

//         const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
//           e.preventDefault && e.preventDefault();

//           if (disabled) {
//             return;
//           }
//           onSelect && onSelect(value, e);
//         }

//         return (
//           <div
//             className={classNames}
//             onClick={onClick}
//             role={"option"}
//             arial-label={disabled}
//             tabIndex={-1}
//           >
//             {content}
//           </div>
//         );
//       }}
//     </SelectContext.Consumer>
//   );
// }


// SelectOption.isSelectOption = true;

// export default SelectOption;
export {};
