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
