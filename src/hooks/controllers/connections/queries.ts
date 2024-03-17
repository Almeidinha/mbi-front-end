import { Connection } from "@/lib/types/Connection";
import  AxiosClient  from "@/services/axios";

export const getAllConnectionsFn = async () => {
  const response = await AxiosClient.get<Connection[]>('/connection/list');
  return response.data;
};

export const deleteConnectionFn = async (tenantId: string) => {
  const response = await AxiosClient.delete(`/connection/${tenantId}`)  
  return response.data;
};

export const patchConnectionFn = async (connection: Connection) => {
  const response = await AxiosClient.patch<Connection>(`/connection/${connection.tenantId}`, connection)
  return response.data;
};

export const putConnectionFn = async (connection: Connection) => {
  const response = await AxiosClient.put<Connection>(`/connection/${connection.tenantId}`, connection)
  return response.data;
};

export const addConnectionFn = async (connection: Connection) => {
  const response = await AxiosClient.post<Connection>('/connection', connection)
  return response.data;
};

export const getConnectionByIdFn = async (tenantId: string) => {
  const response = await AxiosClient.get<Connection>(`/connection/${tenantId}`)
  return response.data;
};
