import { PATH_LEGISLATION } from "configs/paths";
import { COMPLIANCE_CONSEQUENCE_KEY, JOB_ROLE_KEY, JURISDICTION_KEY, PRODUCT_SERVICE_KEY, REQUIREMENT_TYPES, REQUIREMENTS, SCOPE_KEY, SELECT_ALL_FILTER_KEY, TOPIC_KEY, TYPE_KEY } from "configs/legislation/legislation";

import {
  Filter,
  FilterOption,
  JobRole,
  NavigatorJobRole,
  RoleSpecificData,
} from "hooks/interfaces/legislation.interface";
import { Legislation } from "hooks/interfaces";
import { stripTrailingNumbers } from "helpers/utils";
import { RequirementInterface } from "pages/Legislation/Admin/EditContent/TabPages/interfaces";


/**
 * Formats role-specific data for a job role.
 * @param jobRole - The job role object.
 * @param results - The array of job role response data.
 * @returns The formatted role-specific data.
 */
export const formatRoleSpecificData = (jobRole: RoleSpecificData, results: NavigatorJobRole[]) => {
  const roleData = results
    ?.filter((r: NavigatorJobRole) => (r.job_role_list)
    ?.some((r) => r.identifier === jobRole.identifier)) || {};

  const notes = [...new Set(roleData.map((r: NavigatorJobRole) => r.note))];


  return {
    identifier: jobRole.identifier,
    title: `Why is this legislation relevant for ${jobRole.label}?`,
    name: jobRole.name,
    data: {
      notes: notes,
      job_role_list: roleData.map((r: NavigatorJobRole) => r.job_role_list),
    },
    details: [
      {
        title: !notes.length ? `No attention point available for <strong>${jobRole.label}</strong>.` : `Attention point relevant for <strong>${jobRole.label}</strong>.`,
        content: roleData?.[0]?.note,
        notes: notes,
      },
    ],
  };
};

/**
 * Compose legislation details url for a specific legislation.
 */
export const composeLegislationDetailsUrl = (legislationId: string) => `${PATH_LEGISLATION}/all/${legislationId}/1`;


/**
 * Compose Sustainability Legislation Navigator payload for filtered role specific list of legislations.
 */
export const composeLegislationNavigatorPayload = (filters: Filter[], roles: JobRole[]) => {
  const approvedFilters = filters.filter((_f) => _f.data.some(o => o.is_approved));
  const activeFilters = approvedFilters.map((f) => {
    return {
      [`${f.label}`]: f.data.filter(o => o.is_approved)
    }
  }).filter(Boolean);

  const transformedData = (data: any) => {
    return data.map((item: any) => {
      const key = Object.keys(item)[0];

      if (key === "status") {
        return {
          status: item.status?.map((statusItem: Filter) => statusItem.label.toUpperCase())[0],
        };
      } if (key === 'effective_year') {
        return {
          effective_year: item.effective_year?.map((year: Filter) => year.label) || [],
        };
      } else {
        return {
          [key]: item[key]?.map((element: RoleData) => element.identifier),
        };
      }
    });
  };

  const jobRoles = activeFilters.find(item => Object.keys(item).at(0) === JOB_ROLE_KEY);

  if (activeFilters?.length && !(jobRoles as any)?.job_role_list?.length) {
    return {
      selectors: { ...transformedData(activeFilters.filter(item => Object.keys(item).at(0) !== JOB_ROLE_KEY)) },
      job_role_list: [],
    }
  }

  return {
    selectors: { ...transformedData(activeFilters.filter(item => Object.keys(item).at(0) !== JOB_ROLE_KEY)) },
    job_role_list: (jobRoles as any)?.job_role_list?.map((r: JobRole) => r.identifier) || roles.map((r) => r.identifier).filter((i) => !i.includes(SELECT_ALL_FILTER_KEY)),
  };
};


/**
 * Handle sort change.
 */
export const handleSortFn = (e: any, page: string, fn: (p: string, or: string) => void) => {
  const target = e.target.closest('button') as HTMLElement;
  const sortValue = target.dataset.sortValue || 'asc';
  fn(page, sortValue);
};

/**
 * Remove the keys that are not needed
 * @param data
 * @param keys
 * @returns
 */
const removeKeys = (data: any, keys: string[]) => {
  return Object.entries(data)
    .filter(([k]) => !keys.some(key => k.startsWith(key)))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
};

/**
 * Group the data by the key
 * @param data
 * @returns
 */
