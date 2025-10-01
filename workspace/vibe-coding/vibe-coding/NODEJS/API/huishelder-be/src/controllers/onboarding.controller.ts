import { NextFunction, Response } from 'express';
import { OnboardingDto } from '@/dtos/onboarding.dto';
import { OnboardingService } from '@/services/onboarding.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { apiResponse } from '@/utils/responseFormatter';

export class OnboardingController {
  private onboardingService = new OnboardingService();

  /**
   * Get user's onboarding data
   */
  public getUserOnboarding = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const onboardingData = await this.onboardingService.getUserOnboarding(userId);

      apiResponse.success(res, 'Onboarding data retrieved successfully', onboardingData);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Save user's onboarding data
   */
  public saveUserOnboarding = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const onboardingData: OnboardingDto = req.body;
      const result = await this.onboardingService.saveUserOnboarding(userId, onboardingData);

      apiResponse.success(res, 'Onboarding completed successfully', result);
    } catch (error) {
      next(error);
    }
  };
}
