import { Router } from 'express';
import FinancialController from '@controllers/financial.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CreateFinancialSnapshotDto } from '@/dtos/financial.dto';

class FinancialRoute implements Routes {
  public path = '/financial';
  public router = Router();
  public financialController = new FinancialController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // POST /api/financial-snapshot - Create a new financial snapshot
    this.router.post(
      `${this.path}-snapshot`,
      AuthMiddleware,
      ValidationMiddleware(CreateFinancialSnapshotDto),
      this.financialController.createFinancialSnapshot,
    );

    // GET /api/financial-snapshots - Get all financial snapshots for the current user
    this.router.get(`${this.path}-snapshots`, AuthMiddleware, this.financialController.getFinancialSnapshots);

    // GET /api/financial-snapshots/:id - Get a specific financial snapshot by ID
    this.router.get(`${this.path}-snapshots/:id`, AuthMiddleware, this.financialController.getFinancialSnapshotById);
  }
}

export default FinancialRoute;
