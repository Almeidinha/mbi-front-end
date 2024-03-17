import { User } from "@/lib/types/User";
import AxiosClient from "@/services/axios";

export const getAllUsersFn = async () => {
  const response = await AxiosClient.get<User[]>('/user/all');
  return response.data;
};

export const deleteUserFn = async (userId: number) => {
  const response = await AxiosClient.delete(`/user/${userId}`)  
  return response.data;
};

export const patchUserFn = async (user: User) => {
  const response = await AxiosClient.patch<User>(`/user/${user.id}`, user)
  return response.data;
};

export const addUsersFn = async (user: User) => {
  const response = await AxiosClient.post<User>('/user', user)
  return response.data;
};

export const getUserByIdFn = async (userId: number) => {
  const response = await AxiosClient.get<User>(`/user/${userId}`)
  return response.data;
};

export const updateUserIndFavoriteFn = async (userId: number, indicatorId: number) => {
  const response = await AxiosClient.post<void>(`/user-ind/toggle-favorite/${userId}/${indicatorId}`)
  return response.data;
};
