import * as QueryKeys from "@/lib/types/QueryKeys";
import { deleteIndicatorMetricRestrictionFn, getMetricRestrictionsByIndFn, removeDimensionMetricRestrictionFn, saveAllMetricRestrictionFn } from "./query";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { isDefined } from "@/lib/helpers/safe-navigation";
import { MetricRestrictionEntity } from "@/app/analysis/components/manage-analysis-type/types";

export const useMetricRestrictionsQuery = (props: {indicatorId?: number}) => {

  const { isLoading: loadingMetricRestrictions, isError, data: metricRestrictions, refetch: reloadMetricRestrictions } = useQuery(
    [QueryKeys.Keys.FETCH_METRIC_RESTRICTIONS, props.indicatorId],
    () => getMetricRestrictionsByIndFn(props.indicatorId!),
    { enabled: isDefined(props.indicatorId) }
  );

  return {
    metricRestrictions,
    reloadMetricRestrictions,
    loadingMetricRestrictions,
    isError
  }
}

export const useMetricRestrictionsActionsMutation = () => {
  
  const queryClient = useQueryClient();

  const { mutate: removeRestriction, isLoading: removingRestriction } = useMutation(
    QueryKeys.Keys.DELETE_METRIC_RESTRICTIONS,
    (variables: {restriction: MetricRestrictionEntity}) =>  removeDimensionMetricRestrictionFn(variables.restriction),
    {
      onSuccess: (_, variables) => {  
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.Keys.FETCH_METRIC_RESTRICTIONS, variables.restriction.indicatorId]
        });
      },
      onError: (error) => {
        // handle error
      },
    }
  );

  const { mutate: removeAllRestriction, isLoading: removingAllRestriction } = useMutation(
    QueryKeys.Keys.DELETE_ALL_RESTRICTIONS,
    (variables: {indicatorId: number, onSuccess?: () => void}) =>  deleteIndicatorMetricRestrictionFn(variables.indicatorId),
    {
      onSuccess: (_, variables) => {  
        queryClient.invalidateQueries({queryKey: [QueryKeys.Keys.FETCH_METRIC_RESTRICTIONS, variables.indicatorId]});
        variables.onSuccess?.()
      },
      onError: (error) => {
        // handle error
      },
    }
  );



  const { mutate: saveRestrictions, isLoading: savingRestrictions } = useMutation(
    QueryKeys.Keys.SAVE_RESTRICTIONS,
    (variables: {restrictions: MetricRestrictionEntity[], onSuccess?: () => void}) =>  saveAllMetricRestrictionFn(variables.restrictions),
    {
      onSuccess: (_, variables) => {  
        queryClient.invalidateQueries({queryKey: [QueryKeys.Keys.FETCH_METRIC_RESTRICTIONS, variables.restrictions[0].indicatorId]})
        //queryClient.invalidateQueries({queryKey: [QueryKeys.Keys.FETCH_ANALYSIS_TABLE, variables.restrictions[0].indicatorId]});
        variables.onSuccess?.() 
      },
      onError: (error) => {
        // handle error
      },
    }
  );


  return {
    saveRestrictions,
    savingRestrictions,
    removeRestriction,
    removingRestriction,
    removeAllRestriction,
    removingAllRestriction
  }

}