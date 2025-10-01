import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { JourneyController } from '@controllers/journey.controller';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { JourneyInitRequestDto, FinancialSummaryRequestDto } from '@/dtos/journey.dto';
import { uploadMiddleware } from '@middlewares/upload.middleware';

export class JourneyRoute implements Routes {
  public path = '/journey';
  public router = Router();
  public journeyController = new JourneyController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /journey/init:
     *   post:
     *     tags:
     *       - Journey
     *     summary: Initialize a user's home buying journey
     *     description: Create or update a user's journey after onboarding
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - is_first_time_buyer
     *               - is_selling_current_home
     *               - has_bridge_loan
     *             properties:
     *               is_first_time_buyer:
     *                 type: boolean
     *               is_selling_current_home:
     *                 type: boolean
     *               has_bridge_loan:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Journey initialized successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Server error
     */
    this.router.post(`${this.path}/init`, AuthMiddleware, ValidationMiddleware(JourneyInitRequestDto, 'body'), this.journeyController.initJourney);

    /**
     * @swagger
     * /journey/timeline:
     *   get:
     *     tags:
     *       - Journey
     *     summary: Get user's journey timeline
     *     description: Returns all user milestones sorted by order_index
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Timeline retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   milestone:
     *                     type: string
     *                   due_date:
     *                     type: string
     *                     format: date
     *                   is_complete:
     *                     type: boolean
     *                   tasks:
     *                     type: array
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Journey not found
     */
    this.router.get(`${this.path}/timeline`, AuthMiddleware, this.journeyController.getTimeline);

    /**
     * @swagger
     * /journey/tasks:
     *   get:
     *     tags:
     *       - Journey
     *     summary: Get user's active tasks
     *     description: Returns all active tasks grouped by milestone
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Tasks retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Journey not found
     */
    this.router.get(`${this.path}/tasks`, AuthMiddleware, this.journeyController.getTasks);

    /**
     * @swagger
     * /journey/tasks/{id}/complete:
     *   post:
     *     tags:
     *       - Journey
     *     summary: Mark a task as complete
     *     description: Marks a specific task as DONE and updates milestone status if needed
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: Task ID
     *     responses:
     *       200:
     *         description: Task marked as complete
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Task not found or doesn't belong to the user
     */
    this.router.post(`${this.path}/tasks/:id/complete`, AuthMiddleware, this.journeyController.completeTask);

    /**
     * @swagger
     * /journey/documents/upload:
     *   post:
     *     tags:
     *       - Journey
     *     summary: Upload a document
     *     description: Upload a document and link to related task if applicable
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *               type:
     *                 type: string
     *                 description: Document type
     *     responses:
     *       200:
     *         description: Document uploaded successfully
     *       400:
     *         description: No file uploaded
     *       401:
     *         description: Unauthorized
     */
    this.router.post(`${this.path}/documents/upload`, AuthMiddleware, uploadMiddleware.single('file'), this.journeyController.uploadDocument);

    /**
     * @swagger
     * /journey/finance/summary:
     *   get:
     *     tags:
     *       - Journey
     *     summary: Get financial summary
     *     description: Returns the financial snapshot for the user journey
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Financial summary retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 estimated_mortgage:
     *                   type: number
     *                 estimated_boeterente:
     *                   type: number
     *                 bridge_loan_needed:
     *                   type: number
     *                 monthly_gross:
     *                   type: number
     *                 monthly_net:
     *                   type: number
     *       401:
     *         description: Unauthorized
     */
    this.router.get(`${this.path}/finance/summary`, AuthMiddleware, this.journeyController.getFinancialSummary);

    /**
     * @swagger
     * /journey/finance/summary:
     *   post:
     *     tags:
     *       - Journey
     *     summary: Update financial summary
     *     description: Updates or creates a financial summary
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               estimated_mortgage:
     *                 type: number
     *               estimated_boeterente:
     *                 type: number
     *               bridge_loan_needed:
     *                 type: number
     *               monthly_gross:
     *                 type: number
     *               monthly_net:
     *                 type: number
     *     responses:
     *       200:
     *         description: Financial summary updated successfully
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Journey not found
     */
    this.router.post(
      `${this.path}/finance/summary`,
      AuthMiddleware,
      ValidationMiddleware(FinancialSummaryRequestDto, 'body'),
      this.journeyController.updateFinancialSummary,
    );
  }
}

export default JourneyRoute;
