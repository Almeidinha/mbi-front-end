import { Connection } from "@/lib/types/Connection";
import { axiosClient } from "@/services/axios";

export const getAllConnectionsFn = async () => {
  const response = await axiosClient.get<Connection[]>('/connection/list');
  return response.data;
};

export const deleteConnectionFn = async (tenantId: string) => {
  const response = await axiosClient.delete(`/connection/${tenantId}`)  
  return response.data;
};

export const patchConnectionFn = async (connection: Connection) => {
  const response = await axiosClient.patch<Connection>(`/connection/${connection.tenantId}`, connection)
  return response.data;
};

export const putConnectionFn = async (connection: Connection) => {
  const response = await axiosClient.put<Connection>(`/connection/${connection.tenantId}`, connection)
  return response.data;
};

export const addConnectionFn = async (connection: Connection) => {
  const response = await axiosClient.post<Connection>('/connection', connection)
  return response.data;
};

export const getConnectionByIdFn = async (tenantId: string) => {
  const response = await axiosClient.get<Connection>(`/connection/${tenantId}`)
  return response.data;
};
