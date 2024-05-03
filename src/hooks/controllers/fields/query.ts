import { BIAnalysisFieldDTO } from "@/lib/types/Filter";
import  AxiosClient  from "@/services/axios";

export const putFieldFn = async (field: Partial<BIAnalysisFieldDTO>) => {
  const response = await AxiosClient.put<BIAnalysisFieldDTO>('/field', field)
  return response.data;
};

export const putFieldsFn = async (fields: Partial<BIAnalysisFieldDTO>[]) => {
  const response = await AxiosClient.put<BIAnalysisFieldDTO[]>('/field/list', fields)
  return response.data;
};

export const getFieldByIdFn = async (indicatorId: number, fieldId: number) => {
  const response = await AxiosClient.get<BIAnalysisFieldDTO>(`/field/${indicatorId}/${fieldId}`)
  return response.data;
};