const groupData = (data: any) => {
  const groupByPrefixAndIndex = (data: { [key: string]: any }, prefix: string) => {
    const grouped: { [key: string]: any } = {};

    // Filter and group data by the number at the end of the keys
    Object.keys(data).forEach(key => {
      if (key.startsWith(prefix)) {
        const index = key.match(/-(\d+)$/)?.[1];
        if (index !== undefined) {
          if (!grouped[index]) {
            grouped[index] = {};
          }
          const newKey = key.replace(`${prefix}`, '').replace(`-${index}`, '');
          grouped[index][newKey] = data[key] === 'not_applicable' ? 'N/A' : data[key];
        }
      }
    });

    return Object.values(grouped).map(({ identifier, ...rest}) => {
      if (identifier === 'undefined') {
        return rest;
      }

      return { ...rest, identifier };
    }) || [];
  };

  const groupedData = {
    issuing_jurisdiction: data[JURISDICTION_KEY] || [],
    topic: data[TOPIC_KEY] || [],
    type: data[TYPE_KEY] || [],
    geographical_scope: data[SCOPE_KEY] || [],
    non_compliance_consequence: data[COMPLIANCE_CONSEQUENCE_KEY] || [],
    product_service: data[PRODUCT_SERVICE_KEY] || [],
    job_role_list: data[JOB_ROLE_KEY] || [],
    // pwc_contact: [data.pwc_contact],
  };

  REQUIREMENT_TYPES.forEach(req => {
    (groupedData as any)[req.key] = groupByPrefixAndIndex(
      data,
      req.prefix
    )?.filter((item) => {
      if (item.identifier && item.identifier.includes('requirement')) {
        delete item.identifier;
      }
      return Object.keys(item).every((k) => item[k] !== undefined && item[k] !== '');
    });
  });

  return groupedData;
};

/**
 * Remove all empty data
 * @param data
 * @returns
 */
const removeEmptyData = (data: any) => {
  const isEmpty = (value: string): boolean => {
    if (Array.isArray(value)) {
        return value.length === 0 || value.every(item => isEmpty(item));
    } else if (typeof value === 'object' && value !== null) {
        return Object.keys(value).length === 0;
    }
    return false;
  };

  const cleanData = {};
  for (const key in data) {
    if (!isEmpty(data[key])) {
      (cleanData as any)[key] = data[key];
    }
  }
  return cleanData;
}


/**
 * format the formValues to be sent to the API
 * @param data
 * @returns
 */
interface RoleData {
  name: string;
  identifier: string;
}
type FormatPayloadInterface = {
  data: any;
  legislation: Legislation;
  jobRoles: RoleData[];
}
type AttentionPoints = {
  identifier: string;
  note: string;
  job_role_list: RoleData[];
}
  // remove the keys that are not needed
const keysToRemove = [ 'issuing_jurisdiction_country_', 'product_service_data_', 'non_compliance_consequence_data_',
  'geographical_scope_data_', 'topic_data_', 'type_data_', 'pwc_contact', 'effective_until_toggle',
  'registration_requirements_', 'regulatory_requirements_', 'reporting_requirements_', 'roles_data_',
  'what_', 'why_', 'example_', 'non_consequence_data_consequence_', 'roles_data_', 'note', 'attention_point', 'job_role_list_data_'
];
export const formatPayload = ({ data = {}, legislation, jobRoles }: FormatPayloadInterface) => {

  /**
   * Group the job role data
   * @returns
   */
  const groupJobRoleData = () => {
    const groupedData: { [key: string]: any} = {};

    Object.keys(data).forEach(key => {
      if (key.startsWith("attention_point")) {
        const match = key.match(/attention_point-(\d+)/);
        if (match) {
          const groupNumber = match[1];
          if (!groupedData[groupNumber]) {
            groupedData[groupNumber] = { job_role_list: [], legislation: legislation.identifier, identifier: '' }; // Initialize an array for 'job_role_list'
          }

          const cleanKey = key.replace(`attention_point-${groupNumber}_`, '');

          if (cleanKey === `attention_point-${groupNumber}`) {
            groupedData[groupNumber]['note'] = data[key];
          } else if (cleanKey.includes('identifier')) {
            const identifier = data[key];
            groupedData[groupNumber]['identifier'] = identifier;
          } else if (cleanKey.startsWith('data_')) {
            groupedData[groupNumber][JOB_ROLE_KEY].push(data[key]);
          } else {
            groupedData[groupNumber][cleanKey] = data[key];
          }
        }
      }
    });

    return Object.keys(groupedData).map(key => groupedData[key]);
  }

  /**
   * Map the job roles to the data and get the job role identifier
   */
  const mapJobRoles = (data: any, jobRoles: RoleData[], attentionPoints: AttentionPoints[]) => {
    const roleMap = jobRoles.reduce((acc, role) => {
      (acc as any)[role.name] = role.identifier;
      return acc;
    }, {});

    return data.map((item: any) => {
      if (item.identifier !== 'undefined') {
        return {
          ...item,
          job_role_list: item.job_role_list.map((role: string) => (roleMap as any)[role]).filter(Boolean),
          identifier: item.identifier,
        };
      } else {
        const { identifier, ...rest } = item;
        return {
          ...rest,
          job_role_list: item.job_role_list.map((role: string) => (roleMap as any)[role]).filter(Boolean),
        };
      }
    });
  }

  const finalData: { [key: string]: any } = {...removeEmptyData({ ...removeKeys(data, keysToRemove), ...groupData(data)}) };

  return {
    legislation_requirements: finalData,
    job_roles: mapJobRoles(groupJobRoleData(), jobRoles, legislation.attention_point_list),
  };
};


