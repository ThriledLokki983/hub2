import { AxiosResponse } from 'axios';
import { axiosInstance } from './axiosInstance';
import {
  FinancialInput,
  FinancialOutput,
} from '../components/FinancialDashboard/FinancialDashboard.interface';

// API response structure
interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}

/**
 * Financial API service
 * Handles all financial calculation related API calls
 */
export const FinancialService = {
  /**
   * Calculate financial snapshot based on user inputs
   * @param data User financial input data
   * @returns Promise with financial calculation results
   */
  calculateFinancialSnapshot: (
    data: FinancialInput,
  ): Promise<
    AxiosResponse<
      ApiResponse<
        FinancialOutput & {
          id: string;
          created_at: string;
        }
      >
    >
  > => {
    return axiosInstance.post('/financial-snapshot', data);
  },

  /**
   * Get saved financial snapshots for the current user
   * @returns Promise with array of saved financial snapshots
   */
  getSavedSnapshots: (): Promise<
    AxiosResponse<
      ApiResponse<
        (FinancialOutput & {
          id: string;
          created_at: string;
        })[]
      >
    >
  > => {
    return axiosInstance.get('/financial-snapshots');
  },

  /**
   * Save a financial snapshot for future reference
   * @param data Financial snapshot data to save
   * @param name Optional name/label for the snapshot
   * @returns Promise with the saved snapshot data
   */
  saveSnapshot: (
    data: FinancialOutput,
    name?: string,
  ): Promise<
    AxiosResponse<
      ApiResponse<{
        id: string;
        data: FinancialOutput;
        name: string;
        created_at: string;
      }>
    >
  > => {
    return axiosInstance.post('/financial-snapshots', { data, name });
  },
};

export default FinancialService;
