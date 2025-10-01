import { pool } from '@database';
import {
  JourneyInitDto,
  FinancialSummaryDto,
  UserJourney,
  UserMilestone,
  UserTask,
  FinancialSummary,
  TimelineStepUpdateDto,
  UserTimelineStep,
  EnhancedTimelineResponse,
  TimelineStepStatus,
  TimelineStepCategory,
} from '@/interfaces/journey.interface';
import { HttpException } from '@/exceptions/httpException';
import { logger } from '@/utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { OnboardingData } from '@/interfaces/onboarding.interface';

export class JourneyService {
  /**
   * Initialize or update a user's journey
   * @param userId User ID
   * @param journeyData Journey initialization data
   * @returns The created journey
   */
  public async initJourney(userId: string, journeyData: JourneyInitDto): Promise<UserJourney> {
    const client = await pool.connect();

    try {
      // Start transaction
      await client.query('BEGIN');

      // Check if user exists
      const userCheck = await client.query('SELECT id FROM users WHERE id = $1', [userId]);
      if (userCheck.rows.length === 0) {
        throw new HttpException(404, 'User not found');
      }

      // Check if the user already has a journey
      const journeyCheck = await client.query('SELECT id FROM user_journeys WHERE user_id = $1', [userId]);
      let journey;

      if (journeyCheck.rows.length > 0) {
        // Update existing journey
        const journeyId = journeyCheck.rows[0].id;
        const updateQuery = `
          UPDATE user_journeys
          SET is_first_time_buyer = $1, is_selling_current_home = $2, has_bridge_loan = $3, updated_at = NOW()
          WHERE id = $4
          RETURNING *
        `;
        const updateResult = await client.query(updateQuery, [
          journeyData.is_first_time_buyer,
          journeyData.is_selling_current_home,
          journeyData.has_bridge_loan,
          journeyId,
        ]);
        journey = updateResult.rows[0];

        // Delete existing milestones and tasks for this journey
        await client.query('DELETE FROM user_tasks WHERE user_milestone_id IN (SELECT id FROM user_milestones WHERE user_journey_id = $1)', [
          journeyId,
        ]);
        await client.query('DELETE FROM user_milestones WHERE user_journey_id = $1', [journeyId]);
      } else {
        // Create new journey
        const insertQuery = `
          INSERT INTO user_journeys (id, user_id, is_first_time_buyer, is_selling_current_home, has_bridge_loan, current_stage)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `;
        const journeyId = uuidv4();
        const insertResult = await client.query(insertQuery, [
          journeyId,
          userId,
          journeyData.is_first_time_buyer,
          journeyData.is_selling_current_home,
          journeyData.has_bridge_loan,
          'STARTED',
        ]);
        journey = insertResult.rows[0];

        // Create a blank financial summary
        await client.query(
          `
          INSERT INTO financial_summaries (id, user_journey_id)
          VALUES ($1, $2)
        `,
          [uuidv4(), journeyId],
        );
      }

      // Get all milestones
      const milestonesResult = await client.query('SELECT * FROM milestones ORDER BY order_index');
      const milestones = milestonesResult.rows;

      // Filter milestones based on journey data
      const relevantMilestones = this.filterRelevantMilestones(milestones, journeyData);

      // Create user milestones and default tasks
      for (const milestone of relevantMilestones) {
        const userMilestoneId = uuidv4();

        // Set due date based on milestone logic
        const dueDate = this.calculateMilestoneDueDate(milestone.code);

        // Create user milestone
        await client.query(
          `
          INSERT INTO user_milestones (id, user_journey_id, milestone_id, due_date)
          VALUES ($1, $2, $3, $4)
        `,
          [userMilestoneId, journey.id, milestone.id, dueDate],
        );

        // Create default tasks for this milestone
        await this.createDefaultTasksForMilestone(client, userMilestoneId, milestone.code);
      }

      await client.query('COMMIT');
      return journey;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error(`Error initializing journey: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get a user's journey timeline
   * @param userId User ID
   * @returns The user's timeline
   */
  public async getJourneyTimeline(userId: string): Promise<UserMilestone[]> {
    try {
      // Find user's journey
      const journeyResult = await pool.query('SELECT id FROM user_journeys WHERE user_id = $1', [userId]);

      if (journeyResult.rows.length === 0) {
        throw new HttpException(404, 'Journey not found for this user');
      }

      const journeyId = journeyResult.rows[0].id;

      // Get all milestones with their tasks
      const query = `
        SELECT
          um.id, um.is_complete, um.due_date, um.completed_at, um.created_at,
          m.id as milestone_id, m.code, m.name, m.description, m.order_index, m.is_optional,
          json_agg(
            json_build_object(
              'id', ut.id,
              'title', ut.title,
              'status', ut.status,
              'related_document_id', ut.related_document_id,
              'created_at', ut.created_at,
              'updated_at', ut.updated_at
            )
          ) as tasks
        FROM user_milestones um
        JOIN milestones m ON um.milestone_id = m.id
        LEFT JOIN user_tasks ut ON ut.user_milestone_id = um.id
        WHERE um.user_journey_id = $1
        GROUP BY um.id, m.id
        ORDER BY m.order_index
      `;

      const result = await pool.query(query, [journeyId]);

      return result.rows.map(row => {
        // Handle NULL case for json_agg when there are no tasks
        const tasks = row.tasks[0].id === null ? [] : row.tasks;

        return {
          id: row.id,
          user_journey_id: journeyId,
          milestone_id: row.milestone_id,
          is_complete: row.is_complete,
          due_date: row.due_date,
          completed_at: row.completed_at,
          created_at: row.created_at,
          milestone: {
            id: row.milestone_id,
            code: row.code,
            name: row.name,
            description: row.description,
            order_index: row.order_index,
            is_optional: row.is_optional,
          },
          tasks: tasks,
        };
      });
    } catch (error) {
      logger.error(`Error fetching journey timeline: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all active tasks for a user's journey
   * @param userId User ID
   * @returns The user's tasks grouped by milestone
   */
  public async getJourneyTasks(userId: string): Promise<UserTask[]> {
    try {
      // Find user's journey
      const journeyResult = await pool.query('SELECT id FROM user_journeys WHERE user_id = $1', [userId]);

      if (journeyResult.rows.length === 0) {
        throw new HttpException(404, 'Journey not found for this user');
      }

      const journeyId = journeyResult.rows[0].id;

      // Get all active tasks (not completed)
      const query = `
        SELECT
          ut.id, ut.title, ut.status, ut.related_document_id, ut.created_at, ut.updated_at,
          um.id as user_milestone_id,
          m.id as milestone_id, m.name as milestone_name, m.code as milestone_code,
          d.id as document_id, d.type as document_type, d.filename as document_filename, d.file_url as document_url
        FROM user_tasks ut
        JOIN user_milestones um ON ut.user_milestone_id = um.id
        JOIN milestones m ON um.milestone_id = m.id
        LEFT JOIN documents d ON ut.related_document_id = d.id
        WHERE um.user_journey_id = $1 AND ut.status != 'DONE'
        ORDER BY m.order_index, ut.created_at
      `;

      const result = await pool.query(query, [journeyId]);

      return result.rows.map(row => {
        return {
          id: row.id,
          user_milestone_id: row.user_milestone_id,
          title: row.title,
          status: row.status,
          related_document_id: row.related_document_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          milestone: {
            id: row.milestone_id,
            name: row.milestone_name,
            code: row.milestone_code,
          },
          document: row.document_id
            ? {
                id: row.document_id,
                type: row.document_type,
                filename: row.document_filename,
                file_url: row.document_url,
              }
            : undefined,
        };
      });
    } catch (error) {
      logger.error(`Error fetching journey tasks: ${error.message}`);
      throw error;
    }
  }

  /**
   * Mark a task as complete and update related milestone if needed
   * @param userId User ID
   * @param taskId Task ID
   */
  public async completeTask(userId: string, taskId: string): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Validate the task belongs to the user
      const taskCheck = await client.query(
        `
        SELECT ut.id, ut.user_milestone_id, ut.status
        FROM user_tasks ut
        JOIN user_milestones um ON ut.user_milestone_id = um.id
        JOIN user_journeys uj ON um.user_journey_id = uj.id
        WHERE ut.id = $1 AND uj.user_id = $2
      `,
        [taskId, userId],
      );

      if (taskCheck.rows.length === 0) {
        throw new HttpException(404, 'Task not found or does not belong to the user');
      }

      if (taskCheck.rows[0].status === 'DONE') {
        // Task is already completed, no action needed
        return;
      }

      // Mark task as done
      await client.query(
        `
        UPDATE user_tasks SET status = 'DONE', updated_at = NOW()
        WHERE id = $1
      `,
        [taskId],
      );

      const userMilestoneId = taskCheck.rows[0].user_milestone_id;

      // Check if all tasks for this milestone are complete
      const remainingTasksCheck = await client.query(
        `
        SELECT COUNT(*) as count
        FROM user_tasks
        WHERE user_milestone_id = $1 AND status != 'DONE'
      `,
        [userMilestoneId],
      );

      if (parseInt(remainingTasksCheck.rows[0].count) === 0) {
        // All tasks are done, mark milestone as complete
        await client.query(
          `
          UPDATE user_milestones
          SET is_complete = TRUE, completed_at = NOW()
          WHERE id = $1
        `,
          [userMilestoneId],
        );

        // Check if this was the last milestone to determine journey completion
        await this.updateJourneyStageIfNeeded(client, userId);
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error(`Error completing task: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Upload a document and link to related task if applicable
   * @param userId User ID
   * @param file Uploaded file
   * @param documentType Document type
   * @returns The created document
   */
  public async uploadDocument(userId: string, file: Express.Multer.File, documentType: string): Promise<any> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // In a real implementation, this would upload to S3 or similar
      // Here we'll simulate it by storing the file path locally
      const filePath = `/uploads/${file.filename}`;
      const documentId = uuidv4();

      // Store document metadata in the database
      const documentResult = await client.query(
        `
        INSERT INTO documents (id, user_id, type, filename, file_url, uploaded_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *
      `,
        [documentId, userId, documentType, file.originalname, filePath],
      );

      const document = documentResult.rows[0];

      // Find if there's a task related to this document type
      const taskQuery = `
        SELECT ut.id
        FROM user_tasks ut
        JOIN user_milestones um ON ut.user_milestone_id = um.id
        JOIN user_journeys uj ON um.user_journey_id = uj.id
        WHERE uj.user_id = $1 AND ut.title ILIKE $2 AND ut.status != 'DONE'
        ORDER BY ut.created_at
        LIMIT 1
      `;

      // This is a simplified approach - in practice, you'd have a more robust matching system
      const taskResult = await client.query(taskQuery, [userId, `%${documentType}%`]);

      if (taskResult.rows.length > 0) {
        const taskId = taskResult.rows[0].id;

        // Link document to the task
        await client.query(
          `
          UPDATE user_tasks
          SET related_document_id = $1, status = 'DONE', updated_at = NOW()
          WHERE id = $2
        `,
          [documentId, taskId],
        );

        // Check if we need to update the milestone
        await this.completeTask(userId, taskId);
      }

      await client.query('COMMIT');
      return document;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error(`Error uploading document: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get a user's financial summary
   * @param userId User ID
   * @returns The user's financial summary
   */
  public async getFinancialSummary(userId: string): Promise<FinancialSummary | null> {
    try {
      const query = `
        SELECT fs.*
        FROM financial_summaries fs
        JOIN user_journeys uj ON fs.user_journey_id = uj.id
        WHERE uj.user_id = $1
      `;

      const result = await pool.query(query, [userId]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      logger.error(`Error fetching financial summary: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update a user's financial summary
   * @param userId User ID
   * @param financialData Financial summary data
   * @returns The updated financial summary
   */
  public async updateFinancialSummary(userId: string, financialData: FinancialSummaryDto): Promise<FinancialSummary> {
    try {
      // Find user's journey
      const journeyResult = await pool.query('SELECT id FROM user_journeys WHERE user_id = $1', [userId]);

      if (journeyResult.rows.length === 0) {
        throw new HttpException(404, 'Journey not found for this user');
      }

      const journeyId = journeyResult.rows[0].id;

      // Check if financial summary exists
      const summaryCheck = await pool.query('SELECT id FROM financial_summaries WHERE user_journey_id = $1', [journeyId]);

      let summaryId;
      if (summaryCheck.rows.length === 0) {
        // Create new summary
        const newSummary = await pool.query(
          `
          INSERT INTO financial_summaries (id, user_journey_id, estimated_mortgage, estimated_boeterente,
            bridge_loan_needed, monthly_gross, monthly_net)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id
        `,
          [
            uuidv4(),
            journeyId,
            financialData.estimated_mortgage || null,
            financialData.estimated_boeterente || null,
            financialData.bridge_loan_needed || null,
            financialData.monthly_gross || null,
            financialData.monthly_net || null,
          ],
        );
        summaryId = newSummary.rows[0].id;
      } else {
        // Update existing summary
        summaryId = summaryCheck.rows[0].id;

        // Build dynamic update query based on provided fields
        const updateFields = [];
        const values = [summaryId];
        let paramIndex = 2;

        if (financialData.estimated_mortgage !== undefined) {
          updateFields.push(`estimated_mortgage = $${paramIndex++}`);
          values.push(financialData.estimated_mortgage);
        }

        if (financialData.estimated_boeterente !== undefined) {
          updateFields.push(`estimated_boeterente = $${paramIndex++}`);
          values.push(financialData.estimated_boeterente);
        }

        if (financialData.bridge_loan_needed !== undefined) {
          updateFields.push(`bridge_loan_needed = $${paramIndex++}`);
          values.push(financialData.bridge_loan_needed);
        }

        if (financialData.monthly_gross !== undefined) {
          updateFields.push(`monthly_gross = $${paramIndex++}`);
          values.push(financialData.monthly_gross);
        }

        if (financialData.monthly_net !== undefined) {
          updateFields.push(`monthly_net = $${paramIndex++}`);
          values.push(financialData.monthly_net);
        }

        updateFields.push('updated_at = NOW()');

        if (updateFields.length > 1) {
          // At least one field plus updated_at
          const updateQuery = `
            UPDATE financial_summaries
            SET ${updateFields.join(', ')}
            WHERE id = $1
          `;

          await pool.query(updateQuery, values);
        }
      }

      // Get updated summary
      const result = await pool.query('SELECT * FROM financial_summaries WHERE id = $1', [summaryId]);

      return result.rows[0];
    } catch (error) {
      logger.error(`Error updating financial summary: ${error.message}`);
      throw error;
    }
  }

  /**
   * Filter milestones based on journey data
   * @param allMilestones All available milestones
   * @param journeyData Journey initialization data
   * @returns Filtered milestones
   */
  private filterRelevantMilestones(allMilestones: any[], journeyData: JourneyInitDto): any[] {
    // Always include core milestones
    const relevantMilestones = allMilestones.filter(m => !m.is_optional);

    // Add selling milestones if applicable
    if (journeyData.is_selling_current_home) {
      const sellingMilestones = allMilestones.filter(m => m.is_optional && (m.code.includes('SELL') || m.code.includes('SELLING')));
      relevantMilestones.push(...sellingMilestones);
    }

    // Add bridge loan milestones if applicable
    if (journeyData.has_bridge_loan) {
      const bridgeLoanMilestones = allMilestones.filter(m => m.is_optional && m.code.includes('BRIDGE'));
      relevantMilestones.push(...bridgeLoanMilestones);
    }

    // Sort by order_index
    return relevantMilestones.sort((a, b) => a.order_index - b.order_index);
  }

  /**
   * Calculate due date for a milestone
   * @param milestoneCode Milestone code
   * @returns Due date or null
   */
  private calculateMilestoneDueDate(milestoneCode: string): Date | null {
    const now = new Date();

    // Set due dates based on milestone type
    switch (milestoneCode) {
      case 'MORTGAGE_ADVICE':
        return new Date(now.setDate(now.getDate() + 14)); // 2 weeks
      case 'SIGN_KOOP':
        return new Date(now.setDate(now.getDate() + 30)); // 1 month
      case 'SECURE_FINANCING':
        return new Date(now.setDate(now.getDate() + 60)); // 2 months
      case 'SCHEDULE_NOTARY':
        return new Date(now.setDate(now.getDate() + 75)); // 2.5 months
      case 'FINAL_INSPECTION':
        return new Date(now.setDate(now.getDate() + 89)); // ~3 months
      case 'KEY_TRANSFER':
        return new Date(now.setDate(now.getDate() + 90)); // 3 months
      default:
        return null; // No due date
    }
  }

  /**
   * Create default tasks for a milestone
   * @param client Database client (for transaction)
   * @param userMilestoneId User milestone ID
   * @param milestoneCode Milestone code
   */
  private async createDefaultTasksForMilestone(client: any, userMilestoneId: string, milestoneCode: string): Promise<void> {
    const tasks = this.getDefaultTasksForMilestone(milestoneCode);

    for (const task of tasks) {
      await client.query(
        `
        INSERT INTO user_tasks (id, user_milestone_id, title, status)
        VALUES ($1, $2, $3, 'PENDING')
      `,
        [uuidv4(), userMilestoneId, task],
      );
    }
  }

  /**
   * Get default tasks for a milestone
   * @param milestoneCode Milestone code
   * @returns Array of task titles
   */
  private getDefaultTasksForMilestone(milestoneCode: string): string[] {
    switch (milestoneCode) {
      case 'MORTGAGE_ADVICE':
        return [
          'Schedule appointment with mortgage advisor',
          'Prepare income documentation',
          'Prepare list of financial obligations',
          'Upload proof of identity document',
        ];
      case 'SIGN_KOOP':
        return ['Review purchase agreement', 'Contact notary', 'Sign purchase agreement', 'Upload signed purchase agreement'];
      case 'SECURE_FINANCING':
        return [
          'Submit mortgage application',
          'Provide additional documentation if requested',
          'Review mortgage offer',
          'Accept mortgage offer',
          'Upload mortgage approval document',
        ];
      case 'SCHEDULE_NOTARY':
        return ['Select notary', 'Schedule appointment', 'Arrange funds transfer', 'Review deed of transfer'];
      case 'FINAL_INSPECTION':
        return ['Schedule final inspection', 'Prepare inspection checklist', 'Document any issues', 'Follow up on repairs if needed'];
      case 'KEY_TRANSFER':
        return [
          'Confirm appointment with notary',
          'Bring valid ID to appointment',
          'Arrange for utility transfers',
          'Obtain keys and house documentation',
        ];
      default:
        return ['Complete milestone tasks'];
    }
  }

  /**
   * Update journey stage if needed
   * @param client Database client (for transaction)
   * @param userId User ID
   */
  private async updateJourneyStageIfNeeded(client: any, userId: string): Promise<void> {
    // Get journey and milestone completion status
    const journeyQuery = `
      SELECT
        uj.id,
        SUM(CASE WHEN um.is_complete = TRUE THEN 1 ELSE 0 END) as completed_milestones,
        COUNT(um.id) as total_milestones
      FROM user_journeys uj
      JOIN user_milestones um ON um.user_journey_id = uj.id
      WHERE uj.user_id = $1
      GROUP BY uj.id
    `;

    const journeyResult = await client.query(journeyQuery, [userId]);

    if (journeyResult.rows.length > 0) {
      const { id, completed_milestones, total_milestones } = journeyResult.rows[0];

      // Calculate completion percentage
      const completionPercentage = (completed_milestones / total_milestones) * 100;

      // Update journey stage based on completion
      let newStage = 'STARTED';

      if (completionPercentage === 100) {
        newStage = 'COMPLETED';
      } else if (completionPercentage >= 75) {
        newStage = 'FINAL_PHASE';
      } else if (completionPercentage >= 50) {
        newStage = 'MID_PHASE';
      } else if (completionPercentage >= 25) {
        newStage = 'EARLY_PHASE';
      }

      // Update journey stage
      await client.query(
        `
        UPDATE user_journeys
        SET current_stage = $1, updated_at = NOW()
        WHERE id = $2
      `,
        [newStage, id],
      );
    }
  }

  /**
   * Generate initial user timeline based on onboarding data
   * @param userId User ID
   * @param onboardingData User's onboarding profile
   * @returns The generated timeline steps
   */
  public async generateUserTimeline(userId: string, onboardingData: OnboardingData): Promise<UserTimelineStep[]> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Check if user exists and has a journey
      const journeyResult = await client.query('SELECT id FROM user_journeys WHERE user_id = $1', [userId]);

      if (journeyResult.rows.length === 0) {
        throw new HttpException(404, 'Journey not found for this user');
      }

      const journeyId = journeyResult.rows[0].id;

      // Get all timeline templates that match user's profile
      const templates = await this.getMatchingTemplates(client, onboardingData);

      // Delete existing timeline steps for this user
      await client.query('DELETE FROM user_timeline_steps WHERE user_id = $1', [userId]);

      // Create user timeline steps based on templates
      const timelineSteps = [];
      for (const template of templates) {
        const stepId = uuidv4();

        // Calculate due date based on template offset
        const dueDate = template.default_days_offset ? new Date(Date.now() + template.default_days_offset * 24 * 60 * 60 * 1000) : null;

        // Create timeline step
        const result = await client.query(
          `INSERT INTO user_timeline_steps
           (id, user_id, timeline_step_id, status, due_date, priority, notification_enabled)
           VALUES ($1, $2, $3, 'pending', $4, $5, TRUE)
           RETURNING *`,
          [stepId, userId, template.id, dueDate, template.default_priority || 3],
        );

        timelineSteps.push(result.rows[0]);
      }

      await client.query('COMMIT');

      // Return steps with detailed information
      return this.getTimelineStepsWithDetails(timelineSteps);
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error(`Error generating timeline: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get enhanced user timeline with dependencies and tools
   * @param userId User ID
   * @param filters Optional status and category filters
   * @returns Enhanced timeline
   */
  public async getEnhancedTimeline(
    userId: string,
    filters?: { status?: string; category?: string; sort?: string },
  ): Promise<EnhancedTimelineResponse> {
    try {
      // Build query with potential filters
      let query = `
        SELECT
          uts.id, uts.user_id, uts.timeline_step_id, uts.status, uts.due_date,
          uts.completed_at, uts.notes, uts.priority, uts.notification_enabled,
          uts.created_at, uts.updated_at,
          ts.name, ts.description, ts.order, ts.default_due_in_days, ts.category,
          ts.priority as base_priority, ts.dependencies, ts.related_tool_ids
        FROM user_timeline_steps uts
        JOIN timeline_steps ts ON uts.timeline_step_id = ts.id
        WHERE uts.user_id = $1
      `;

      const queryParams = [userId];
      let paramIndex = 2;

      if (filters?.status) {
        query += ` AND uts.status = $${paramIndex}`;
        queryParams.push(filters.status);
        paramIndex++;
      }

      if (filters?.category) {
        query += ` AND ts.category = $${paramIndex}`;
        queryParams.push(filters.category);
        paramIndex++;
      }

      // Add sorting
      if (filters?.sort) {
        const [field, direction] = filters.sort.split(':');
        const validFields = ['due_date', 'priority', 'status', 'created_at'];
        const validDirections = ['asc', 'desc'];

        if (validFields.includes(field) && validDirections.includes(direction?.toLowerCase() || 'asc')) {
          query += ` ORDER BY ${field} ${direction || 'ASC'}`;
        } else {
          // Default sorting
          query += ` ORDER BY uts.priority DESC, uts.due_date ASC`;
        }
      } else {
        // Default sorting
        query += ` ORDER BY uts.priority DESC, uts.due_date ASC`;
      }

      const result = await pool.query(query, queryParams);

      // Get progress metrics
      const progressQuery = `
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'completed') as completed,
          COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
          COUNT(*) FILTER (WHERE status = 'pending') as pending
        FROM user_timeline_steps
        WHERE user_id = $1
      `;

      const progressResult = await pool.query(progressQuery, [userId]);
      const progress = progressResult.rows[0];

      // Calculate percentage
      const completedPercentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

      // Format response
      const steps = result.rows.map(row => ({
        id: row.id,
        user_id: row.user_id,
        timeline_step_id: row.timeline_step_id,
        status: row.status,
        due_date: row.due_date,
        completed_at: row.completed_at,
        notes: row.notes,
        priority: row.priority,
        notification_enabled: row.notification_enabled,
        created_at: row.created_at,
        updated_at: row.updated_at,
        timeline_step: {
          id: row.timeline_step_id,
          name: row.name,
          description: row.description,
          order: row.order,
          default_due_in_days: row.default_due_in_days,
          category: row.category,
          priority: row.base_priority,
          dependencies: row.dependencies || [],
          related_tool_ids: row.related_tool_ids || [],
        },
        is_blocked: !this.areDependenciesFulfilledSync(row.dependencies || [], result.rows),
      }));

      return {
        steps,
        progress: {
          total: parseInt(progress.total),
          completed: parseInt(progress.completed),
          in_progress: parseInt(progress.in_progress),
          pending: parseInt(progress.pending),
          percentage: completedPercentage,
        },
      };
    } catch (error) {
      logger.error(`Error fetching enhanced timeline: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update a timeline step
   * @param userId User ID
   * @param stepId Step ID
   * @param updateData Update data
   * @returns Updated step
   */
  public async updateTimelineStep(userId: string, stepId: string, updateData: TimelineStepUpdateDto): Promise<UserTimelineStep> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Verify step exists and belongs to user
      const stepCheck = await client.query('SELECT id FROM user_timeline_steps WHERE id = $1 AND user_id = $2', [stepId, userId]);

      if (stepCheck.rows.length === 0) {
        throw new HttpException(404, 'Timeline step not found or does not belong to user');
      }

      // Check if we're updating status to completed
      let completedAt = null;
      if (updateData.status === TimelineStepStatus.COMPLETED) {
        completedAt = new Date();

        // Verify dependencies are fulfilled
        const areDependenciesFulfilled = await this.areDependenciesFulfilled(userId, stepId);
        if (!areDependenciesFulfilled) {
          throw new HttpException(400, 'Cannot mark step as completed: prerequisites are not completed');
        }
      }

      // Build dynamic update query
      const updateFields = [];
      const values = [stepId];
      let paramIndex = 2;

      if (updateData.status !== undefined) {
        updateFields.push(`status = $${paramIndex++}`);
        values.push(updateData.status);
      }

      if (updateData.due_date !== undefined) {
        updateFields.push(`due_date = $${paramIndex++}`);
        values.push(updateData.due_date);
      }

      if (updateData.priority !== undefined) {
        updateFields.push(`priority = $${paramIndex++}`);
        values.push(updateData.priority);
      }

      if (updateData.notification_enabled !== undefined) {
        updateFields.push(`notification_enabled = $${paramIndex++}`);
        values.push(updateData.notification_enabled);
      }

      if (updateData.notes !== undefined) {
        updateFields.push(`notes = $${paramIndex++}`);
        values.push(updateData.notes);
      }

      if (completedAt !== null) {
        updateFields.push(`completed_at = $${paramIndex++}`);
        values.push(completedAt);
      }

      updateFields.push(`updated_at = NOW()`);

      // Update the step
      const updateQuery = `
        UPDATE user_timeline_steps
        SET ${updateFields.join(', ')}
        WHERE id = $1
        RETURNING *
      `;

      const updateResult = await client.query(updateQuery, values);
      await client.query('COMMIT');

      // Get detailed step info
      return this.getTimelineStepWithDetails(updateResult.rows[0].id);
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error(`Error updating timeline step: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get timeline progress summary for a user
   * @param userId User ID
   * @returns Progress summary
   */
  public async getTimelineProgress(userId: string): Promise<any> {
    try {
      // Check if user exists
      const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
      if (userCheck.rows.length === 0) {
        throw new HttpException(404, 'User not found');
      }

      // Get overall progress
      const overallQuery = `
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'completed') as completed,
          COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
          COUNT(*) FILTER (WHERE status = 'pending') as pending
        FROM user_timeline_steps
        WHERE user_id = $1
      `;

      const overallResult = await pool.query(overallQuery, [userId]);
      const overall = overallResult.rows[0];

      // Get progress by category
      const categoryQuery = `
        SELECT
          ts.category,
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE uts.status = 'completed') as completed
        FROM user_timeline_steps uts
        JOIN timeline_steps ts ON uts.timeline_step_id = ts.id
        WHERE uts.user_id = $1
        GROUP BY ts.category
      `;

      const categoryResult = await pool.query(categoryQuery, [userId]);

      // Get upcoming due dates
      const upcomingQuery = `
        SELECT
          uts.id, uts.due_date,
          ts.name, ts.category
        FROM user_timeline_steps uts
        JOIN timeline_steps ts ON uts.timeline_step_id = ts.id
        WHERE
          uts.user_id = $1 AND
          uts.status != 'completed' AND
          uts.due_date IS NOT NULL AND
          uts.due_date > NOW()
        ORDER BY uts.due_date ASC
        LIMIT 5
      `;

      const upcomingResult = await pool.query(upcomingQuery, [userId]);

      // Calculate percentages
      const totalCount = parseInt(overall.total) || 1; // Avoid division by zero
      const completedPercentage = Math.round((parseInt(overall.completed) / totalCount) * 100);

      // Build response
      return {
        overall: {
          total: parseInt(overall.total),
          completed: parseInt(overall.completed),
          in_progress: parseInt(overall.in_progress),
          pending: parseInt(overall.pending),
          completion_percentage: completedPercentage,
        },
        by_category: categoryResult.rows.map(cat => ({
          category: cat.category,
          total: parseInt(cat.total),
          completed: parseInt(cat.completed),
          completion_percentage: Math.round((parseInt(cat.completed) / parseInt(cat.total)) * 100),
        })),
        upcoming_deadlines: upcomingResult.rows,
      };
    } catch (error) {
      logger.error(`Error fetching timeline progress: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if a timeline step's dependencies are completed
   * @param userId User ID
   * @param stepId Step ID
   * @returns Whether all dependencies are completed
   */
  private async areDependenciesFulfilled(userId: string, stepId: string): Promise<boolean> {
    const query = `
      SELECT
        ts.dependencies as dependencies,
        COUNT(uts2.id) FILTER (WHERE uts2.status = 'completed') as completed_count,
        json_array_length(ts.dependencies) as total_dependencies
      FROM user_timeline_steps uts
      JOIN timeline_steps ts ON uts.timeline_step_id = ts.id
      LEFT JOIN user_timeline_steps uts2 ON
        uts2.user_id = uts.user_id AND
        uts2.timeline_step_id = ANY(SELECT value::uuid FROM jsonb_array_elements_text(ts.dependencies))
      WHERE uts.id = $1 AND uts.user_id = $2
      GROUP BY ts.dependencies
    `;

    const result = await pool.query(query, [stepId, userId]);

    if (result.rows.length === 0) return true; // No dependencies

    const row = result.rows[0];
    if (!row.dependencies || row.dependencies.length === 0) return true;

    return parseInt(row.completed_count) >= parseInt(row.total_dependencies);
  }

  /**
   * Synchronous version to check dependencies from already fetched steps
   * @param dependencies Array of dependency IDs
   * @param allSteps Array of all user steps
   * @returns Whether all dependencies are completed
   */
  private areDependenciesFulfilledSync(dependencies: string[], allSteps: any[]): boolean {
    if (!dependencies || dependencies.length === 0) return true;

    // Check that all dependency IDs have a corresponding completed step
    for (const depId of dependencies) {
      const depStep = allSteps.find(s => s.timeline_step_id === depId);
      if (!depStep || depStep.status !== 'completed') {
        return false;
      }
    }

    return true;
  }

  /**
   * Get matching templates for user based on onboarding data
   * @param client Database client
   * @param onboardingData User's onboarding data
   * @returns Matching templates
   */
  private async getMatchingTemplates(client: any, onboardingData: OnboardingData): Promise<any[]> {
    // Build query to find matching templates
    const query = `
      SELECT *
      FROM timeline_templates
      WHERE
        ($1::text = 'buying' AND (category = 'buying' OR category = 'shared')) OR
        ($1::text = 'selling' AND (category = 'selling' OR category = 'shared')) OR
        ($1::text = 'both' AND (category IN ('buying', 'selling', 'shared')))
      ORDER BY default_priority DESC, default_days_offset ASC
    `;

    const result = await client.query(query, [onboardingData.goal]);

    // Further filter based on onboarding flags if needed
    return result.rows.filter(template => {
      // If no required flags, include the template
      if (!template.required_onboarding_flags || template.required_onboarding_flags.length === 0) {
        return true;
      }

      // Check if user's onboarding data matches required flags
      // This is a simplified implementation - you'd have more sophisticated matching logic
      const requiredFlags = template.required_onboarding_flags;

      if (requiredFlags.includes('first_time_buyer') && !onboardingData.owns_home) {
        return true;
      }

      if (requiredFlags.includes('has_mortgage') && onboardingData.has_existing_mortgage) {
        return true;
      }

      // Add more flag checks as needed
      return false;
    });
  }

  /**
   * Get detailed step info including the timeline step details
   * @param stepId Step ID
   * @returns Step with details
   */
  private async getTimelineStepWithDetails(stepId: string): Promise<UserTimelineStep> {
    const query = `
      SELECT
        uts.id, uts.user_id, uts.timeline_step_id, uts.status, uts.due_date,
        uts.completed_at, uts.notes, uts.priority, uts.notification_enabled,
        uts.created_at, uts.updated_at,
        ts.name, ts.description, ts.order, ts.default_due_in_days, ts.category,
        ts.priority as base_priority, ts.dependencies, ts.related_tool_ids
      FROM user_timeline_steps uts
      JOIN timeline_steps ts ON uts.timeline_step_id = ts.id
      WHERE uts.id = $1
    `;

    const result = await pool.query(query, [stepId]);

    if (result.rows.length === 0) {
      throw new HttpException(404, 'Timeline step not found');
    }

    const row = result.rows[0];

    return {
      id: row.id,
      user_id: row.user_id,
      timeline_step_id: row.timeline_step_id,
      status: row.status,
      due_date: row.due_date,
      completed_at: row.completed_at,
      notes: row.notes,
      priority: row.priority,
      notification_enabled: row.notification_enabled,
      created_at: row.created_at,
      updated_at: row.updated_at,
      timeline_step: {
        id: row.timeline_step_id,
        name: row.name,
        description: row.description,
        order: row.order,
        default_due_in_days: row.default_due_in_days,
        category: row.category,
        priority: row.base_priority,
        dependencies: row.dependencies || [],
        related_tool_ids: row.related_tool_ids || [],
      },
    };
  }

  /**
   * Get timeline steps with their details
   * @param steps Array of user timeline steps
   * @returns Steps with details
   */
  private async getTimelineStepsWithDetails(steps: any[]): Promise<UserTimelineStep[]> {
    if (steps.length === 0) return [];

    // Get all step IDs
    const stepIds = steps.map(s => s.id);

    // Fetch all details in a single query
    const query = `
      SELECT
        uts.id, uts.user_id, uts.timeline_step_id, uts.status, uts.due_date,
        uts.completed_at, uts.notes, uts.priority, uts.notification_enabled,
        uts.created_at, uts.updated_at,
        ts.name, ts.description, ts.order, ts.default_due_in_days, ts.category,
        ts.priority as base_priority, ts.dependencies, ts.related_tool_ids
      FROM user_timeline_steps uts
      JOIN timeline_steps ts ON uts.timeline_step_id = ts.id
      WHERE uts.id = ANY($1)
    `;

    const result = await pool.query(query, [stepIds]);

    return result.rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      timeline_step_id: row.timeline_step_id,
      status: row.status,
      due_date: row.due_date,
      completed_at: row.completed_at,
      notes: row.notes,
      priority: row.priority,
      notification_enabled: row.notification_enabled,
      created_at: row.created_at,
      updated_at: row.updated_at,
      timeline_step: {
        id: row.timeline_step_id,
        name: row.name,
        description: row.description,
        order: row.order,
        default_due_in_days: row.default_due_in_days,
        category: row.category,
        priority: row.base_priority,
        dependencies: row.dependencies || [],
        related_tool_ids: row.related_tool_ids || [],
      },
    }));
  }

  /**
   * Schedule notifications for upcoming timeline steps
   */
  public async scheduleTimelineNotifications(): Promise<void> {
    // This would be called by a CRON job
    const query = `
      SELECT
        uts.id, uts.user_id, ts.name, uts.due_date
      FROM user_timeline_steps uts
      JOIN timeline_steps ts ON uts.timeline_step_id = ts.id
      WHERE
        uts.status <> 'completed' AND
        uts.notification_enabled = TRUE AND
        uts.due_date IS NOT NULL AND
        uts.due_date BETWEEN NOW() AND NOW() + INTERVAL '3 days'
    `;

    const result = await pool.query(query);

    for (const step of result.rows) {
      // Here you would integrate with your notification system
      // For example, send a push notification or email
      logger.info(`Would send notification for step ${step.name} to user ${step.user_id}`);

      // Example integration with a notification service:
      /*
      await notificationService.sendNotification({
        userId: step.user_id,
        title: 'Timeline Step Reminder',
        message: `Your step "${step.name}" is due soon: ${format(step.due_date, 'PP')}`,
        type: 'TIMELINE_REMINDER',
        referenceId: step.id
      });
      */
    }
  }
}
