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
  // ... existing methods ...

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
