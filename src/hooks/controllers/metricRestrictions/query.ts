import { MetricRestriction } from "@/app/analysis/components/manage-analysis-type/types";
import  AxiosClient  from "@/services/axios";

export const getMetricRestrictionsByIndFn = async (indicatorId: number) => {
  const response = await AxiosClient.get<MetricRestriction[]>(`/metric/restrictions/${indicatorId}/all`);
  return response.data;
};

export const deleteIndicatorMetricRestrictionFn = async (indicatorId: number) => {
  const response = await AxiosClient.delete<void>(`/metric/restrictions/${indicatorId}`)  
  return response.data;
};

export const deleteMetricRestrictionFn = async (indicatorId: number, metricId: number) => {
  const response = await AxiosClient.delete<void>(`/metric/restrictions/${indicatorId}/${metricId}`)  
  return response.data;
};

export const removeDimensionMetricRestrictionFn = async (restriction: MetricRestriction) => {
  const response = await AxiosClient.delete<void>(`/metric/restrictions/${restriction.indicatorId}/${restriction.metricId}/${restriction.dimensionId}`)  
  return response.data;
};

export const saveMetricRestrictionFn = async (restriction: MetricRestriction) => {
  const response = await AxiosClient.post<MetricRestriction>('/metric/restrictions/save', restriction)  
  return response.data;
};

export const saveAllMetricRestrictionFn = async (restrictions: MetricRestriction[]) => {
  const response = await AxiosClient.post<MetricRestriction>('/metric/restrictions/list/save', restrictions)  
  return response.data;
};