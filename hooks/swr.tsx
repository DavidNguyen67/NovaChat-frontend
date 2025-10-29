import type { SWRMutationConfiguration } from 'swr/mutation';

import useSWR from 'swr';
/* eslint-disable prettier/prettier */
import { mutate, PublicConfiguration } from 'swr/_internal';
import useSWRMutation from 'swr/mutation';

import { METHOD } from '@/common';
import { RestError, RestResponse } from '@/interfaces/response';
import { fetcher } from '@/common/restApi';

export function useSWRWrapper<T = Record<string, unknown>>(
  key: string | null | (() => string | string[] | null) | string[],
  {
    url,
    method,
    body,
    auth,
    noEndPoint,
    enable = true,
    ...config
  }: {
    url?: string;
    method?: METHOD;
    body?: Record<string, unknown>;
    auth?: boolean;
    enable?: boolean;
    noEndPoint?: boolean;
    extraHeader?: Record<string, string>;
  } & Partial<PublicConfiguration<T, RestError, (arg: string) => any>> = {},
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
        config?.onError?.(err, swrKey, config as any);
      },
    },
  );
}

export const useMutation = <T = Record<string, unknown>,>(
  key: string,
  {
    url,
    method,
    noEndpoint,
    resultKey,
    ...options
  }: {
    url?: string;
    method?: METHOD;
    componentId?: string;
    loading?: boolean;
    noEndpoint?: boolean;
    noAuth?: boolean;
    extraHeader?: Record<string, string>;
    resultKey?: string;
  } & SWRMutationConfiguration<
    RestResponse<T>,
    RestError & Record<string, unknown>
  >,
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
          options.noAuth
            ? undefined
            : {
                // ...(session?.accessToken && {
                //   Authorization: `Bearer ${session?.accessToken}`,
                // }),
                ...extraHeader,
                ...options?.extraHeader,
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
      onError(err, swrKey, config) {
        options.onError?.(err, swrKey, config as any);
      },
      onSuccess(data, swrKey, config) {
        options.onSuccess?.(data, swrKey, config as any);
      },
    },
  );
};
