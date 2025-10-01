import { UserProfile } from "hooks/interfaces";
import { Filter, Legislation } from "hooks/interfaces/legislation.interface";
import { ConfigLegislation } from "hooks/interfaces/project.interface";

export interface Client {
  identifier: string;
  client_external_member: [];
  client_team_member: [];
  email: string;
  first_name: string;
  groups: string[];
  initials: string;
  is_onboarded: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  job_roles: { identifier: string; name: string; }[];
  last_name: string;
  role: string;
  user_permissions: string[];
  username: string;
}

export interface Project {
  associated_legislations: Legislation[];
  client_member_list: Client[];
  created_at: string;
  description: string;
  domain: string;
  logo: string;
  identifier: string;
  is_published: boolean;
  legislation_count: number;
  name: string;
  team_member_list: Client[];
  project_owner_list: Client[];
  starting_date: string;
  updated_at: string;
}

export interface EditComponentProps {
  selectedIndex: number,
  project: Project;
  direction?: string
  filters?: Filter[];
}
export interface SelectedAttributes {
  [key: string]: { label: string, data: any[] },
  type: { label: string, data: any[] },
  topic: { label: string, data: any[] },
  issuing_jurisdiction: { label: string, data: any[] },
  geographical_scope: { label: string, data: any[] },
  job_role_list: { label: string, data: any[] },
  product_service: { label: string, data: any[] },
}

export interface LegislationTabs {
  label: string;
  entries: ConfigLegislation[];
  count: number;
}
