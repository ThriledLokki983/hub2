import { DEFAULT_APPROVED_FILTER } from "configs/legislation/legislation";
import { NavigatorLegislation } from 'hooks/interfaces/navigator.interface';
import {
  Filter,
  Category,
  FilterData,
  Legislation,
  FilterOption,
  LegislationTab
} from "hooks/interfaces/legislation.interface";
import { ConfigLegislation } from "hooks/interfaces/project.interface";


// =============================================//
// ============ HELPER FUNCTIONS ==============//
// ============================================//


/**
 * Function to filter data based on the filter values
 * 1. Create a map of approved filter names by category
 * 2. The approvedFilters object is populated with the approved filter identifiers
 * 3. MatchesApprovedFilters function checks if any of the item’s category data match the approved filter identifiers.
 * 1. Create a map of approved filter names by category
 * 2. The approvedFilters object is populated with the approved filter identifiers
 * 3. MatchesApprovedFilters function checks if any of the item’s category data match the approved filter identifiers.
 * @param data
 * @param filters
 * @returns items where every relevant category contains at least one approved filter value OR
 * Return only legislations that contains filters that matches the selected filters
 * @returns items where every relevant category contains at least one approved filter value OR
 * Return only legislations that contains filters that matches the selected filters
 */
export const filterData = (
  data: Legislation[] | NavigatorLegislation[],
  filters: Filter[],
  isNavigatorLegislation: boolean = false
) => {
  const approvedFilters: Category = { ...DEFAULT_APPROVED_FILTER };

  filters.forEach((filterCategory: Filter) => {
    if (['effective_year', 'status'].includes(filterCategory.label)) {
      (approvedFilters as Category)[filterCategory.label as keyof Category] = filterCategory.data
        .filter(filterItem => filterItem.is_approved).map(filterItem => filterItem.name);
    } else {
      (approvedFilters as Category)[filterCategory.label as keyof Category] = filterCategory.data
        .filter(filterItem => filterItem.is_approved).map(filterItem => filterItem.identifier);
    }
  });
  return applyFilter(data, approvedFilters, isNavigatorLegislation);
}

/**
 * ---------------------------------------------------------------------
 * Return all the legislation data that matches only the selected filters
 * NOT that any legislation that contains any of the selected filters.
 * @param data
 * @param approvedFilters
 * @returns
 */
export const applyFilter = (data: Legislation[] | NavigatorLegislation[], approvedFilters: Category, isNavigatorLegislation = false) => {
  return data?.filter((item: Legislation | NavigatorLegislation) => {
    return Object.keys(approvedFilters).every((category: string) => {
      if (approvedFilters[category as keyof Category]?.length === 0) return true;
      return isNavigatorLegislation
        ? matchesApprovedFilters((item as NavigatorLegislation).legislation, category, approvedFilters)
        : matchesApprovedFilters((item as Legislation), category, approvedFilters);
    });
  });
};

/**
 * Checks if any of the item’s category data match the approved filter identifiers.
 * @param item
 * @param category
 * @param approvedFilters
 * @returns
 */
export const matchesApprovedFilters = (item: Legislation, category: string, approvedFilters: Category): boolean => {

  if (category === 'effective_year') {
    const itemCategoryData = (item.effective_date as string)?.split('-')[0];
    return (approvedFilters as Category)[category as keyof Category]?.includes(itemCategoryData?.toString());
  }

  if (!item[category as keyof Category as keyof Legislation]) return false;

  if (category === 'status') {
    const itemCategoryData = (item[category as keyof Legislation] as string)?.toLowerCase().trim();
    return (approvedFilters as Category)[category as keyof Category].includes(itemCategoryData);
  }

  const itemCategoryData = item[category as keyof Legislation] as FilterData[];

  return itemCategoryData
    ?.some((value: FilterData) => (approvedFilters as Category)[category as keyof Category]
    .includes(value.identifier));
};

/**
 * Updates the filters based on the provided filter, filter value, and filter checked status.
 * @param f - The array of filters to update.
 * @param filterOption - The filter object to update.
 * @param filterValue - The filter value to update.
 * @param isFilterChecked - The filter checked status to update.
 * @returns The updated array of filters.
 */
export const updateFilters = (
  filters: Filter[],
  filterOption: Filter,
  filterValue: string,
  isFilterChecked: boolean
): Filter[] => {
  return filters.map((filter: Filter) => {

    if (filter.name === filterOption.name) {
      return {
        ...filter,
        data: filter.data.map(option => updateOption(option, filterValue, isFilterChecked))
      };
    }
    return filter;
  });
};

/**
 * Updates the given filter option with the specified value and checked status.
 * @param o - The filter option to update.
 * @param v - The value to set for the filter option.
 * @param isChecked - The checked status to set for the filter option.
 * @returns The updated filter option.
 */
