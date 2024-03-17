import { BIInterface } from "@/lib/types/Interface";
import  AxiosClient  from "@/services/axios";

export const getAllInterfacesFn = async () => {
  const response = await AxiosClient.get<BIInterface[]>('/interfaces/all');
  return response.data;
};

export const getInterfaceIdFn = async (userId: number) => {
  const response = await AxiosClient.get<BIInterface>(`/user/${userId}`)
  return response.data;
};