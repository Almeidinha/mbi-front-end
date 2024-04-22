import * as QueryKeys from "@/lib/types/QueryKeys";
import { useQuery } from "react-query";
import { getAllInterfacesFn } from "./query";

export const useInterfaceListQuery = () => {

  const { isLoading: loadingInterfaces, isError, data: biInterfaces, refetch: reloadInterfaces } = useQuery(
    QueryKeys.Keys.FETCH_INTERFACES,
    () => getAllInterfacesFn(),
    { enabled: true }
  );

  return {
    biInterfaces,
    reloadInterfaces,
    loadingInterfaces,
    isError
  }
}