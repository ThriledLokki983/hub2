import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { JourneyService } from '@/services/journey.service';
import { JourneyInitRequestDto, CompleteTaskDto, FinancialSummaryRequestDto } from '@/dtos/journey.dto';
import { GenerateTimelineRequestDto, TimelineFiltersDto, TimelineStepUpdateRequestDto } from '@/dtos/timeline.dto';
import { apiResponse } from '@/utils/responseFormatter';
import { OnboardingService } from '@/services/onboarding.service';

export class JourneyController {
  private journeyService = new JourneyService();

  /**
   * Create or update a user's journey after onboarding
   */
  public initJourney = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const journeyData: JourneyInitRequestDto = req.body;
      const result = await this.journeyService.initJourney(userId, journeyData);

      apiResponse.success(res, 'Journey initialized successfully', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user's journey timeline
   */
  public getTimeline = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const timeline = await this.journeyService.getJourneyTimeline(userId);

      apiResponse.success(res, 'Journey timeline retrieved successfully', timeline);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user's journey tasks
   */
  public getTasks = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const tasks = await this.journeyService.getJourneyTasks(userId);

      apiResponse.success(res, 'Journey tasks retrieved successfully', tasks);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mark a task as complete
   */
  public completeTask = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(taskId)) {
        apiResponse.badRequest(res, 'Invalid task ID format. Must be a valid UUID.');
        return;
      }

      await this.journeyService.completeTask(userId, taskId);

      apiResponse.success(res, 'Task marked as complete', null);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Upload a document
   */
  public uploadDocument = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const file = req.file;

      if (!file) {
        apiResponse.badRequest(res, 'No file uploaded');
        return;
      }

      const documentType = req.body.type || 'generic';
      const result = await this.journeyService.uploadDocument(userId, file, documentType);

      apiResponse.success(res, 'Document uploaded successfully', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get financial summary
   */
  public getFinancialSummary = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const financialSummary = await this.journeyService.getFinancialSummary(userId);

      apiResponse.success(res, 'Financial summary retrieved successfully', financialSummary);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update financial summary
   */
  public updateFinancialSummary = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const financialData: FinancialSummaryRequestDto = req.body;
      const result = await this.journeyService.updateFinancialSummary(userId, financialData);

      apiResponse.success(res, 'Financial summary updated successfully', result);
    } catch (error) {
      next(error);
    }
  };
}
