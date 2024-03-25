import * as QueryKeys from "@/lib/types/QueryKeys";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { buildFilters, getAnalysisFilterFromDto, getAnalysisFilters, removeFilter, updateFilter } from "./query";
import { IndicatorDTO } from "@/lib/types/Analysis";
import { isDefined } from "@/lib/helpers/safe-navigation";
import { FilterBuilderInput, FiltersDTO } from "@/lib/types/Filter";

export const useIndFilterController = (props: {indicatorId: number}) => {

  const {data: indFilters, isLoading: loadingIndFilters, error: inFiltersError} = useQuery(
    [QueryKeys.Keys.FETCH_FILTERS, props.indicatorId],
    () =>  getAnalysisFilters(props.indicatorId!),
    { enabled: isDefined(props.indicatorId) }
  );

 
  return {
    indFilters,
    loadingIndFilters,
    inFiltersError,
  };

}


export const useIndFilterMutationController = () => {

  const queryClient = useQueryClient();

  const { mutate: getFilterFromPost, isLoading: isPostingFilter, data: filterFromPost } =  useMutation(
    [QueryKeys.Keys.FETCH_FILTERS_FROM_DTO],
    (dto: IndicatorDTO) => getAnalysisFilterFromDto(dto),
    {
      onSuccess: () => {  
        
      },
      onError: (error) => {
        console.log('error > ', error)
      },
    }
  );

  const { mutate: updateIndFilter, isLoading: updatingFilter } =  useMutation(
    [QueryKeys.Keys.UPDATE_FILTER],
    (variables: {indicatorId: number, dto: FiltersDTO, onSuccess?: () => void}) => updateFilter(variables.indicatorId, variables.dto),
    {
      onSuccess: (_, variables) => {
        variables.onSuccess?.();        
        queryClient.invalidateQueries({queryKey: [QueryKeys.Keys.FETCH_ANALYSIS_TABLE, variables.indicatorId]})
        queryClient.invalidateQueries({queryKey: [QueryKeys.Keys.FETCH_FILTERS, variables.indicatorId]})
      },
      onError: (error) => {
        console.log('error > ', error)
      },
    }
  );

  const {data: buildedFilter, mutate: buildFilterMutation, isLoading: buildingFilter, error: filtersError} = useMutation(
    [QueryKeys.Keys.BUILD_FILTER],
    (variables: {input: FilterBuilderInput, indicatorId: number}) => buildFilters(variables.input),
    {
      onSuccess: (_, variables) => {  
        //queryClient.invalidateQueries({queryKey: [QueryKeys.Keys.FETCH_FILTERS, variables.indicatorId]})
      },
      onError: (error) => {
        console.log('error > ', error)
      },
    }
  );

  const {data: filtersAfterRemove, mutate: removeFilterMutation, isLoading: removingFilter, error: removingError} = useMutation(
    [QueryKeys.Keys.REMOVE_FILTER],
    (variables: {input: FilterBuilderInput, indicatorId: number}) => removeFilter(variables.input),
    {
      onSuccess: (_, variables) => {  
        //queryClient.invalidateQueries({queryKey: [QueryKeys.Keys.FETCH_FILTERS, variables.indicatorId]})
      },
      onError: (error) => {
        console.log('error > ', error)
      },
    }
  );


  return {
    removeFilterMutation,
    buildFilterMutation,
    filtersAfterRemove,
    buildedFilter,
    buildingFilter,
    filtersError,
    updateIndFilter,
    updatingFilter
  }
}