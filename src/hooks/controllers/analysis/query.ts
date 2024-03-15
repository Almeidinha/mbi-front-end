import { axiosClient } from "@/services/axios";
import { AnalysisInput, BIIndDTO } from "@/wizard/types";

export const getAnalysisDtoListFn = async () => {
  const response = await axiosClient.get<BIIndDTO[]>('/indicator/list');
  return response.data;
};

export const getAnalysisDtoFn = async (analysisId: number) => {
  const response = await axiosClient.get<BIIndDTO[]>(`/indicator/${analysisId}`);
  return response.data;
};

export const getAnalysisByIdFn = async (analysisId: number) => {
  const response = await axiosClient.get<AnalysisInput>(`/analysis/${analysisId}`)
  return response.data;
};


export const addAnalysisFn = async (analysisInput: AnalysisInput) => {
  const response = await axiosClient.post<AnalysisInput>('/analysis/new', analysisInput)
  return response.data;
};

export const deleteAnalysisFn = async (analysisId: number) => {
  const response = await axiosClient.delete(`/analysis/${analysisId}`)  
  return response.data;
};

export const putAnalysisFn = async (analysis: AnalysisInput) => {
  const response = await axiosClient.put<AnalysisInput>(`/analysis/${analysis.id}`, analysis)
  return response.data;
};

export const getAnalysisTableFn = async (analysisId: number) => {
  const response = await axiosClient.get<any>(`/analysis/${analysisId}/table`);
  return response.data;
};

export const addSequenceFn = async (analysisId: number, toggle: boolean) => {
  const response = await axiosClient.get<any>(`/indicator/${analysisId}/sequence/${toggle}`);
  return response.data;
};