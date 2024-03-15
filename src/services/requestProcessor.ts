"use client"

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
  UseQueryResult,
  UseMutationResult,
} from 'react-query';

type QueryFunction<TData, TKey extends any[]> = (...args: TKey) => Promise<TData>;

export function useRequestProcessor() {
  
  const queryClient = useQueryClient();

  function useClientQuery <TData, TKey extends QueryKey>(
    key: TKey,
    queryFunction: QueryFunction<TData, any[]>,
    options?: any,
  ): UseQueryResult<TData, any> {
    return useQuery<TData, any, TData, [TKey]>({
      queryKey: [key],
      queryFn: queryFunction as (...args: [TKey]) => Promise<TData>,
      ...options,
    });
  }

  function useClientMutation <TData, TKey extends QueryKey>(
    key: TKey,
    mutationFunction: QueryFunction<TData, any[]>,
    options?: any,
  ): UseMutationResult<TData, any, TKey, [TKey]> {
    return useMutation<TData, any, TKey, [TKey]>({
      mutationKey: [key],
      mutationFn: mutationFunction as (...args: [TKey]) => Promise<TData>,
      onSettled: () => queryClient.invalidateQueries(key),
      ...options,
    });
  }

  return { useClientQuery, useClientMutation };
}