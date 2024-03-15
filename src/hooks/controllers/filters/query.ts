import { BIIndLogicDTO } from "@/lib/types/Analysis";
import { FilterBuilderInput, FiltersDTO } from "@/lib/types/Filter";
import { axiosClient } from "@/services/axios";

export const getAnalysisFilters = async (indicatorId: number) => {
  const response = await axiosClient.get<FiltersDTO>(`/filters/${indicatorId}`);
  return response.data;
};

export const getAnalysisFilterFromDto = async (dto: BIIndLogicDTO) => {
  const response = await axiosClient.post<FiltersDTO>(`/filters/${dto.id}`, dto)
  return response.data;
};

export const updateFilter = async (indicatorId: number, dto: FiltersDTO) => {
  const response = await axiosClient.post<void>(`/filters/${indicatorId}/update`, dto)
  return response.data;
};

export const buildFilters = async (input: FilterBuilderInput) => {
  const response = await axiosClient.post<FiltersDTO>('/filters/build', input, {
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
  return response.data;
};

export const removeFilter = async (input: FilterBuilderInput) => {
  const response = await axiosClient.post<FiltersDTO>('/filters/remove', input, {
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
  return response.data;
};