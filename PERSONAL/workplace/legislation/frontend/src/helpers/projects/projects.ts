import { JOB_ROLE_KEY, JURISDICTION_KEY, PRODUCT_SERVICE_KEY, SCOPE_KEY, TOPIC_KEY, TYPE_KEY } from "configs/legislation/legislation";
import { getFilters, getIdentifiers, updateData } from "helpers/utils";
import { Legislation } from "hooks/interfaces";
import { Filter, FilterOption } from "hooks/interfaces/legislation.interface";


interface ProjectData {
  [key: string]: string;
}

interface GroupedResult {
  project_owner_list: string[];
  team_member_list: string[];
}

export function groupProjectIdentifiers(data: any): GroupedResult {
  const result: GroupedResult = {
    project_owner_list: [],
    team_member_list: []
  };

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (key.includes('project_owner_') && typeof value === 'string' && value.trim() !== '') {
        result.project_owner_list.push(value);
      }

      else if (key.includes('project_approver_') || key.includes('project_preparer_')) {
        if (!result.project_owner_list.includes(value)) {
          result.team_member_list.push(value);
        }
      }
    }
  }

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];

      if (key.includes('project_approver_') || key.includes('project_preparer_')) {
        if (!result.project_owner_list.includes(value)) {
          result.team_member_list.push(value);
        }
      }
    }
  }
  return result;
}

interface ProjectPayload {
  name: string;
  description: string;
  domain: string;
  starting_date: string;
  team_member_list?: string[];
  project_owner_list?: string[];
}

export const formatProjectPayload = (
  data: any,
) => {

  let payload: ProjectPayload = {
    name: data.name,
    description: data.description,
    domain: data.domain,
    starting_date: data.starting_date,
  };

  const members = groupProjectIdentifiers(data).team_member_list;
  const owners = groupProjectIdentifiers(data).project_owner_list;

  if (members.length === 0 || owners.length === 0) {
    payload = {
      name: data.name,
      description: data.description,
      domain: data.domain,
      starting_date: data.starting_date,
    };
  }

  if (owners.length > 0) {
    payload = { ...payload, project_owner_list: [...new Set(owners)] };
  }

  if (members.length > 0) {
    payload = { ...payload, team_member_list: [ ...new Set(members)] };
  }

  return payload;
};


/**
 * Remap team members to include groups if user belongs to no group for now
 * @param member
 * @returns
 */
export const remapTeamMember = (member: any) => {
  if (!member) return;

  return {
    ...member,
    groups: !member.groups.length ? ['preparer'] : member.groups,
  }
}


/**
 * Function to remove duplicates based on 'identifier'
 * @param array
 * @returns
 */
export const removeDuplicates = (array: any) => {
  if (!array) return [];

  const seen = new Set();
  const finalData = array.filter((item: any) => {
    const duplicate = seen.has(item?.identifier);
    seen.add(item?.identifier);
    return !duplicate;
  });
  return finalData;
}


/**
 * Formats and extracts all attributes from the data
 * @param data
 */
export const formatAndExtractAllAttributes = (legislations: Legislation[]) => {
  const extractAndRemoveDuplicates = (key: string) => {
    if (!key) return [];

    return removeDuplicates(
      legislations
        .flatMap((legislation) => (legislation as Legislation)[key as keyof Legislation] as any),
    );
  };

  return {
    type: { label: 'Legislation Type', data: extractAndRemoveDuplicates(TYPE_KEY) },
    topic: { label: 'Sustainability Topic', data: extractAndRemoveDuplicates(TOPIC_KEY).filter((i: any) => i.name !== 'All Topic') },
    job_role_list: { label: 'Job Roles', data: extractAndRemoveDuplicates(JOB_ROLE_KEY) },
    product_service: { label: 'Product or Service', data: extractAndRemoveDuplicates(PRODUCT_SERVICE_KEY) },
    geographical_scope: { label: 'Geographical Scope', data: extractAndRemoveDuplicates(SCOPE_KEY) },
    issuing_jurisdiction: { label: 'Issuing Jurisdiction', data: extractAndRemoveDuplicates(JURISDICTION_KEY) },
  };
};

export const formatFilterData = (filters: Filter[], key: string, IdentifierList: FilterOption[]) => {
  return updateData(getFilters(filters, key), getIdentifiers(IdentifierList))
};


export const formatConfigLegislation = (data: Legislation[], isSelecting: boolean) => {
  if (!data) return [];

  return data.map((legislation) => ({
    legislation,
    is_approved: false,
    is_selecting: isSelecting,
    approval_date: new Date().toISOString(),
    created_at: legislation.created_at,
  }));
};

export const formatProjectFilters = (filters: Filter[], activeFilters: string[]) => {
  // Make sure to map and turn only the filter in the data whose identifier is in the activeFilters
  return filters.map((filter) => ({
    ...filter,
    data: filter.data.map((data) => ({
      ...data,
      is_approved: activeFilters.includes(data.identifier),
    })),
  }));
};

/**
 * Generate the appropriate URL for the project
 * @param projectId
 * @param type
 * @param index
 * @returns
 */
export const composeProjectUrl = (projectId: string, type: "edit" | "details" = "details", index: number = 1) => {
  return `/projects/${projectId}/${type}/${index}`;
};


/**
 * Update the URL with the selected index.
 * @param index
 */
export const updateUrlWithIndex = (index: number, callBackFn: any) => {
  const currentUrl = window.location.pathname;
  const newUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/')) + `/${index}`;
  callBackFn(newUrl);
};
