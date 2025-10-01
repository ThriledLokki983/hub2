import { useState } from "react";

interface LocalStorage {
	keyName: string
	defaultValue: string
}


/**
 * LS: LocalStorage
 * Use the useState() hook with a function to initialize its value lazily.
 * Use a try...catch block and Storage.getItem() to try and get the value from Window.localStorage. If no value is found, use Storage.setItem() to store the defaultValue and use it as the initial state. If an error occurs, use defaultValue as the initial state.
 * Define a function that will update the state variable with the passed value and use Storage.setItem() to store it.
 * @param KeyName | value to search from the LS
 * @param defaultValue | default value to search from the LS if no keyName is given
 * @returns
 */
const useLocalStorage = ({keyName, defaultValue}: LocalStorage) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);

      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });

  const setValue = (newValue: string) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {
		// TODO: Handle error at this point
	}
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
};

export default useLocalStorage