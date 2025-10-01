import { useState, useMemo } from 'react';
import axios from 'axios';
import { useQueryApi, useMutationApi } from './useQueryApi';
import {
  GET_JOURNEY_TIMELINE,
  COMPLETE_JOURNEY_TASK,
  GET_FINANCIAL_SUMMARY,
  UPLOAD_DOCUMENT,
  GET_DOCUMENTS,
  JOURNEY_TIMELINE_ENHANCED,
  UPDATE_TIMELINE_STEP_ENHANCED,
} from '../configs/journey-endpoints';
import {
  JourneyResponse,
  Milestone,
  Task,
  FinancialSummary,
  Document,
  TaskStatus,
  TaskCompletionResponse,
  DocumentUploadResponse,
  ApiTimelineResponse,
  ApiTimelineItem,
  ApiTask,
  ApiFinancialSummaryResponse,
} from './interfaces/journey';

/**
 * Maps API task status to frontend task status
 */
const mapTaskStatus = (apiStatus: string): TaskStatus => {
  // Convert to uppercase and handle different variations of completed status
  const status = apiStatus.toUpperCase();

  // Handle different variations of "complete" status
  if (
    status === 'COMPLETE' ||
    status === 'DONE' ||
    status === 'COMPLETED' ||
    status === 'FINISHED'
  ) {
    return 'done';
  }

  // Handle "in progress" status
  if (status === 'IN_PROGRESS' || status === 'ONGOING' || status === 'IN-PROGRESS') {
    return 'in_progress';
  }

  // Default to pending for any other status
  return 'pending';
};

/**
 * Maps a milestone status based on its completion and tasks
 */
const determineMilestoneStatus = (
  milestone: ApiTimelineItem,
): 'completed' | 'in_progress' | 'not_started' => {
  if (milestone.is_complete) return 'completed';
  if (
    milestone.tasks.some(
      task =>
        task.status.toUpperCase() === 'IN_PROGRESS' ||
        task.status.toUpperCase() === 'COMPLETE' ||
        task.status.toUpperCase() === 'DONE' ||
        task.status.toUpperCase() === 'PENDING',
    )
  ) {
    return 'in_progress';
  }
  return 'not_started';
};

// Default financial summary for when it's not available from the API
const defaultFinancialSummary: FinancialSummary = {
  estimatedMortgage: 0,
  monthlyGrossCost: 0,
  monthlyNetCost: 0,
  additionalCosts: {},
  currency: 'EUR',
};

/**
 * Transforms API financial summary to app format
 */
const transformFinancialSummary = (apiResponse: ApiFinancialSummaryResponse): FinancialSummary => {
  const apiData = apiResponse.data;
  return {
    estimatedMortgage: Number(apiData.estimated_mortgage) || 0,
    monthlyGrossCost: Number(apiData.monthly_gross) || 0,
    monthlyNetCost: Number(apiData.monthly_net) || 0,
    ...(apiData.bridge_loan_needed != null && Number(apiData.bridge_loan_needed) > 0
      ? { bridgeLoan: Number(apiData.bridge_loan_needed) }
      : {}),
    ...(apiData.estimated_boeterente != null && Number(apiData.estimated_boeterente) > 0
      ? { boeterente: Number(apiData.estimated_boeterente) }
      : {}),
    additionalCosts: Object.entries(apiData.additional_costs || {}).reduce(
      (acc, [key, value]) => {
        if (value != null && Number(value) > 0) {
          acc[key] = Number(value);
        }
        return acc;
      },
      {} as Record<string, number>,
    ),
    currency: 'EUR',
  };
};

/**
 * Custom hook for managing the user's home journey data and interactions
 */
