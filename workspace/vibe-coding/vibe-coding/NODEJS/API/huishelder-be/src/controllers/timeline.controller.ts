import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { JourneyService } from '@/services/journey.service';
import { apiResponse } from '@/utils/responseFormatter';
import { TimelineStepUpdateRequestDto } from '@/dtos/timeline.dto';
import { OnboardingService } from '@/services/onboarding.service';

export class TimelineController {
  private journeyService = new JourneyService();
  private onboardingService = new OnboardingService();

  /**
   * Generate timeline for a user based on onboarding data
   */
  public generateTimeline = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      let onboardingData = req.body.onboardingData;

      // If onboarding data wasn't provided in the request, fetch it
      if (!onboardingData) {
        const onboardingResponse = await this.onboardingService.getOnboardingData(userId);

        if (!onboardingResponse.onboarding_completed) {
          apiResponse.badRequest(res, 'Onboarding data is required but user has not completed onboarding');
          return;
        }

        onboardingData = onboardingResponse.onboarding_data;
      }

      const timeline = await this.journeyService.generateUserTimeline(userId, onboardingData);

      apiResponse.created(res, 'Timeline generated successfully', timeline);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get enhanced timeline with filters
   */
  public getEnhancedTimeline = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const filters = {
        status: req.query.status as string,
        category: req.query.category as string,
        sort: req.query.sort as string,
      };

      const timeline = await this.journeyService.getEnhancedTimeline(userId, filters);

      apiResponse.success(res, 'Enhanced timeline retrieved successfully', timeline);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a timeline step
   */
  public updateTimelineStep = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const stepId = req.params.stepId;
      const updateData: TimelineStepUpdateRequestDto = req.body;

      const updatedStep = await this.journeyService.updateTimelineStep(userId, stepId, updateData);

      apiResponse.success(res, 'Timeline step updated successfully', updatedStep);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get timeline progress summary
   */
  public getTimelineProgress = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const progressSummary = await this.journeyService.getTimelineProgress(userId);

      apiResponse.success(res, 'Timeline progress retrieved successfully', progressSummary);
    } catch (error) {
      next(error);
    }
  };
}
