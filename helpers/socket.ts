/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable padding-line-between-statements */
import { create } from 'socketcluster-client';
import { mutate } from 'swr/_internal';
// @ts-ignore
import * as scCodecMinBin from 'sc-codec-min-bin';

import { GLOBAL_SOCKET_INIT, GLOBAL_SOCKET_STATUS } from '@/common/global';
import { Global } from '@/common/client-only';
import { SOCKET_STATUS } from '@/common';

export const initSocket = () => {
  try {
    const connectionInfo = {
      socketCluster: {
        ...Global.config.connectionInfo?.socketCluster,
        codecEngine: scCodecMinBin as any,
      },
    };
    console.log(connectionInfo);

    const socket = create(connectionInfo.socketCluster);
    Global.socket = socket;
    const s: any = socket;
    s.on?.('error', (err: any) => {
      console.log('[initSocket] ERROR', err);
      mutate(GLOBAL_SOCKET_STATUS, SOCKET_STATUS.CONNECTING);
    });

    s.on?.('connect', async () => {
      console.log('[initSocket] SOCKET connected');

      mutate(GLOBAL_SOCKET_STATUS, SOCKET_STATUS.CONNECTED);
      mutate(GLOBAL_SOCKET_INIT, true);
    });

    s.on?.('close', () => {
      console.log('[initSocket] SOCKET close');
      mutate(GLOBAL_SOCKET_STATUS, SOCKET_STATUS.DISCONNECTED);
      try {
        s.connect?.();
      } catch (e) {
        /* ignore */
      }
    });
  } catch (error) {
    // console.log(error);
  }
};

export const subscribeChanel = (
  chanel: string,
  callback: (data: any) => void,
  token?: string,
) => {
  // ensure socket initialized
  if (!Global.socket) {
    console.warn(
      '[subscribeChanel] socket not initialized, calling initSocket()',
    );
    initSocket();
  }

  // ensure container
  Global.socketChannels = Global.socketChannels ?? Object.create(null);

  // reuse existing entry
  const existing = Global.socketChannels[chanel] as
    | { channel: any; watchers: Set<(d: any) => void> }
    | undefined;
  if (existing) {
    existing.watchers.add(callback);
    return () => unsubscribeChanel(chanel, callback);
  }

  try {
    console.log('[subscribeChanel] SUBSCRIBE', chanel);
    const chan: any = Global.socket?.subscribe(
      chanel,
      token ? { data: { token } } : undefined,
    );
    if (!chan) {
      throw new Error('subscribe returned falsy channel');
    }

    const watchers = new Set<(d: any) => void>([callback]);

    Global.socketChannels[chanel] = {
      channel: chan,
      watchers,
    };

    // forward channel messages to all watchers
    (chan as any).watch((data: any) => {
      watchers.forEach((w) => {
        try {
          w(data);
        } catch (e) {
          console.warn('[subscribeChanel] watcher threw', e);
        }
      });
    });

    return () => unsubscribeChanel(chanel, callback);
  } catch (error) {
    console.error('[subscribeChanel] SUBFAILED', error);
    return () => {};
  }
};

export const unsubscribeChanel = (
  chanel: string,
  callback?: (data: any) => void,
) => {
  if (!Global.socketChannels) return;

  const entry = Global.socketChannels[chanel] as
    | { channel: any; watchers: Set<(d: any) => void> }
    | undefined;
  if (!entry) return;

  if (callback) {
    entry.watchers.delete(callback);
  }

  // if no watchers left (or no callback provided), fully unsubscribe
  if (!callback || entry.watchers.size === 0) {
    try {
      entry.channel?.unsubscribe?.();
    } catch (e) {
      console.warn('[unsubscribeChanel] unsubscribe error', e);
    }
    try {
      // remove any internal listeners if available
      (entry.channel as any)?.removeAllListeners?.();
    } catch (e) {
      /* ignore */
    }
    delete Global.socketChannels[chanel];
  }
};
