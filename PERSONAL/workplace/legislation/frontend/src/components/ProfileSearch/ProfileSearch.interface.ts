import { UserProfile } from "hooks/interfaces";

export interface ProfileSearchProps {
  // Define your props here
  label: string;
  subLabel: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  disabledEntries: UserProfile[],
  scrollOnFocus: boolean,
  onSelect: (profile: UserProfile) => void,
  [key: string]: any;
}
