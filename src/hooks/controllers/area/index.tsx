import * as QueryKeys from "@/lib/types/QueryKeys";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { addAreaFn, deleteAreaFn, getAllAreasFn, getAreaByIdFn, putAreaFn } from "./query";
import { isDefined } from "@/lib/helpers/safe-navigation";
import { BIArea } from "@/lib/types/Area";

export const useAreaListQuery = () => {

  const { isLoading: loadingAreas, isError, data: areas, refetch: reloadAreas } = useQuery(
    QueryKeys.Keys.FETCH_AREA_LIST,
    () => getAllAreasFn(),
    { enabled: true }
  );

  return {
    areas,
    reloadAreas,
    loadingAreas,
    isError
  }
}

export const useAreaQuery = (props: {areaId?: number}) => {

  const {data: biArea, isLoading: loadingArea} = useQuery(
    [QueryKeys.Keys.FETCH_AREA, props.areaId!],
    () =>  getAreaByIdFn(props.areaId!),
    { enabled: isDefined(props.areaId) }
  );

  return {
    biArea,
    loadingArea,
  }
}

export const useAreaMutation = () => {
  
  const queryClient = useQueryClient();
  
  const { mutate: addArea, isLoading: isAddingArea } =  useMutation(
    QueryKeys.Keys.ADD_AREA,
    (biArea: BIArea) => addAreaFn(biArea),
    {
      onSuccess: () => {  
        queryClient.invalidateQueries([QueryKeys.Keys.ADD_AREA]);
      },
      onError: (error) => {
        // handle error
      },
    }
  );

  const { mutate: editArea, isLoading: isEditingArea } = useMutation(
    QueryKeys.Keys.PUT_AREA,
    (area: BIArea) =>  putAreaFn(area),
      {
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: QueryKeys.Keys.FETCH_AREA_LIST})
        },
        onError: (error) => {
          // handle error
        },
      }
  );

  const { mutate: deleteArea, isLoading: isDeletingArea } = useMutation(
    QueryKeys.Keys.DELETE_AREA,
    (variables: {areaId: number}) =>  deleteAreaFn(variables.areaId),
    {
      onSuccess: () => {  
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.Keys.DELETE_AREA]
        });
      },
      onError: (error) => {
        // handle error
      },
    }
  );

  return {
    editArea,
    isEditingArea,
    addArea,
    isAddingArea,
    deleteArea,
    isDeletingArea
  }

}