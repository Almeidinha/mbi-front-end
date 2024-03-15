import { BIInterface } from "@/lib/types/Interface";
import { axiosClient } from "@/services/axios";

export const getAllInterfacesFn = async () => {
  const response = await axiosClient.get<BIInterface[]>('/interfaces/all');
  return response.data;
};

export const getInterfaceIdFn = async (userId: number) => {
  const response = await axiosClient.get<BIInterface>(`/user/${userId}`)
  return response.data;
};