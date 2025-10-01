import { useRef, useMemo } from 'react'
import { debounce } from '@grrr/utils';

import { LabeledInput } from '..';
import { SearchFieldProps } from './SearchField.interface';

import styles from './SearchField.module.scss';
import SearchIcon from 'assets/icons/search-outline.svg?react';

const INPUT_DEBOUNCE = 300;


function SearchField({
  label,
  name,
  onSearch,
  scrollOnFocus,
  icon = SearchIcon,
  id = ''
}: SearchFieldProps) {

  const searchInput = useRef<HTMLInputElement | null>(null);

  /**
   * Get normalized active search input value.
   * Note: we cannot always rely on `query` state, since it is async.
  */
  const getQueryValue = () => searchInput.current?.value.trim();

  /**
   * Handle search focus.
  */
  const searchFocusHandler = (e: React.SyntheticEvent) => {
    onSearch(e);
    // if (results.length) {
    //   setIsSearching(true);
    // }
    // // Focus into view.
    // if (scrollOnFocus) {
    //   searchInput.current.scrollIntoView({
    //     behavior: 'smooth',
    //     block: 'start',
    //   });
    // }
    // // Reset scroll position of the results.
    // if (resultsList?.current) {
    //   resultsList.current.parentNode.scrollTop = 0;
    // }
  };

  /**
   * Handle search key down events.
  */
  const searchKeyDownHandler = (e: React.SyntheticEvent) => {
    // const result = resultsList?.current.querySelector('[tabindex="0"]');

    // // When hitting enter make sure to take first person
    // if (e.key === "Enter" && result) {
    //   result.focus();
    //   selectSearchResult(results[0])
    // }

    // // Go down into search results.
    // if (isDownKey(e)) {
    //   if (result) {
    //     result.focus();
    //   }
    // }

    // // Continue to next form elements.
    // if (e.key === 'Tab' && !e.shiftKey) {
    //   const nextContainer = componentRef.current.nextElementSibling;
    //   const nextFocus = [...nextContainer
    //     .querySelectorAll(`[tabindex="0"], input, textarea, button, a`)]
    //     .filter(node => node.offsetParent);
    //   if (nextFocus) {
    //     e.preventDefault();
    //     window.setTimeout(() => nextFocus.at(0).focus(), 0);
    //   }
    // }

  };

  /**
   * Handle search input updates and fetch new queries.
  */
  const searchChangeHandler = (e: React.SyntheticEvent) => {
    onSearch(e);
  };

  const searchChangeHandlerDebounced = useMemo(
    () => debounce(searchChangeHandler, INPUT_DEBOUNCE),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className={styles.root}>
      <LabeledInput
        label={label}
        id={`${id}-${name}-${label}`}
        icon={{ object: icon }}
      >
        {/* <Input
          name={name}
          label={label}
          id={id}
          icon={icon}
          scrollOnFocus={scrollOnFocus}
        /> */}
        <input
          id={id}
          type="search"
          name={name}
          ref={searchInput}
          onChange={searchChangeHandlerDebounced}
          onFocus={searchFocusHandler}
          onKeyDown={searchKeyDownHandler}
          autoComplete="off"
        />
      </LabeledInput>
    </div>
  )
}

export default SearchField
