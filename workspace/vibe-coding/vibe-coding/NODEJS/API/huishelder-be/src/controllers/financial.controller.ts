import { NextFunction, Request, Response } from 'express';
import { CreateFinancialSnapshotDto } from '@/dtos/financial.dto';
import FinancialService from '@/services/financial.service';
import { RequestWithUser } from '@interfaces/auth.interface';
import { formatResponse } from '@utils/responseFormatter';
import { HttpException } from '@/exceptions/httpException';
import { logger } from '@/utils/logger';

class FinancialController {
  public financialService = new FinancialService();

  public createFinancialSnapshot = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const financialData: CreateFinancialSnapshotDto = req.body;
      const userId = req.user.id;

      const result = await this.financialService.createFinancialSnapshot(userId, financialData);

      return formatResponse(res, 201, 'Financial snapshot created successfully', {
        estimated_mortgage: result.estimated_mortgage,
        estimated_boeterente: result.estimated_boeterente,
        bridge_loan_amount: result.bridge_loan_amount,
        total_buyer_costs: result.total_buyer_costs,
        monthly_payment_gross: result.monthly_payment_gross,
        monthly_payment_net: result.monthly_payment_net,
        id: result.id,
        created_at: result.created_at,
      });
    } catch (error) {
      logger.error(`[FinancialController] createFinancialSnapshot error: ${error.message}`);
      next(error);
    }
  };

  public getFinancialSnapshots = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const snapshots = await this.financialService.getFinancialSnapshots(userId);

      return formatResponse(res, 200, 'Financial snapshots retrieved successfully', snapshots);
    } catch (error) {
      logger.error(`[FinancialController] getFinancialSnapshots error: ${error.message}`);
      next(error);
    }
  };

  public getFinancialSnapshotById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const snapshotId = req.params.id;
      const userId = req.user.id;

      if (!snapshotId) {
        throw new HttpException(400, 'Snapshot ID is required');
      }

      const snapshot = await this.financialService.getFinancialSnapshotById(snapshotId, userId);

      return formatResponse(res, 200, 'Financial snapshot retrieved successfully', snapshot);
    } catch (error) {
      logger.error(`[FinancialController] getFinancialSnapshotById error: ${error.message}`);
      next(error);
    }
  };
}

export default FinancialController;
