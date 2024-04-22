import { UserGroup } from "@/lib/types/Group";
import  AxiosClient  from "@/services/axios";

export const getAllUsersGroupsFn = async () => {
  const response = await AxiosClient.get<UserGroup[]>('/group/all');
  return response.data;
};

export const deleteUsersGroupFn = async (groupId: number) => {
  const response = await AxiosClient.delete(`/group/${groupId}`)  
  return response.data;
};

export const patchUsersGroupFn = async (group: UserGroup) => {
  const response = await AxiosClient.put<UserGroup>(`/group/${group.id}`, group)
  return response.data;
};

export const addUsersGroupFn = async (group: UserGroup) => {
  const response = await AxiosClient.post<UserGroup>('/group', group)
  return response.data;
};

export const getUsersGroupByIdFn = async (groupId: number) => {
  const response = await AxiosClient.get<UserGroup>(`/group/${groupId}`)
  return response.data;
};
  