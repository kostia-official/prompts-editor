import { useState, useLayoutEffect, useCallback } from 'react';

export const useLocalStorageState = <T extends unknown>(
  key: string,
  defaultValue: T
): [value: T, setValue: (value: T) => void] => {
  const [value, setValue] = useState<T>(defaultValue);

  useLayoutEffect(() => {
    const localStorageValue = localStorage.getItem(key);
    const parsedValue = localStorageValue && JSON.parse(localStorageValue);

    if (!parsedValue) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
    }
  }, [defaultValue, key]);

  useLayoutEffect(() => {
    const localStorageValue = localStorage.getItem(key);
    if (!localStorageValue) return;

    setValue(JSON.parse(localStorageValue));
  }, [key]);

  const updateValue = useCallback(
    (value: T) => {
      setValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    },
    [key]
  );

  return [value, updateValue];
};
