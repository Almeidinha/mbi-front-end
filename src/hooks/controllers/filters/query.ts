import { IndicatorDTO } from "@/lib/types/Analysis";
import { FilterBuilderInput, FiltersDTO } from "@/lib/types/Filter";
import  AxiosClient  from "@/services/axios";

export const getAnalysisFilters = async (indicatorId: number) => {
  const response = await AxiosClient.get<FiltersDTO>(`/filters/${indicatorId}`);
  return response.data;
};

export const getAnalysisFilterFromDto = async (dto: IndicatorDTO) => {
  const response = await AxiosClient.post<FiltersDTO>(`/filters/${dto.id}`, dto)
  return response.data;
};

export const updateFilter = async (indicatorId: number, dto: FiltersDTO) => {
  const response = await AxiosClient.post<void>(`/filters/${indicatorId}/update`, dto)
  return response.data;
};

export const buildFilters = async (input: FilterBuilderInput) => {
  const response = await AxiosClient.post<FiltersDTO>('/filters/build', input, {
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
  return response.data;
};

export const removeFilter = async (input: FilterBuilderInput) => {
  const response = await AxiosClient.post<FiltersDTO>('/filters/remove', input, {
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
  return response.data;
};