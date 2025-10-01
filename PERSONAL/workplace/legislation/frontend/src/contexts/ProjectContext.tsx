import { useContext, createContext, ComponentType } from 'react';
import { useParams } from 'react-router-dom';

import { useProject } from 'hooks';
import { ProjectState } from 'hooks/interfaces/project.interface';
import { ContextProps } from 'hooks/interfaces';
import { isError } from 'util';

const ProjectContext = createContext<ProjectState>({} as ProjectState);

const ProjectContextProvider = ({ children }: ContextProps) => {
  const project = useProject();

  const updatedProject = {
    ...project,
    stateDispatch: project.dispatch,
    stateActions: project.actions,
    isLoading: project.isLoading,
    isPending: project.isPending,
    isSuccess: project.isSuccess,
    isError: project.isError,
    canPublishProject: project.canPublishProject,
    canSendForApproval: project.canSendProjectLegislationsForApproval,
    updateProjectDetails: project.updateProjectDetails,
    requestApproval: project.requestProjectLegislationApproval,
    updateFilters: project.updateFilters,
  };

  return (
    <ProjectContext.Provider value={updatedProject}>
      {children}
    </ProjectContext.Provider>
  );
};

const useProjectContext = () => useContext(ProjectContext);

export { ProjectContextProvider };
export default useProjectContext;

function withProjectsHOC<T>(Component: React.ComponentType<T>) {
  return (props: React.PropsWithChildren<T>) => (
    <ProjectContextProvider>
      <Component {...props} />
    </ProjectContextProvider>
  );
}

export function withProjectHocs<T>(ChildComponent: ComponentType<T>) {
  const ComponentWithHocs = withProjectsHOC(ChildComponent);

  return (props: T) => {
    const params = useParams();

    return <ComponentWithHocs {...props} {...params} />;
  };
}