export function useJourney() {
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Use real API call for timeline data with caching
  const timelineQuery = useQueryApi<ApiTimelineResponse>(GET_JOURNEY_TIMELINE, null, {
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
    refetchOnMount: false, // Only fetch on first mount
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  // Fetch documents separately - but only if the endpoint exists
  // Skip this if we're getting 404s by using a feature flag
  const FETCH_DOCUMENTS = import.meta.env.VITE_FETCH_DOCUMENTS !== 'false';
  const documentsQuery = useQueryApi<{ documents: Document[] }>(GET_DOCUMENTS, null, {
    enabled: FETCH_DOCUMENTS,
    retry: false, // Don't retry if it fails
    silent: true, // Don't show errors for this endpoint
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Fetch financial summary separately with caching
  const financialSummaryQuery = useQueryApi<ApiFinancialSummaryResponse>(
    GET_FINANCIAL_SUMMARY,
    null,
    {
      staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
      cacheTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  // Real API implementation for completing tasks
  const completeTaskMutation = useMutationApi<TaskCompletionResponse>(COMPLETE_JOURNEY_TASK(''), {
    onSuccess: () => timelineQuery.refetch(),
  });

  // Real API implementation for uploading documents
  const uploadDocumentMutation = useMutationApi<DocumentUploadResponse>(UPLOAD_DOCUMENT);

  // Transform API timeline data to frontend model
  const transformedData = useMemo(() => {
    // Extract the API response data, taking into account the nested structure
    const apiTimelineData = timelineQuery.data?.data?.data;

    if (!apiTimelineData) return undefined;

    // Map API milestones to frontend milestones
    const timeline: Milestone[] = (Array.isArray(apiTimelineData) ? apiTimelineData : []).map(
      (item: ApiTimelineItem) => {
        // Map tasks
        const tasks: Task[] = item.tasks.map((apiTask: ApiTask) => ({
          id: apiTask.id,
          title: apiTask.title,
          description: '', // Not provided in API, could be fetched separately if needed
          status: mapTaskStatus(apiTask.status),
          milestoneId: item.milestone_id,
          dueDate: undefined, // Not provided in API, could be fetched separately
          relatedDocuments: apiTask.related_document_id
            ? ([{ id: apiTask.related_document_id }] as Document[])
            : undefined,
        }));

        // Create the milestone
        return {
          id: item.milestone_id,
          title: item.milestone.name,
          description: item.milestone.description,
          dueDate: item.due_date || undefined,
          status: determineMilestoneStatus(item),
          order: item.milestone.order_index,
          tasks,
          isCurrentMilestone: false, // Will be set later
        };
      },
    );

    // Sort timeline by order
    timeline.sort((a, b) => a.order - b.order);

    // Find the current milestone
    const currentMilestoneIndex = timeline.findIndex(m => m.status === 'in_progress');
    const currentMilestone =
      currentMilestoneIndex >= 0
        ? timeline[currentMilestoneIndex]
        : timeline.find(m => m.status === 'not_started') || timeline[0];

    // Mark the current milestone
    if (currentMilestone) {
      currentMilestone.isCurrentMilestone = true;
    }

    // Get all tasks from all milestones
    const allTasks = timeline.flatMap(m => m.tasks);

    // Upcoming tasks are pending or in_progress, sorted by milestone order
    const upcomingTasks = allTasks.filter(task => task.status !== 'done').slice(0, 5);

    // Extract financial summary data, with safe fallback
    let financialSummary = defaultFinancialSummary;
    if (financialSummaryQuery.data?.data?.data) {
      try {
        const apiData = financialSummaryQuery.data.data.data;
        financialSummary = {
          estimatedMortgage: Number(apiData.estimated_mortgage) || 0,
          monthlyGrossCost: Number(apiData.monthly_gross) || 0,
          monthlyNetCost: Number(apiData.monthly_net) || 0,
          ...(apiData.bridge_loan_needed != null && Number(apiData.bridge_loan_needed) > 0
            ? { bridgeLoan: Number(apiData.bridge_loan_needed) }
            : {}),
          ...(apiData.estimated_boeterente != null && Number(apiData.estimated_boeterente) > 0
            ? { boeterente: Number(apiData.estimated_boeterente) }
            : {}),
          additionalCosts: Object.entries(apiData.additional_costs || {}).reduce(
            (acc, [key, value]) => {
              if (value != null && Number(value) > 0) {
                acc[key] = Number(value);
              }
              return acc;
            },
            {} as Record<string, number>,
          ),
          currency: 'EUR',
        };
      } catch (err) {
        console.warn('Error parsing financial summary data:', err);
      }
    }

    // Extract document data safely
    let requiredDocuments: Document[] = [];
    if (FETCH_DOCUMENTS && documentsQuery.data?.data?.data) {
      try {
        // Safely access the nested data
        const nestedData = documentsQuery.data.data.data as unknown as { documents?: Document[] };
        if (nestedData && nestedData.documents && Array.isArray(nestedData.documents)) {
          requiredDocuments = nestedData.documents;
        }
      } catch (err) {
        console.warn('Error parsing document data:', err);
        // Use empty array as fallback
      }
    }

    const journeyResponse: JourneyResponse = {
      user: {
        id: 'current-user', // This might need to come from user context
        firstName: '',
        lastName: '',
        email: '',
        isFirstTimeHomebuyer: true,
        isSellingCurrentHome: false,
      },
      timeline,
      currentMilestone,
      upcomingTasks,
      financialSummary,
      requiredDocuments,
    };

    return journeyResponse;
  }, [timelineQuery.data, documentsQuery.data, financialSummaryQuery.data, FETCH_DOCUMENTS]);

  // Helper function to mark a task as complete
  const markTaskComplete = async (taskId: string): Promise<TaskCompletionResponse | undefined> => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/journey/tasks/${taskId}/complete`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );

      console.log('Completed task:', response);

      // Refresh the timeline data to get the updated task status
      timelineQuery.refetch();

      if (response?.data) {
        return response.data as unknown as TaskCompletionResponse;
      }
      return undefined;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error completing task:', error.message);
      } else {
        console.error('Unknown error completing task');
      }
      return undefined;
    }
  };

  // Helper function to upload a document
  const uploadDocument = async (
    file: File,
    _taskId?: string, // Keep parameter for backward compatibility but mark as unused
    _milestoneId?: string, // Keep parameter for backward compatibility but mark as unused
  ): Promise<DocumentUploadResponse | undefined> => {
    try {
      // Create form data for the file upload
      const formData = new FormData();
      formData.append('file', file);

      // Determine document type based on file extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      let documentType = 'document'; // default type

      if (fileExtension) {
        switch (fileExtension) {
          case 'pdf':
            documentType = 'pdf';
            break;
          case 'doc':
          case 'docx':
            documentType = 'document';
            break;
          case 'jpg':
          case 'jpeg':
          case 'png':
            documentType = 'image';
            break;
          default:
            documentType = 'other';
        }
      }

      formData.append('type', documentType);
      setUploadProgress(0);

      // Send the FormData directly without type casting
      const response = await uploadDocumentMutation.mutateAsync(formData);
      setUploadProgress(100);

      // Refresh data after a successful upload
      if (FETCH_DOCUMENTS) {
        documentsQuery.refetch();
      }
      timelineQuery.refetch();

      if (response?.data?.data) {
        return response.data.data as unknown as DocumentUploadResponse;
      } else {
        console.warn('Document upload response was missing expected data');
        return undefined;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error uploading document:', error.message);
      } else {
        console.error('Unknown error uploading document');
      }
      setUploadProgress(0);
      return undefined;
    }
  };

  // Loading and error states
  const isLoading =
    timelineQuery.isLoading ||
    (FETCH_DOCUMENTS && documentsQuery.isLoading) ||
    financialSummaryQuery.isLoading;

  const errors = [
    ...(timelineQuery.error ? [timelineQuery.error] : []),
    ...(FETCH_DOCUMENTS && documentsQuery.error ? [documentsQuery.error] : []),
    ...(financialSummaryQuery.error ? [financialSummaryQuery.error] : []),
  ];

  const hasErrors = errors.length > 0;

  // Function to refresh all journey data
  const refreshJourneyData = () => {
    timelineQuery.refetch();
    if (FETCH_DOCUMENTS) {
      documentsQuery.refetch();
    }
    financialSummaryQuery.refetch();
  };

  // Enhanced timeline query
  const enhancedTimelineQuery = useQueryApi(JOURNEY_TIMELINE_ENHANCED, null, {
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Mutation for updating enhanced timeline steps
  const updateTimelineStepMutation = useMutationApi(UPDATE_TIMELINE_STEP_ENHANCED, {
    onSuccess: () => {
      enhancedTimelineQuery.refetch();
    },
  });

  return {
    // Basic status
    isLoading,
    hasErrors,
    errors,
    uploadProgress,

    // Data
    journey: transformedData,
    timeline: transformedData?.timeline || [],
    currentMilestone: transformedData?.currentMilestone,
    upcomingTasks: transformedData?.upcomingTasks || [],
    financialSummary: transformedData?.financialSummary || defaultFinancialSummary,
    documents: transformedData?.requiredDocuments || [],
    requiredDocuments: transformedData?.requiredDocuments || [],

    // Task operations
    markTaskComplete,

    // Document operations
    uploadDocument,

    // Refresh data
    refreshJourneyData,

    // Enhanced timeline
    enhancedTimeline: {
      data: enhancedTimelineQuery.data?.data,
      isLoading: enhancedTimelineQuery.isLoading,
      error: enhancedTimelineQuery.error,
      refetch: enhancedTimelineQuery.refetch,
      updateStep: updateTimelineStepMutation.mutate,
      isUpdating: updateTimelineStepMutation.isPending,
      updateError: updateTimelineStepMutation.error,
    },

    // Raw queries for more control
    queries: {
      timelineQuery,
      documentsQuery,
      financialSummaryQuery,
      enhancedTimelineQuery,
    },
    mutations: {
      completeTaskMutation,
      uploadDocumentMutation,
      updateTimelineStepMutation,
    },
  };
}

export default useJourney;
