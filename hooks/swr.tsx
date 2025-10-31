/* eslint-disable prettier/prettier */
import type { SWRMutationConfiguration } from 'swr/mutation';

import { addToast } from '@heroui/react';
import useSWR from 'swr';
import { mutate, PublicConfiguration } from 'swr/_internal';
import useSWRMutation from 'swr/mutation';

import { METHOD } from '@/common';
import { RestError, RestResponse } from '@/interfaces/response';
import { fetcher } from '@/common/restApi';
import { ApiResponse } from '@/interfaces';

interface WrapperConfig<T>
  extends Partial<PublicConfiguration<T, RestError, (arg: string) => any>> {
  url?: string;
  method?: METHOD;
  body?: Record<string, unknown>;
  auth?: boolean;
  enable?: boolean;
  noEndPoint?: boolean;
  extraHeader?: Record<string, string>;
  notification?: {
    title?: string;
    message?: string;
  };
  ignoreNotification?: boolean;
}

export function useSWRWrapper<T = Record<string, unknown>>(
  key: string | null | (() => string | string[] | null) | string[],
  {
    url,
    method,
    body,
    auth,
    noEndPoint,
    enable = true,
    notification,
    ignoreNotification,
    ...config
  }: WrapperConfig<T>,
) {
  auth = auth ?? true;

  return useSWR<T>(
    enable ? (key ?? '') : null,
    () => {
      const extraHeader = (body as Record<string, unknown>)
        ?.extraHeader as Record<string, string>;

      if (!(body instanceof FormData) && body?.extraHeader) {
        delete body.extraHeader;
      }

      const header = {
        ...(auth &&
          {
            // Authorization: `Bearer ${session?.accessToken}`,
          }),
        ...extraHeader,
        ...config?.extraHeader,
      };

      return new Promise((resolve, reject) => {
        fetcher<T>(
          url ?? (typeof key === 'string' ? key : ''),
          method ?? METHOD.GET,
          body,
          header,
          noEndPoint,
        )
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(err as Error);
          });
      });
    },
    {
      ...config,
      onError(err, swrKey) {
        const error: ApiResponse<T> = err as ApiResponse<T>;

        config?.onError?.(err, swrKey, config as any);
        if (notification && !ignoreNotification) {
          addToast({
            title: notification.title,
            description: error?.error?.message,
            color: 'danger',
          });
        }
      },
      onSuccess(data, swrKey) {
        config?.onSuccess?.(data, swrKey, config as any);
        if (notification && !ignoreNotification) {
          addToast({
            title: notification.title,
            description: notification.message,
            color: 'success',
          });
        }
      },
    },
  );
}

interface MutationConfig<T>
  extends SWRMutationConfiguration<
    RestResponse<T>,
    RestError & Record<string, unknown>
  > {
  url?: string;
  method?: METHOD;
  componentId?: string;
  loading?: boolean;
  noEndpoint?: boolean;
  noAuth?: boolean;
  extraHeader?: Record<string, string>;
  resultKey?: string;
  notification?: {
    title?: string;
    message?: string;
  };
  ignoreNotification?: boolean;
}

export const useMutation = <T = Record<string, unknown>,>(
  key: string,
  {
    url,
    method,
    noEndpoint,
    resultKey,
    notification,
    ignoreNotification,
    ...config
  }: MutationConfig<T>,
) => {
  return useSWRMutation(
    key,
    (
      swrKey: string,
      { arg: body }: { arg?: Record<string, unknown> | FormData },
    ) =>
      new Promise<RestResponse<T>>((resolve, reject) => {
        const extraHeader = (body as Record<string, unknown>)
          ?.extraHeader as Record<string, string>;

        if (!(body instanceof FormData) && body?.extraHeader) {
          delete body.extraHeader;
        }

        fetcher<T>(
          url ?? swrKey,
          method ?? METHOD.POST,
          body as Record<string, unknown>,
          config.noAuth
            ? undefined
            : {
                // ...(session?.accessToken && {
                //   Authorization: `Bearer ${session?.accessToken}`,
                // }),
                ...extraHeader,
                ...config?.extraHeader,
              },
          noEndpoint,
        )
          .then((data) => {
            resolve(data);
            if (resultKey) {
              mutate(resultKey, {
                success: true,
                response: data,
                request: body,
              });
            }
          })
          .catch((err) => {
            reject(err as Error);
            if (resultKey) {
              mutate(resultKey, {
                success: false,
              });
            }
          })
          .finally(() => {});
      }),
    {
      onError(err, swrKey) {
        const error: ApiResponse<T> = err as ApiResponse<T>;

        config?.onError?.(err, swrKey, config as any);
        if (notification && !ignoreNotification) {
          addToast({
            title: notification.title,
            description: error?.error?.message,
            color: 'danger',
          });
        }
      },
      onSuccess(data, swrKey) {
        config?.onSuccess?.(data, swrKey, config as any);
        if (notification && !ignoreNotification) {
          addToast({
            title: notification.title,
            description: notification.message,
            color: 'success',
          });
        }
      },
    },
  );
};
