import { Legislation, UserInterface } from "hooks/interfaces";
import { NavigatorLegislation } from "hooks/interfaces/navigator.interface";
import { ExtendedLegislation } from "pages/Legislation/Admin/EditContent/TabPages/interfaces";

export interface LegislationCardProps {
  // Define your props here
  legislation: ExtendedLegislation | Legislation | NavigatorLegislation;
  user: UserInterface;
  isListCard?: boolean;
  isActive?: boolean;
  query?: string;
  isEditing?: boolean;
  seCurrentLegislation?: () => void;
  onEdit?: (e: any, id: string) => void;
  onEditButtonClick?: (e: any, id: string) => void;
  [key: string]: any;
}
