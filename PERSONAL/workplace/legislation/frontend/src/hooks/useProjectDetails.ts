import { useState } from "react";
import { useParams } from "react-router-dom";

import useQueryApi from "./useQueryApi";

import { GET_CLIENT_PROJECT_DETAILS } from "configs/api-endpoints";

const useProjectDetails = () => {
  const { projectId } = useParams();

  const [project, setProject] = useState<any>(null);

  const { get: getProjectDetails } = useQueryApi({
    ...GET_CLIENT_PROJECT_DETAILS,
    endpoint: `${GET_CLIENT_PROJECT_DETAILS.endpoint}${projectId}/`,
  });

  const { data: projectData, error: projectError, isLoading: isProjectDetailsLoading } = getProjectDetails(null);


  return {
    project,
  }
};
