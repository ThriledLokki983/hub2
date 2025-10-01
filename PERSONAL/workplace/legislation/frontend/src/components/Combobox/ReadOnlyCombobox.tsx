import { ReadOnlyComboboxProps } from './ReadOnlyCombobox.interface';
import React, { useEffect, useRef, useState, KeyboardEvent, MouseEvent } from 'react';
import { MENU_ACTIONS } from 'configs/constants';

import { IconComponent } from 'components';
import {
  isScrollable,
  getIndexByLetter,
  getUpdatedIndex,
  getActionFromKey,
  maintainScrollVisibility,
} from "./utils";
import styles from './Combobox.module.scss';


const ReadOnlySelect: React.FC<ReadOnlyComboboxProps> = ({ options, onSelect, name = '', id = 'read-only-select', ...rest }) => {

  const [activeIndex, setActiveIndex] = useState(0);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [searchString, setSearchString] = useState('');

  const searchTimeoutRef = useRef<number | null>(null);

  const comboRef = useRef<HTMLDivElement & { ignoreBlur: boolean } >(null);
  const valueElRef = useRef<HTMLSpanElement>(null);
  const comboMenuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement & { ignoreBlur: boolean } | null>(null);

  /**
   * Update the menu state
   */
  const updateMenuState = (menuOpenState: boolean, callFocus = true) => {
    setDropdownIsOpen(menuOpenState);

    if (comboRef.current) {
      comboRef.current.setAttribute('aria-expanded', `${menuOpenState}`);
      if (callFocus) {
        comboRef.current.focus();
      }

      const activeID = menuOpenState ? `${comboRef.current.id}-${activeIndex}` : valueElRef.current?.id;
      comboRef.current.setAttribute('aria-activedescendant', activeID || '');
    }
  };

  /**
   * Set the first option as the default
   */
  useEffect(() => {
    if (options.length > 0) {
      if (valueElRef.current) {
        valueElRef.current.innerHTML = options[0];
      }
    }
  }, [options]);


  const getSearchString = (char: string): string => {
    if (typeof searchTimeoutRef.current === 'number') {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      setSearchString('');
    }, 1000);

    setSearchString((prev) => prev + char);
    return searchString + char;
  };


  /**
   * Close the menu
   */
  let blurTimeout: any;
  const onComboBlur = () => {
    blurTimeout = setTimeout(() => {
      if (comboRef.current) {
        if (dropdownIsOpen && !comboRef.current.ignoreBlur) {
          setDropdownIsOpen(false);
          selectOption(activeIndex);
          updateMenuState(false, false);
        }
      }
    }, 1000 / 60);

  };


  /**
   * Handle the option change
   */
  const onOptionChange = (index: number) => {
    setActiveIndex(index);
    if (comboRef.current) {
      comboRef.current.setAttribute('aria-activedescendant', `${comboRef.current.id}-${index}`);
    }

    const optionList = comboMenuRef.current?.querySelectorAll('[role=option]');
    optionList?.forEach((optionEl) => {
      optionEl.classList.remove(styles.root__current);
    });
    optionList?.[index].classList.add(styles.root__current);

    if (dropdownIsOpen && isScrollable(comboMenuRef.current!)) {
      const options = comboMenuRef.current?.querySelectorAll('[role="option"]');
      if (options && comboMenuRef.current) {
        maintainScrollVisibility(options[index] as HTMLElement, comboMenuRef.current);
      }
    }

    if (comboMenuRef.current && optionList && isScrollable(comboMenuRef.current)) {
      maintainScrollVisibility(optionList[index] as HTMLElement, comboMenuRef.current);
    }
  };


  /**
   * Handle the option click
   */
  const onOptionClick = (index: number) => {
    onOptionChange(index);
    selectOption(index);
    updateMenuState(false);

    // close the menu
    updateMenuState(false);
    if (comboRef.current) {
      comboRef.current.ignoreBlur = false;
    }
  };


  /**
   * Handle the option select
   */
  const selectOption = (index: number) => {
    const selected = options[index];
    if (valueElRef.current) {
      valueElRef.current.innerHTML = selected;
    }
    setActiveIndex(index);

    const optionsEls = comboMenuRef.current?.querySelectorAll('[role=option]');
    optionsEls?.forEach((optionEl) => {
      optionEl.setAttribute('aria-selected', 'false');
    });
    optionsEls?.[index].setAttribute('aria-selected', 'true');
    updateMenuState(false, false);
  };


  /**
   * Handle the option mouse down
   */
  const onOptionMouseDownHandler = () => {
    if (comboRef.current) {
      comboRef.current.ignoreBlur = true;
      clearTimeout(blurTimeout)
    }
  };


  /**
   * Handle the input keydown
   */
  const onComboKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;
    const max = options.length - 1;
    const action = getActionFromKey(event, dropdownIsOpen);

    switch (action) {
      case MENU_ACTIONS.Next:
      case MENU_ACTIONS.Last:
      case MENU_ACTIONS.First:
      case MENU_ACTIONS.Previous:
        event.preventDefault();
        return onOptionChange(getUpdatedIndex(activeIndex, max, action));
      case MENU_ACTIONS.CloseSelect:
      case MENU_ACTIONS.Space:
        event.preventDefault();
        return selectOption(activeIndex);
      case MENU_ACTIONS.Close:
        event.preventDefault();
        return updateMenuState(false);
      case MENU_ACTIONS.Type:
        updateMenuState(true);
        return onOptionChange(Math.max(0, getIndexByLetter(options, getSearchString(key))));
      case MENU_ACTIONS.Open:
        event.preventDefault();
        return updateMenuState(true);
      default:
        break;
    }
  };

  return (
    <div className={styles.root} data-select-only data-is-active={dropdownIsOpen} id={id} {...rest}>
      <div
        id={`js-${name}`}
        className={`${styles.root__combo} ${dropdownIsOpen ? styles.root__open : ''}`}
        ref={comboRef}
        aria-expanded={dropdownIsOpen}
        onBlur={onComboBlur}
        onKeyDown={onComboKeyDown}
        onClick={() => {
          clearTimeout(blurTimeout);
          updateMenuState(true)
        }}
      >
        <div
          id={name}
          aria-activedescendant="combo-select-only"
          aria-autocomplete="none"
          aria-controls={`${name}_list`}
          aria-expanded={dropdownIsOpen}
          aria-haspopup="listbox"
          aria-labelledby="combo1-label"
          className={styles.root__comboinput}
          data-select-only
          role="combobox"
          tabIndex={0}
          ref={inputRef}
        >
          <span className={styles.root__combovalue} ref={valueElRef} id='combo-select-only'></span>
          <IconComponent name="DownIcon" title="Filter"/>
        </div>
        <div
          className={`${styles.root__combomenu}`}
          role="listbox"
          aria-controls="listbox"
          aria-expanded={dropdownIsOpen}
          data-select-only
          ref={comboMenuRef}
        >
          {options.map((option, index) => (
            <option
              key={index}
              id={`${comboRef.current?.id}-${index}`}
              role="option"
              className={index === 0
                ? `${styles.root__option} ${styles.root__current}`
                : `${styles.root__option}`}
              aria-selected={index === 0}
              onClick={(e: MouseEvent<HTMLOptionElement>) => {
                e.stopPropagation();
                onOptionClick(index);
                onSelect(option.toLowerCase().replace(' ', '_'))
              }}
              onMouseDown={onOptionMouseDownHandler}
            >
              {option}
            </option>
          ))}
        </div>
      </div>
    </div>
  );

};

export default ReadOnlySelect;
