
import { BIArea } from "@/lib/types/Area";
import  AxiosClient  from "@/services/axios";

export const getAllAreasFn = async () => {
  const response = await AxiosClient.get<BIArea[]>('/area/all');
  return response.data;
};

export const getAreaByIdFn = async (areaId: number) => {
  const response = await AxiosClient.get<BIArea>(`/area/${areaId}`)
  return response.data;
};

export const deleteAreaFn = async (areaId: number) => {
  const response = await AxiosClient.delete(`/area/${areaId}`)  
  return response.data;
};


export const addAreaFn = async (area: BIArea) => {
  const response = await AxiosClient.post<BIArea>('/area', area)
  return response.data;
};

export const putAreaFn = async (area: BIArea) => {
  const response = await AxiosClient.put<BIArea>(`/area/${area.id}`, area)
  return response.data;
};