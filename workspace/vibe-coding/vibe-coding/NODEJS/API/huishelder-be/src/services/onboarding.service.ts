import { pool } from '@database';
import { OnboardingDto } from '@/dtos/onboarding.dto';
import { OnboardingData, OnboardingResponse } from '@/interfaces/onboarding.interface';
import { HttpException } from '@/exceptions/httpException';

export class OnboardingService {
  /**
   * Get user's onboarding data
   *
   * @param userId User ID
   * @returns Onboarding status and data if available
   */
  public async getUserOnboarding(userId: string): Promise<OnboardingResponse> {
    try {
      // Get onboarding status from users table
      const userQuery = await pool.query('SELECT onboarding_completed FROM users WHERE id = $1', [userId]);

      if (!userQuery.rows.length) {
        throw new HttpException(404, 'User not found');
      }

      const onboardingCompleted = userQuery.rows[0].onboarding_completed;
      let onboardingData: OnboardingData | undefined;

      // If user has completed onboarding, fetch the onboarding data
      if (onboardingCompleted) {
        const onboardingQuery = await pool.query(
          'SELECT goal, budget_min, budget_max, owns_home, has_existing_mortgage, timeline FROM user_onboarding WHERE user_id = $1',
          [userId],
        );

        if (onboardingQuery.rows.length) {
          onboardingData = onboardingQuery.rows[0] as OnboardingData;
        }
      }

      return {
        onboarding_completed: onboardingCompleted,
        onboarding_data: onboardingData,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Save user's onboarding data and mark onboarding as completed
   *
   * @param userId User ID
   * @param onboardingData Onboarding data
   * @returns Success message
   */
  public async saveUserOnboarding(userId: string, onboardingData: OnboardingDto): Promise<{ message: string }> {
    try {
      // Start database transaction
      await pool.query('BEGIN');

      // Check if user exists
      const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
      if (!userExists.rows.length) {
        throw new HttpException(404, 'User not found');
      }

      // Check if user already has onboarding data
      const existingData = await pool.query('SELECT user_id FROM user_onboarding WHERE user_id = $1', [userId]);

      if (existingData.rows.length) {
        // Update existing onboarding data
        await pool.query(
          `UPDATE user_onboarding
           SET goal = $1, budget_min = $2, budget_max = $3,
               owns_home = $4, has_existing_mortgage = $5,
               timeline = $6, updated_at = NOW()
           WHERE user_id = $7`,
          [
            onboardingData.goal,
            onboardingData.budget_min,
            onboardingData.budget_max,
            onboardingData.owns_home,
            onboardingData.has_existing_mortgage,
            onboardingData.timeline,
            userId,
          ],
        );
      } else {
        // Insert new onboarding data
        await pool.query(
          `INSERT INTO user_onboarding
           (user_id, goal, budget_min, budget_max, owns_home, has_existing_mortgage, timeline)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            userId,
            onboardingData.goal,
            onboardingData.budget_min,
            onboardingData.budget_max,
            onboardingData.owns_home,
            onboardingData.has_existing_mortgage,
            onboardingData.timeline,
          ],
        );
      }

      // Mark onboarding as completed in users table
      await pool.query('UPDATE users SET onboarding_completed = TRUE WHERE id = $1', [userId]);

      // Commit transaction
      await pool.query('COMMIT');

      return { message: 'Onboarding completed successfully' };
    } catch (error) {
      // Rollback transaction on error
      await pool.query('ROLLBACK');
      throw error;
    }
  }
}
