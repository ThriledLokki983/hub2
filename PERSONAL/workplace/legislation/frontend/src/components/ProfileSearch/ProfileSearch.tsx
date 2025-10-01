import { Children, useMemo, useRef, useState } from 'react';
import { debounce, uuid, triggerEvent } from '@grrr/utils';

import {
  isSpaceKey,
  isEnterKey,
  isEscapeKey,
  isDownKey,
  isUpKey,
  setReactInputValue,
  highlight,
} from 'helpers/utils';

import { useQueryApi } from 'hooks';
import { SEARCH_PEOPLE } from 'configs/api-endpoints';
import { Avatar, IconComponent } from 'components';

import { ProfileSearchProps } from './ProfileSearch.interface';
import { UserProfile } from 'hooks/interfaces';
import styles from './ProfileSearch.module.scss';

const MIN_LENGTH = 2;
const INPUT_DEBOUNCE = 300;


const ProfileSearch = ({
  id,
  label,
  subLabel,
  placeholder,
  scrollOnFocus = false,
  disabledEntries = [],
  disabled = false,
  required = false,
  onSelect = () => null,
  ...rest
}: ProfileSearchProps) => {

  const componentRef = useRef<HTMLDivElement | null>(null);
  const searchInput = useRef<HTMLInputElement | null>(null);
  const resultsList = useRef<HTMLOListElement | null>(null);

  const uniqueIdentifier = useMemo(() => uuid(), []);
  const name = id || uniqueIdentifier;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const { post: searchPeopleQuery } = useQueryApi(SEARCH_PEOPLE);
  const { data: peopleData, mutate: searchPeople, error: peopleError, isSuccess, isPending } = searchPeopleQuery();


  /**
   * Get normalized active search input value.
   * Note: the `query` state is not reliable, since it is async.
   */
  const getQueryValue = () => searchInput.current?.value.trim();

  /**
   * Propagate selection of selected person.
   */
  const updateSelected = (person: UserProfile) => onSelect(person);

  /**
   * Handle search input updates and fetch new queries.
   */
  const searchChangeHandler = (e: any) => {
    const value = getQueryValue();

    // Reset data and UI states.
    setResults([]);

    // Disable search for searches smaller than min length.
    if (value && value.length < MIN_LENGTH) {
      setIsSearching(false);
      return;
    }

    // Set search and fetch UI states.
    setIsSearching(true);
    setIsFetching(true);

    // Fetch results.
    if (value && value.length >= MIN_LENGTH && !disabled) {
      const payload = { search_term: value };
      setQuery(value);
      searchPeople(payload);
      setIsFetching(false)
    }
  };
  const searchChangeHandlerDebounced = useMemo(
    () => debounce(searchChangeHandler, INPUT_DEBOUNCE),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );


  /**
   * Update the results if peopleData changes.
   */
  useMemo(() => {
    if (peopleData && isSuccess && !peopleError) {
      const { results } = peopleData;
      setResults(results);
    }
  } , [isSuccess, peopleData, peopleError]);


  /**
   * Select search result and reset input.
   */
  const selectSearchResult = (entry: any) => {
    // Propagate selected result.
    updateSelected(entry);

    // Reset search input.
    if (searchInput.current) {
      setReactInputValue(searchInput.current, '');
      triggerEvent(searchInput.current, 'change');

      // Focus on input.
      window.setTimeout(() => searchInput.current?.focus(), 0);
    }


    // Reset results.
    window.setTimeout(() => {
      setResults([]);
      setIsSearching(false);
    }, 50);

  };

    /**
   * Handle search focus.
   */
  const searchFocusHandler = (e: any) => {
    if (results.length) {
      setIsSearching(true);
    }
    // Focus into view.
    // if (scrollOnFocus && searchInput.current) {
    //   searchInput.current.scrollIntoView({
    //     behavior: 'smooth',
    //     block: 'start',
    //   });
    // }
    // Reset scroll position of the results.
    // if (resultsList?.current && resultsList.current?.parentNode) {
    //   const parentNode = resultsList.current.parentNode as HTMLElement;
    //   parentNode.scrollTop = 0;
    // }
  };


  /**
   * Handle search key down events.
   */
  const searchKeyDownHandler = (e: any) => {
    const result = resultsList.current && resultsList?.current.querySelector('[tabindex="0"]') as HTMLElement;

    // When hitting enter make sure to take first person
    if (e.key === "Enter" && result) {
      result.focus();
      selectSearchResult(results[0])
    }

    // Go down into search results.
    if (isDownKey(e)) {
      if (result) {
        result.focus();
      }
    }

    // Continue to next form elements.
    if (e.key === 'Tab' && !e.shiftKey && componentRef.current) {
      const nextContainer = componentRef.current.nextElementSibling as HTMLElement;
      const nextFocus = [...nextContainer
        .querySelectorAll(`[tabindex="0"], input, textarea, button, a`)]
        .filter((node) => (node as HTMLElement).offsetParent) as HTMLElement[];
      if (nextFocus && nextFocus.length > 0) {
        e.preventDefault();
        window.setTimeout(() => nextFocus[0].focus(), 0);
      }
    }

  };


  /**
   * Handle search result key events (select, up/down and quite).
   */
  const resultsKeyDownHandler = (e: any) => {

    const index = document.activeElement?.getAttribute('data-index');
    const parsedIndex = index ? parseInt(index, 10) : undefined;

    // Select
    if (isSpaceKey(e) || isEnterKey(e)) {
      if (typeof parsedIndex !== 'undefined') {
        selectSearchResult(results[parsedIndex]);
      }
    }

    // Up
    if (isUpKey(e) && resultsList.current && typeof parsedIndex !== 'undefined') {
      const nodes = [...resultsList.current.children];
      const prev = nodes.reverse().find(node => {
        const focusable = (node as HTMLElement).getAttribute('tabindex') === '0';
        const i = parseInt((node as HTMLElement).getAttribute('data-index') ?? '0', 10);
        return focusable && i < parsedIndex;
      }) as HTMLElement;
      if (prev) {
        prev.focus();
      } else {
        searchInput.current?.focus();
      }
    }

    // Down
    if (isDownKey(e) && resultsList.current && typeof parsedIndex !== 'undefined') {
      const nodes = [...resultsList.current.children];
      const next = nodes.find((node, i) => {
        const focusable = node.getAttribute('tabindex') === '0';
        return focusable && i > parsedIndex;
      }) as HTMLElement;
      if (next) {
        next.focus();
      }
    }

    // Quit
    if (isEscapeKey(e)) {
      searchInput.current?.focus();
    }
  };

  /**
   * Handle search result select (click or key).
   */
  const resultClickHandler = (e: any) => {
    const target = e.currentTarget;
    if (target.getAttribute('tabindex') === '-1') {
      return;
    }
    const index = parseInt(target.getAttribute('data-index'), 10);
    selectSearchResult(results[index]);
  };


  return (
    <section className={styles.root} data-is-searching={isSearching} ref={componentRef} {...rest}>
      <div id='search-people'>
        <label htmlFor={name}>{label}</label>
        <span data-subtitle>{subLabel}</span>
        <input
          key={uniqueIdentifier}
          id={name}
          type="text"
          name={name}
          ref={searchInput}
          onChange={searchChangeHandlerDebounced}
          onFocus={searchFocusHandler}
          onKeyDown={searchKeyDownHandler}
          autoComplete="off"
          autoFocus={rest?.autoFocus}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
        />
        <IconComponent name="SearchOutlineIcon" />
      </div>

      <div className={styles.root__resultscontainer}>
        <div className={styles.root__results} hidden={!isSearching || !!isFetching}>
          <ol
            hidden={!results?.length}
            aria-live="polite"
            aria-label="Search results"
            ref={resultsList}
            onKeyDown={resultsKeyDownHandler}
          >
            {results?.length ? Children.toArray(results?.map((profile: UserProfile, index: number) => {
              const disabled = Boolean(disabledEntries.find(s => s.email.toLowerCase() === profile.email?.toLowerCase()));
              return (
                <li
                  className={styles.root__person}
                  data-index={index}
                  onClick={resultClickHandler}
                  tabIndex={0}
                >
                  <PeopleSearchResult
                    data={profile}
                    query={query}
                    disabled={disabled}
                  />
                </li>
              )
            })) : null}
          </ol>
          {results?.length === 0 && !isFetching ? (
            <p role="alert" hidden={results?.length > 0}>
              Sorry, we can't find anyone matching your search query.
            </p>
          ) : null }
          {isFetching && !isPending && !isFetching ? (
            <p hidden={results?.length > 0}>Please type the name or email to start searching.</p>
          ) : null}
          {isPending ? (
            <p hidden={results?.length > 0}>Searching...</p>
          ) : null}
        </div>
      </div>
    </section>
  );

};

export default ProfileSearch;

interface PeopleSearchResultProps {
  data: UserProfile;
  query: string;
  disabled: boolean;
}

const PeopleSearchResult = ({ data, query = '', disabled, ...props }: PeopleSearchResultProps) => {
  const fullName = `${data.first_name} ${data.last_name}`;

  return (
    <article className={styles.root__profile} data-disabled={disabled}>
      <Avatar userData={data} size="32px" onClickHandler={() => {}} />
      <div className={styles.root__body}>
        <div className={styles.root__name}>
          <p dangerouslySetInnerHTML={{ __html: highlight(data.first_name, query) + `${data.last_name ? ` ${data.last_name}` : `${fullName}` }`}}></p>
          <span>{data.email}</span>
        </div>
        <div className={styles.root__email}>
          <span>{data.groups[0]}</span>
        </div>
      </div>
    </article>
  );

};
