/* eslint-disable prettier/prettier */
import { AGClientSocket } from 'socketcluster-client';

export interface Config {
  connectionInfo?: {
    socketCluster: AGClientSocket.ClientOptions;
  };
  fileDownloadEndpoint?: string;
  provinceListUrl?: string;
  coordinatesListUrl?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: string | Record<string, any>;
}
