import * as React from 'react';
import { getText } from './utils';
// @ts-ignore
import type { OptionType, SelectProps } from './Select';

function includes(test: React.ReactNode, search: string) {
    return getText(test).toLowerCase().includes(search);
}

export default (
    options: OptionType[],
    childrenKey: string,
    labelKey: string,
    searchWord?: string,
    filterOption?: SelectProps['filterOption']
) =>
    React.useMemo(() => {

        if (!searchWord || filterOption === false) {
            return options;
        }

        const filteredOptions: OptionType[] = [];

        const customizeFilter = typeof filterOption === 'function';

        const upperSearch = searchWord.toLowerCase();
        const filterFunc = customizeFilter
            ? filterOption as Function
            : (_: string, option: string) => {
                return includes(option, upperSearch);
            };

        options.forEach((item) => {
            if (item[childrenKey]) {
                const matchGroup = filterFunc(searchWord, item[labelKey]);
                if (matchGroup) {
                    filteredOptions.push(item);
                } else {
                    const subOptions = item[childrenKey].filter((subItem: any) =>
                        filterFunc(searchWord, getText(subItem[labelKey])),
                    );

                    if (subOptions.length) {

                        filteredOptions.push({
                            ...item,
                            [childrenKey]: subOptions
                        });
                    }
                }

                return;
            }

            if (filterFunc(searchWord, getText(item[labelKey]))) {
                filteredOptions.push(item);
            }
        });

        return filteredOptions;
    }, [options, searchWord, filterOption]);
