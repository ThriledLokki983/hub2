import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { MENU_ACTIONS } from 'configs/constants';

import {
  isScrollable,
  filterOptions,
  getUpdatedIndex,
  getActionFromKey,
  maintainScrollVisibility,
} from "./utils";

import { ComboboxProps } from './Combobox.interface';
import styles from './Combobox.module.scss';
import { IconComponent } from "components/Icon/Icon";


const Combobox = ({
  name = 'legislation_filter_combobox',
  label = '',
  defaultValue = '',
  options = [],
  onValueChange,
  showLabel = true,
}: ComboboxProps) => {

  // All refs
  const comboMenuRef = useRef<HTMLDivElement | null>(null);
  const comboRef = useRef(null);
  const inputRef = useRef<HTMLInputElement & { ignoreBlur: boolean } | null>(null);

  // All states
  const [optionList, setOptionList] = useState(options);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const [value, setValue] = useState(defaultValue);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  /**
   * Update the menu state
   */
  const updateMenuState = (menuOpenState: boolean, callFocus: boolean = false) => {
    setDropdownIsOpen(menuOpenState);
    if (inputRef.current) {
      inputRef.current.setAttribute('aria-expanded', `${menuOpenState}`);
      callFocus && inputRef.current?.focus();
    }
  };

  /**
   * Close the menu
   */
  let blurTimeout: any;
  const onInputBlur = () => {
    blurTimeout = setTimeout(() => {
      if (inputRef.current) {
        if (dropdownIsOpen && !inputRef.current.ignoreBlur) {
          setDropdownIsOpen(false);
          updateMenuState(false, false);
        }
      }
    }, 1000 / 60);
  };

  /**
   * onInputChange - filter the options
   */
  const onInputChange = (e: any) => {
    const { target: { value: newValue } }: { target: HTMLInputElement } = e;

    if (!newValue) {
      setFilteredOptions(optionList);
    }

    if (!(newValue === value)) {
      setValue(newValue);
      onValueChange(e);
    }

    // check if the input field is still focused
    if (inputRef.current?.ignoreBlur) {
      inputRef.current.ignoreBlur = true;
    }

    const list = filteredOptions.length ? filteredOptions : optionList;
    const matches = filterOptions(newValue, list, selectedOption);
    setFilteredOptions(matches);

    // if (matches.length > 0) {
    //   optionChangeHandler(filteredOptions.indexOf(matches.at(0) ?? ''));
    // } else {
    //   setSelectedOption(filteredOptions[0] || optionList[0] || defaultValue);
    // }
  };

  /**
   * onInputClick
   */
  const onInputClick = (e: any) => {
    clearTimeout(blurTimeout);
    updateMenuState(true);
  }

  /**
   * Handle the option change
   */
  const optionChangeHandler = (newIndex: any) => {
    inputRef.current?.setAttribute('aria-activedescendant', `${name}-${newIndex}`);
    setSelectedOption(filteredOptions[newIndex]);
    setValue(filteredOptions[newIndex]);

    const options = comboMenuRef.current?.querySelectorAll('[role=option]');
    options?.forEach((optionEl) => {
      optionEl.classList.remove(styles.root__current);
    });
    options && options[newIndex]?.classList.add(styles.root__current);

    // maintain scroll visibility
    if (dropdownIsOpen && isScrollable(comboMenuRef.current!)) {
      const options = comboMenuRef.current?.querySelectorAll('[role=option]');
      if (options && comboMenuRef.current) {
        maintainScrollVisibility(options[newIndex] as HTMLElement, comboMenuRef.current);
      }
    }
  }

  /**
   * Handle the option select
   */
  const optionSelectHandler = (index: number) => {
    // update the aria-selected attribute
    const options = comboMenuRef.current?.querySelectorAll('[role=option]');
    options?.forEach((optionEl) => {
      optionEl.setAttribute('aria-selected', 'false');
    });
    options && options[index === -1 ? 0 : index].setAttribute('aria-selected', 'true');
  };

  /**
   * Handle the option click
   */
  const onOptionClick = (e: any, index: number) => {
    optionChangeHandler(index);
    optionSelectHandler(index);
    onValueChange(e);

    // close the menu
    updateMenuState(false);
    if (inputRef.current) {
      inputRef.current.ignoreBlur = false;
    }
  };

  /**
   * Handle the option mouse down
   */
  const onOptionMouseDownHandler = () => {
    if (inputRef.current) {
      inputRef.current.ignoreBlur = true;
    }
  };

  /**
   * Handle the input keydown
   */
  const onInputKeydownHandler = (event: any) => {
    const max = filteredOptions.length - 1;
    const action = getActionFromKey(event, dropdownIsOpen);
    const activeIndex = filteredOptions.indexOf(selectedOption);

    switch(action) {
      case MENU_ACTIONS.Next:
      case MENU_ACTIONS.Last:
      case MENU_ACTIONS.First:
      case MENU_ACTIONS.Previous:
        event.preventDefault();
        return optionChangeHandler(getUpdatedIndex(activeIndex, max, action));
      case MENU_ACTIONS.CloseSelect:
        event.preventDefault();
        optionSelectHandler(activeIndex);
        return updateMenuState(false);
      case MENU_ACTIONS.Close:
        event.preventDefault();
        return updateMenuState(false);
      case MENU_ACTIONS.Open:
        event.preventDefault();
        return updateMenuState(true);
    }
  };


  /**
   * Form the input value
   */
  useLayoutEffect(() => {
    let timeoutId: any;
    if (value !== selectedOption) {
      timeoutId = setTimeout(() => {
        setValue(inputRef.current?.value || filteredOptions[0] || optionList[0] || defaultValue);
      }, 9000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, selectedOption, value]);


  return (
    <div className={styles.root}>
      <div
        id={`js-${name}`}
        className={`${styles.root__combo} ${dropdownIsOpen ? styles.root__open : ''}`}
        ref={comboRef}
      >
        <input
          id={name}
          className={styles.root__comboinput}
          aria-activedescendant=""
          aria-autocomplete="none"
          aria-controls={`${name}_list`}
          aria-expanded="false"
          aria-haspopup="listbox"
          role="combobox"
          type="text"
          value={value}
          name={name}
          onClick={onInputClick}
          onChange={onInputChange}
          onBlur={onInputBlur}
          onKeyDown={onInputKeydownHandler}
          ref={inputRef}
          // disabled={true}
          // aria-disabled={true}
        />
        <div
          className={`${styles.root__combomenu}`}
          id={`${name}_list`}
          role="listbox"
          ref={comboMenuRef}
        >
          {filteredOptions.map((listItem, index) => (
            <option
              key={`${listItem}-${index}`}
              role="option"
              className={listItem === selectedOption
                ? `${styles.root__option} ${styles.root__current}`
                : `${styles.root__option}`}
              aria-selected={listItem === selectedOption}
              data-value={listItem.toLowerCase()}
              onClick={(e: any) => onOptionClick(e, index)}
              onMouseDown={onOptionMouseDownHandler}
            >
              {listItem}
            </option>
          ))}
        </div>
      </div>
      {showLabel ? <label htmlFor={name} className={styles.root__combolabel}>{label}</label> : null}
      <IconComponent name="DownIcon" />
    </div>
  );

};

export default Combobox;