/**
 * Format legislation data for easier consumption.
 */
const EFFECTIVE_YEAR = 'Effective year';
const STATUS = 'Status';
export const formatFilterData = (filter: Filter) => {
  if ([EFFECTIVE_YEAR, STATUS].includes(filter.name)) {
    return {
      ...filter,
      data: filter.data.map((d) => ({
        identifier: `identifier-${d}-${filter.name}`,
        name: `${d}`.toLowerCase(),
        label: `${d}`.toLowerCase(),
        is_approved: d.is_approved ?? false,
      }))
    }
  } else {
    return {
      ...filter,
      data: filter.data.map((option: FilterOption) => ({
        ...option,
        label: option.name,
        is_approved: option.is_approved ?? false,
      })),
    }
  }
};

export const formatFilters = (filters: Filter[] = [], permission:string = '', roles: string[] = []) => {
  return filters
    ?.map((r: Filter) => formatFilterData(r))
    ?.map((_r) => permission === 'others'
      ? { ..._r, data: _r.data.map((d) => roles.includes(d.identifier) ? { ...d, is_approved: true } : d) }
      : { ..._r })
    .map((f) => {
      return {
        ...f,
        data: [
          { name: `All`, label: `All`, identifier: `select-all-${f.name}`, is_approved: false },
          ...f.data.toSorted((a, b) => a.name.localeCompare(b.name)),
        ],
      }
    })
};

export const formatLegislation = (legislations: Legislation[] = []) => {
  return legislations.map((leg) => ({
    ...leg,
  }));
};

type NewAttentionPoint = {
  name: string;
  identifier: string;
  data_type: string;
  is_new_requirement: boolean;
}

interface RequirementGroup {
  key: string;
  data: any[];
  fields: any[];
  name: string;
  is_new_requirement: boolean;
}

/**
 * Function to create a new Requirement when the add new button is clicked
 * @param role
 * @param index
 * @returns
 */
export const createNewRequirement = (role: any, index: number):
RequirementGroup & { identifier: string } | null => {
  if (!role) return null;

  const data = REQUIREMENTS.find((r) => r.name === stripTrailingNumbers(role.name));

  return {
    ...data,
    ...role,
    data: [],
    name: `${data?.name ?? ''} ${index + 1}`,
    identifier: `${role.key}_${index + 1}`,
    data_type: `${data?.data_type ?? ''}_${index + 1}`,
    is_new_requirement: true,
  }
};


/**
 * Handles reformatting the attention point data
 */
export const NOTE_KEY = 'note';
export const IDENTIFIER_KEY = 'identifier';
export const formatAttentionPointData = (data: any) => {
  const remappedData: { [key: string]: any } = {};

  for (const key in data) {
    if (key.includes(NOTE_KEY)) {
      remappedData[NOTE_KEY] = data[key];
    }

    if (key.includes(IDENTIFIER_KEY) && data[key] !== 'undefined') {
      remappedData[IDENTIFIER_KEY] = data[key]
    }
  }

  return remappedData
}


/**
 * Format the Job role data
 * @param element
 * @param attentionPointKey
 * @returns
 */
export const getAllJobRoles = (attentionPointKey: string, legislation: Legislation) => {
  const note = (document?.querySelector(`textarea[name^="${attentionPointKey}"]`) as HTMLTextAreaElement)?.value;
  const identifier = (document.getElementById(attentionPointKey)
    ?.querySelector(`input[name="${attentionPointKey}_data_identifier"`) as HTMLInputElement)?.value;
  const job_role_list = Array.from(document?.querySelector(`ul[data-attention-identifier="${attentionPointKey}"]`)
    ?.querySelectorAll('button[data-selected="true"]') || [])
    ?.map((el) => el.closest('li')?.dataset.identifier) || [];

  if (identifier?.includes(IDENTIFIER_KEY) || !identifier || identifier === 'undefined') {
    return { job_role_list, note, legislation: legislation.identifier }
  }

  return { identifier, job_role_list, note, legislation: legislation.identifier };
};
