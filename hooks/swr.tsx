/* eslint-disable prettier/prettier */
import type { SWRMutationConfiguration } from 'swr/mutation';

import { addToast } from '@heroui/react';
import useSWR from 'swr';
import { mutate, PublicConfiguration } from 'swr/_internal';
import useSWRMutation from 'swr/mutation';

import { useSession } from './auth/useSession';

import { METHOD } from '@/common';
import { RestError, RestResponse } from '@/interfaces/response';
import { fetcher } from '@/common/restApi';
import { ApiResponse } from '@/interfaces';

interface WrapperConfig<T>
  extends Partial<PublicConfiguration<T, RestError, (arg: string) => any>> {
  url?: string | (() => string);
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
  ignoreSuccessNotification?: boolean;
}

export function useSWRWrapper<T = Record<string, unknown>>(
  key: string | (() => string),
  {
    url,
    method,
    body,
    auth,
    noEndPoint,
    enable = true,
    notification,
    ignoreSuccessNotification = true,
    ...config
  }: WrapperConfig<T>,
) {
  auth = auth ?? true;

  const { sessionInfo } = useSession();

  return useSWR<T>(
    enable ? (key ?? '') : null,
    () => {
      const extraHeader = (body as Record<string, unknown>)
        ?.extraHeader as Record<string, string>;

      if (!(body instanceof FormData) && body?.extraHeader) {
        delete body.extraHeader;
      }

      const header = {
        ...(auth && {
          Authorization: `Bearer ${sessionInfo?.data?.accessToken}`,
        }),
        ...extraHeader,
        ...config?.extraHeader,
      };

      const urlKey: string =
        typeof url === 'function'
          ? url()
          : url
            ? url
            : typeof key === 'function'
              ? key()
              : key;

      return new Promise((resolve, reject) => {
        fetcher<T>(urlKey, method ?? METHOD.GET, body, header, noEndPoint)
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
        if (notification) {
          addToast({
            title: notification.title,
            description: error?.error?.message,
            color: 'danger',
          });
        }
      },
      onSuccess(data, swrKey) {
        config?.onSuccess?.(data, swrKey, config as any);
        if (notification && !ignoreSuccessNotification) {
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
  url?: string | (() => string);
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
  ignoreSuccessNotification?: boolean;
}

export const useMutation = <T = Record<string, unknown>,>(
  key: string,
  {
    url,
    method,
    noEndpoint,
    resultKey,
    notification,
    ignoreSuccessNotification,
    ...config
  }: MutationConfig<T>,
) => {
  const { sessionInfo } = useSession();

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

        const urlKey = typeof url === 'function' ? url() : (url ?? key);

        fetcher<T>(
          urlKey ?? swrKey,
          method ?? METHOD.POST,
          body as Record<string, unknown>,
          config.noAuth
            ? undefined
            : {
                ...(sessionInfo?.data?.accessToken && {
                  Authorization: `Bearer ${sessionInfo?.data?.accessToken}`,
                }),
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
        if (notification) {
          addToast({
            title: notification.title,
            description: error?.error?.message,
            color: 'danger',
          });
        }
      },
      onSuccess(data, swrKey) {
        config?.onSuccess?.(data, swrKey, config as any);
        if (notification && !ignoreSuccessNotification) {
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
