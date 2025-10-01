import { AdminData, Legislation, ToastInterface, UserInterface } from "hooks/interfaces";
import { Filter } from "hooks/interfaces/legislation.interface";

export interface DragDropFileHandle {
  getLegislationData: () => any;
}

export interface EditHeaderProps {
  title?: string;
  content: string;
}

export interface FormData {
  [key: string]: any;
}

export interface RequirementField {
  groupName: string;
  name: string;
  label: string;
  subLabel: string;
  defaultValue: string;
  maxLength: number;
  rows: number;
  isTextArea: boolean;
}


export interface ExtendedLegislation extends Legislation {
  legislation_type: string;
}

export interface RequirementInterface {
  name: string;
  identifier: string;
  data_type: string;
  fields: RequirementField[];
}

export interface GeneralDetailsProps {
  data: Legislation;
  filters: Filter[];
  selectedIndex: number;
  onInputChange?: (name: string, value: string) => void;
  onNotApplicable?: (formValues: FormData) => void;
  [key: string]: any;
}

export interface RequirementsProps {
  data: Legislation;
  filters: Filter[];
  selectedIndex: number;
  isEditing: boolean;
  setMissingFields: (arr: string[]) => void;
  onNotApplicable?: (formValues: FormData) => void;
  [key: string]: any;
}


export interface RoleSpecificProps {
  // props here
  data: Legislation;
  filters: Filter[];
  user: UserInterface;
  selectedIndex: number;
  showToast: (toast: ToastInterface) => void;
  [key: string]: any;
  onInputChange?: (name: string, value: string) => void;
}

export interface EditProps {
  isEditing: boolean;
  user: UserInterface;
  legislation: Legislation;
  filters: Filter[];
  editingType: "default" | "details" | "project"
  setIsEditing: (val: boolean) => void;
  [key: string]: any;
}

export interface JobRoleContent {
  example: string;
  job_role: string;
  legislation: string;
  what: string;
  why: string;
}

export interface RequirementGroup {
  key: string;
  data: any[];
  fields: any[];
  name: string;
  is_new_requirement: boolean;
}
export interface Requirement {
  id: number;
  identifier: string;
  created_at: string;
  updated_at: string;
  description: string;
  responsible_authority: string;
  trigger: string;
  responsible_party: string;
  data_elements: string;
  payment_obligations: string;
  key_actions: string;
  deadline: string;
  threshold: string;
  sanctions: string;
  exemptions: string;
}
