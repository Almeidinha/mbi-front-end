import { User } from "@/lib/types/User";
import { axiosClient } from "@/services/axios";

export const getAllUsersFn = async () => {
  const response = await axiosClient.get<User[]>('/user/all');
  return response.data;
};

export const deleteUserFn = async (userId: number) => {
  const response = await axiosClient.delete(`/user/${userId}`)  
  return response.data;
};

export const patchUserFn = async (user: User) => {
  const response = await axiosClient.patch<User>(`/user/${user.id}`, user)
  return response.data;
};

export const addUsersFn = async (user: User) => {
  const response = await axiosClient.post<User>('/user', user)
  return response.data;
};

export const getUserByIdFn = async (userId: number) => {
  const response = await axiosClient.get<User>(`/user/${userId}`)
  return response.data;
};

export const updateUserIndFavoriteFn = async (userId: number, indicatorId: number) => {
  const response = await axiosClient.post<void>(`/user-ind/toggle-favorite/${userId}/${indicatorId}`)
  return response.data;
};
