import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { TimelineController } from '@controllers/timeline.controller';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { TimelineStepUpdateRequestDto } from '@/dtos/timeline.dto';

export class TimelineRoute implements Routes {
  public path = '/journey/timeline';
  public router = Router();
  public timelineController = new TimelineController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /journey/timeline/generate:
     *   post:
     *     tags:
     *       - Journey
     *     summary: Generate a timeline for the user
     *     description: Create or regenerate the user's timeline based on onboarding data
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               onboardingData:
     *                 type: object
     *     responses:
     *       201:
     *         description: Timeline generated successfully
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Server error
     */
    this.router.post(`${this.path}/generate`, AuthMiddleware, this.timelineController.generateTimeline);

    /**
     * @swagger
     * /journey/timeline/enhanced:
     *   get:
     *     tags:
     *       - Journey
     *     summary: Get enhanced timeline
     *     description: Returns a user's timeline with additional information and features
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: status
     *         schema:
     *           type: string
     *           enum: [pending, in_progress, completed]
     *       - in: query
     *         name: category
     *         schema:
     *           type: string
     *           enum: [buying, selling, shared]
     *       - in: query
     *         name: sort
     *         schema:
     *           type: string
     *           example: due_date:asc
     *     responses:
     *       200:
     *         description: Timeline retrieved successfully
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Not found
     */
    this.router.get(`${this.path}/enhanced`, AuthMiddleware, this.timelineController.getEnhancedTimeline);

    /**
     * @swagger
     * /journey/timeline/steps/{stepId}:
     *   patch:
     *     tags:
     *       - Journey
     *     summary: Update a timeline step
     *     description: Update a timeline step's status, due date, etc.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: stepId
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               status:
     *                 type: string
     *                 enum: [pending, in_progress, completed]
     *               due_date:
     *                 type: string
     *                 format: date-time
     *               priority:
     *                 type: number
     *               notification_enabled:
     *                 type: boolean
     *               notes:
     *                 type: string
     *     responses:
     *       200:
     *         description: Timeline step updated successfully
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Not found
     */
    this.router.patch(
      `${this.path}/steps/:stepId`,
      AuthMiddleware,
      ValidationMiddleware(TimelineStepUpdateRequestDto, 'body'),
      this.timelineController.updateTimelineStep,
    );

    /**
     * @swagger
     * /journey/timeline/progress:
     *   get:
     *     tags:
     *       - Journey
     *     summary: Get timeline progress summary
     *     description: Get overall and category progress statistics
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Timeline progress retrieved successfully
     *       401:
     *         description: Unauthorized
     */
    this.router.get(`${this.path}/progress`, AuthMiddleware, this.timelineController.getTimelineProgress);
  }
}
