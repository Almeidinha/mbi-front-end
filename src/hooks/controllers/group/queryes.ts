import { UserGroup } from "@/lib/types/Group";
import { axiosClient } from "@/services/axios";

export const getAllUsersGroupsFn = async () => {
    const response = await axiosClient.get<UserGroup[]>('/group/all');
    return response.data;
  };
  
  export const deleteUsersGroupFn = async (groupId: number) => {
    const response = await axiosClient.delete(`/group/${groupId}`)  
    return response.data;
  };
  
  export const patchUsersGroupFn = async (group: UserGroup) => {
    const response = await axiosClient.put<UserGroup>(`/group/${group.id}`, group)
    return response.data;
  };
  
  export const addUsersGroupFn = async (group: UserGroup) => {
    const response = await axiosClient.post<UserGroup>('/group', group)
    return response.data;
  };
  
  export const getUsersGroupByIdFn = async (groupId: number) => {
    const response = await axiosClient.get<UserGroup>(`/group/${groupId}`)
    return response.data;
  };
  