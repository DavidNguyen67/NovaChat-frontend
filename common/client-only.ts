/* eslint-disable prettier/prettier */
import SCChannel from 'sc-channel';
import { AGClientSocket } from 'socketcluster-client';

import { Config } from '@/interfaces';

interface IGlobal {
  socket?: AGClientSocket;
  socketChannels: {
    [s: string]: {
      channel?: SCChannel<unknown>;
    };
  };
  config: Config;
  provinces: {
    id: string;
    name: string;
  }[];
  coordinates: Record<string, unknown>;
}

export const Global: IGlobal = {
  socketChannels: {},
  config: {},
  provinces: [],
  coordinates: {},
};
