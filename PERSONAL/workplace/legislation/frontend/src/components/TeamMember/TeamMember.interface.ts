import { UserProfile } from "hooks/interfaces";
import { Client } from "pages/ProjectEdit/Tabs/interfaces";
import { Key } from "react-aria-components";

export interface TeamMemberProps {
  // Define your props here
  data: Client;
  query: string;
  disabled: boolean;
  options: string[];
  type?: 'create' | 'details';
  onSelect: (role: Key, member: Client) => void;
  onRemove: (user: UserProfile) => void;
}
