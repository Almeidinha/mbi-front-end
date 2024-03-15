import * as QueryKeys from "@/lib/types/QueryKeys";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { addAnalysisFn, addSequenceFn, deleteAnalysisFn, getAnalysisByIdFn, getAnalysisDtoListFn, getAnalysisTableFn, putAnalysisFn } from "./query";
import { isDefined } from "@/lib/helpers/safe-navigation";
import { AnalysisInput } from "@/wizard/types";

export const useAnalysisController = (props: {analysisId?: number}) => {
  
  const queryClient = useQueryClient();

  const {data: analysis, isLoading: loadingAnalysis, error: errorLoading} = useQuery(
    [QueryKeys.Keys.FETCH_ANALYSIS, props.analysisId!],
    () =>  getAnalysisByIdFn(props.analysisId!),
    { enabled: isDefined(props.analysisId) }
  );
  
  const { mutate: addAnalysis, isLoading: isAddingAnalysis, data: newIndicator, isSuccess: indicatorCreated } =  useMutation(
    QueryKeys.Keys.ADD_ANALYSIS,
    (analysis: AnalysisInput) => addAnalysisFn(analysis),
    {
      onSuccess: () => {  
        queryClient.invalidateQueries(QueryKeys.Keys.FETCH_ANALYSIS_DTO_LIST);
      },
      onError: (error) => {
        console.log('error > ', error)
      },
    }
  );

  const { mutate: editAnalysis, isLoading: isEditingAnalysis, data: updatedIndicator, isSuccess: indicatorUpdated } = useMutation(
    QueryKeys.Keys.PUT_ANALYSIS,
    (analysis: AnalysisInput) =>  putAnalysisFn(analysis),
      {
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: [QueryKeys.Keys.FETCH_ANALYSIS, analysis?.id]})
        },
        onError: (error) => {
          // handle error
        },
      }
  );

  const { mutate: deleteAnalysis, isLoading: isDeletingAnalysis } = useMutation(
    QueryKeys.Keys.DELETE_ANALYSIS,
    (variables: {analysisId: number}) =>  deleteAnalysisFn(variables.analysisId),
    {
      onSuccess: () => {  
        queryClient.invalidateQueries({
          //queryKey: [QueryKeys.Keys.DELETE_ANALYSIS]
        });
      },
      onError: (error) => {
        // handle error
      },
    }
  );

  const { mutate: toggleSequence, isLoading: isTogglingSequenceSequence, isSuccess: sequenceChanged, data: sequenceData } = useMutation(
    QueryKeys.Keys.ADD_SEQUENCE,
    (variables: {analysisId: number, add: boolean}) => addSequenceFn(variables.analysisId, variables.add),
    {
      onSuccess: (_, variables) => {
        console.log('variables > ', variables)  
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.Keys.FETCH_ANALYSIS_TABLE, variables.analysisId],
        });
      },
      onError: (error) => {
        // handle error
      },
    }
  );

  return {
    analysis,
    editAnalysis,
    isEditingAnalysis,
    loadingAnalysis,
    errorLoading,
    indicatorCreated,
    updatedIndicator,
    indicatorUpdated,
    newIndicator,
    addAnalysis,
    isAddingAnalysis,
    deleteAnalysis,
    isDeletingAnalysis,
    toggleSequence,
    sequenceData,
    isTogglingSequenceSequence,
    sequenceChanged
  }

}

export const useAnalysisDtoListController = () => {

  const { isLoading: loadingAnalysis, isError, data: analysis, refetch: reloadAnalysis } = useQuery(
    QueryKeys.Keys.FETCH_ANALYSIS_DTO_LIST,
    () => getAnalysisDtoListFn(),
    { enabled: true }
  );

  return {
    analysis,
    reloadAnalysis,
    loadingAnalysis,
    isError
  }
  
}

export const useAnalysisTableController = (props: {analysisId?: number}) => {

  const { isLoading: loadingAnalysisResult, isError, data: analysisResult, refetch: reloadAnalysisResult, isFetching:  fetchingAnalysisResult} = useQuery(
    [QueryKeys.Keys.FETCH_ANALYSIS_TABLE, props.analysisId],
    () => getAnalysisTableFn(props.analysisId!),
    { enabled: isDefined(props.analysisId) }
  );

  return {
    isError,
    analysisResult,
    reloadAnalysisResult,
    fetchingAnalysisResult,
    loadingAnalysisResult,
  }
  
}