export const updateOption = (option: FilterOption, filterValue: string, isChecked: boolean): FilterOption => {
  if (option.name.toLowerCase().trim() === filterValue.toLowerCase().trim()) {
    return { ...option, is_approved: isChecked };
  }
  return option;
};

/**
 * Updates the filter options by setting the 'checked' and 'is_approved' properties to false
 * for the option with the specified filterOptionId.
 * @param filters - An array of Filter objects.
 * @param filterOptionId - The ID of the filter option to update.
 * @returns A new array of Filter objects with the updated options.
 */
export const updateFilterOptionsById = (filters: Filter[], filterOptionId: string) => {
  return filters.map((filter: Filter) => ({
    ...filter,
    data: filter.data.map((option: FilterOption) => {
      if (option.identifier === filterOptionId) {
        return { ...option, is_approved: false };
      }
      return option;
    }),
  }));
};


/**
 * Sort the legislations by name in ascending order.
 */
export const sortLegislationTabsData = (legTabs: LegislationTab[] = [], sortOrder: string):  LegislationTab[] => {
  return legTabs.map((tab: LegislationTab) => {
    return {
      ...tab,
      entries: tab.entries.toSorted((a: Legislation, b: Legislation) => {
        if (sortOrder === 'asc') {
          return a.name_local.localeCompare(b.name_local);
        }
        return b.name_local.localeCompare(a.name_local);
      }),
    };
  });
};

/**
 * Sort the legislation by relevance, last_updated, or created_at on the tabs.
 * @param legislations
 * @param sortOrder
 * @returns
 */
export const sortLegislationTabsByFilterKey = (legTabs: LegislationTab[] = [], filterValue: string): LegislationTab[] => {
  return legTabs.map((tab: LegislationTab) => {
    return {
      ...tab,
      entries: sortFilterBy(tab.entries, filterValue),
    };
  });
};

/**
 * Sort the navigator legislations by name in ascending order.
 */
export const sortNavigatorLegislationData = (legislations: NavigatorLegislation[], sortOrder: string): NavigatorLegislation[] => {
  return legislations.toSorted((a: NavigatorLegislation, b: NavigatorLegislation) => {
    if (sortOrder === 'asc') {
      return a.legislation.name_generic.localeCompare(b.legislation.name_generic);
    } else {
      return b.legislation.name_generic.localeCompare(a.legislation.name_generic);
    }
  });
};

/**
 * Sort the navigator legislations by relevance, last_updated, or created_at.
 * @param legislations
 * @param sortOrder
 * @returns
 */
export const sortNavigatorLegislationByFilterKey = (legislations: NavigatorLegislation[], filterValue: string): NavigatorLegislation[] => {
  return legislations.toSorted((a: NavigatorLegislation, b: NavigatorLegislation) => {
    if (filterValue === 'relevance') {
      return 0;
    }
    if (filterValue === 'last_updated') {

      return new Date(b.legislation.updated_at).getTime() - new Date(a.legislation.updated_at).getTime();
    }
    if (filterValue === 'created_date') {
      return new Date(b.legislation.created_at).getTime() - new Date(a.legislation.created_at).getTime();
    }
    return 0;
  });
}


/**
 * Sort the normal legislations by name in ascending order.
 */
export const sortLegislationsData = (legislations: Legislation[], sortOrder: string): Legislation[] => {
  return legislations.toSorted((a: Legislation, b: Legislation) => {
    if (sortOrder === 'asc') {
      return a.name_local.localeCompare(b.name_local);
    }
    return b.name_local.localeCompare(a.name_local);
  });
};

/**
 * Sort the legislations by relevance, last_updated, or created_at.
 */
export const sortFilterBy = (legislation: Legislation[], filterValue: string): Legislation[] => {
  return legislation.toSorted((a: Legislation, b: Legislation) => {
    if (filterValue === 'relevance') {
      return 0;
    }
    if (filterValue === 'last_updated') {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
    if (filterValue === 'created_date') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0;
  });
};

/**
 * Sort the legislations by name in ascending order.
 * @param list
 * @param filterValue
 * @returns
 */
export const sortConfigLegislation = (list: ConfigLegislation[], filterValue: string): ConfigLegislation[] => {
  return list.toSorted((a: ConfigLegislation, b: ConfigLegislation) => {
    if (filterValue === 'relevance') {
      return 0;
    }

    if (filterValue === 'last_updated') {
      return new Date(b.legislation.updated_at).getTime() - new Date(a.legislation.updated_at).getTime();
    }

    if (filterValue === 'created_date') {
      return new Date(b.legislation.created_at).getTime() - new Date(a.legislation.created_at).getTime();
    }

    return 0;
  });
};
