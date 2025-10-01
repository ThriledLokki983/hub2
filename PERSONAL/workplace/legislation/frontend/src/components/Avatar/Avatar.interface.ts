import { UserInterface, UserProfile  } from "hooks/interfaces"

export interface AvatarProps {
  // Define your props here
  userData: UserInterface | UserProfile,
  onClickHandler: () => void,
  [key: string]: any
}
