import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { OnboardingController } from '@controllers/onboarding.controller';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { OnboardingDto } from '@/dtos/onboarding.dto';

export class OnboardingRoute implements Routes {
  public path = ''; // Remove path prefix since it's handled by the router mount
  public router = Router();
  public onboardingController = new OnboardingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/user/onboarding', AuthMiddleware, this.onboardingController.getUserOnboarding);

    this.router.post('/user/onboarding', AuthMiddleware, ValidationMiddleware(OnboardingDto, 'body'), this.onboardingController.saveUserOnboarding);
  }
}

export default OnboardingRoute;
