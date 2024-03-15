import { SetStateAction, useCallback, useState } from "react";
import {
  QueryKey,
  useQuery,
  UseQueryResult,
} from "react-query";

type FetchCallback = (value: SetStateAction<boolean>) => void;
export default function useLazyQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  key: TQueryKey,
  fn: any,
  options: any = {}
): readonly [FetchCallback, UseQueryResult<unknown, unknown>] {
  const [enabled, setEnabled] = useState(false);
  const query: UseQueryResult<TData, TError> = useQuery<TData, TError>(
    key,
    fn,
    { ...options, enabled }
  );

  return [
    useCallback<FetchCallback>(() => setEnabled(true), []),
    query,
    
  ] as const;
}