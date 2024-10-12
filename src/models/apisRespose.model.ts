export interface BaseApiResponse {
  error: string;
  success: boolean;
  errorId: number;
  total: number;
  env: string;
  message: string;
}
