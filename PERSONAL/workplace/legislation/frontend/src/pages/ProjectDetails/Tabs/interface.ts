import { Filter } from "hooks/interfaces/legislation.interface";
import { Project } from "hooks/interfaces/project.interface";

export interface EditComponentProps {
  selectedIndex: number,
  project: Project;
  direction?: string
  filters?: Filter[];
}
