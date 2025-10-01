import { pool } from '@database';
import { CreateFinancialSnapshotDto } from '@/dtos/financial.dto';
import { FinancialOutput } from '@/interfaces/financial.interface';
import { HttpException } from '@/exceptions/httpException';
import { logger } from '@/utils/logger';

class FinancialService {
  /**
   * Creates a new financial snapshot for a user
   */
  public async createFinancialSnapshot(userId: string, financialData: CreateFinancialSnapshotDto): Promise<FinancialOutput> {
    try {
      // Calculate the financial outputs based on the provided inputs
      const calculatedOutputs = this.calculateFinancialOutputs(financialData);

      // Begin a transaction to ensure both inputs and outputs are saved atomically
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // Insert financial inputs
        const inputResult = await client.query(
          `INSERT INTO financial_inputs
          (user_id, current_home_value, current_mortgage_left, new_home_price,
           interest_rate, fixed_term_years, monthly_income, include_nhg, extra_savings)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id, created_at`,
          [
            userId,
            financialData.current_home_value,
            financialData.current_mortgage_left,
            financialData.new_home_price,
            financialData.interest_rate,
            financialData.fixed_term_years,
            financialData.monthly_income,
            financialData.include_nhg,
            financialData.extra_savings,
          ],
        );

        const inputId = inputResult.rows[0].id;
        const createdAt = inputResult.rows[0].created_at;

        // Insert financial outputs
        const outputResult = await client.query(
          `INSERT INTO financial_outputs
          (input_id, estimated_mortgage, estimated_boeterente, bridge_loan_amount,
           total_buyer_costs, monthly_payment_gross, monthly_payment_net)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id`,
          [
            inputId,
            calculatedOutputs.estimated_mortgage,
            calculatedOutputs.estimated_boeterente,
            calculatedOutputs.bridge_loan_amount,
            calculatedOutputs.total_buyer_costs,
            calculatedOutputs.monthly_payment_gross,
            calculatedOutputs.monthly_payment_net,
          ],
        );

        await client.query('COMMIT');

        // Return the financial output with its ID and creation date
        return {
          id: outputResult.rows[0].id,
          input_id: inputId,
          created_at: createdAt,
          ...calculatedOutputs,
        };
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error(`Error creating financial snapshot: ${error.message}`);
      throw new HttpException(500, 'Failed to create financial snapshot');
    }
  }

  /**
   * Gets all financial snapshots for a user
   */
  public async getFinancialSnapshots(userId: string): Promise<FinancialOutput[]> {
    try {
      const query = `
        SELECT o.*, i.created_at as input_created_at
        FROM financial_outputs o
        JOIN financial_inputs i ON o.input_id = i.id
        WHERE i.user_id = $1
        ORDER BY i.created_at DESC
      `;

      const { rows } = await pool.query(query, [userId]);

      return rows.map(row => ({
        id: row.id,
        input_id: row.input_id,
        created_at: row.input_created_at,
        estimated_mortgage: row.estimated_mortgage,
        estimated_boeterente: row.estimated_boeterente,
        bridge_loan_amount: row.bridge_loan_amount,
        total_buyer_costs: row.total_buyer_costs,
        monthly_payment_gross: row.monthly_payment_gross,
        monthly_payment_net: row.monthly_payment_net,
      }));
    } catch (error) {
      logger.error(`Error fetching financial snapshots: ${error.message}`);
      throw new HttpException(500, 'Failed to fetch financial snapshots');
    }
  }

  /**
   * Gets a specific financial snapshot by ID
   */
  public async getFinancialSnapshotById(snapshotId: string, userId: string): Promise<FinancialOutput> {
    try {
      const query = `
        SELECT o.*, i.created_at as input_created_at
        FROM financial_outputs o
        JOIN financial_inputs i ON o.input_id = i.id
        WHERE o.id = $1 AND i.user_id = $2
      `;

      const { rows } = await pool.query(query, [snapshotId, userId]);

      if (rows.length === 0) {
        throw new HttpException(404, 'Financial snapshot not found');
      }

      const row = rows[0];
      return {
        id: row.id,
        input_id: row.input_id,
        created_at: row.input_created_at,
        estimated_mortgage: row.estimated_mortgage,
        estimated_boeterente: row.estimated_boeterente,
        bridge_loan_amount: row.bridge_loan_amount,
        total_buyer_costs: row.total_buyer_costs,
        monthly_payment_gross: row.monthly_payment_gross,
        monthly_payment_net: row.monthly_payment_net,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error(`Error fetching financial snapshot: ${error.message}`);
      throw new HttpException(500, 'Failed to fetch financial snapshot');
    }
  }

  /**
   * Calculates financial outputs based on the provided inputs
   */
  private calculateFinancialOutputs(data: CreateFinancialSnapshotDto): Omit<FinancialOutput, 'id' | 'input_id' | 'created_at'> {
    // 1. Calculate equity
    const equity = data.current_home_value - data.current_mortgage_left;

    // 2. Calculate bridge loan amount
    const bridge_loan_amount = Math.max(0, data.new_home_price - equity - data.extra_savings);

    // 3. Calculate estimated mortgage (same as bridge loan in this simplified model)
    const estimated_mortgage = bridge_loan_amount;

    // 4. Calculate boeterente estimate (1% of current mortgage left)
    const estimated_boeterente = Math.round(data.current_mortgage_left * 0.01);

    // 5. Calculate total buyer costs (5% of new home price)
    const total_buyer_costs = Math.round(data.new_home_price * 0.05);

    // 6. Calculate monthly payment (annuity formula)
    // P = principal (estimated_mortgage)
    // r = monthly interest rate (annual rate / 12 / 100)
    // n = total number of months (years * 12)
    const P = estimated_mortgage;
    const r = data.interest_rate / 12 / 100;
    const n = data.fixed_term_years * 12;

    // Monthly payment formula: P * r * (1+r)^n / ((1+r)^n - 1)
    let monthly_payment_gross = 0;
    if (r > 0) {
      const numerator = P * r * Math.pow(1 + r, n);
      const denominator = Math.pow(1 + r, n) - 1;
      monthly_payment_gross = Math.round(numerator / denominator);
    } else {
      // If interest rate is 0, simply divide principal by number of months
      monthly_payment_gross = Math.round(P / n);
    }

    // 7. Calculate net monthly payment (85% of gross)
    const monthly_payment_net = Math.round(monthly_payment_gross * 0.85);

    return {
      estimated_mortgage,
      estimated_boeterente,
      bridge_loan_amount,
      total_buyer_costs,
      monthly_payment_gross,
      monthly_payment_net,
    };
  }
}

export default FinancialService;
