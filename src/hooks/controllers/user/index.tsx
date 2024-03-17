"use client"

import { isDefined } from "@/lib/helpers/safe-navigation";
import { User } from "@/lib/types/User";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { addUsersFn, deleteUserFn, getAllUsersFn, getUserByIdFn, getUserByIdMail, patchUserFn, updateUserIndFavoriteFn } from "./queries";
import * as QueryKeys from "@/lib/types/QueryKeys";
import { Session } from "next-auth";


export const useUserController = (props: {userId?: number}) => {

  const queryClient = useQueryClient();
  
  const {data: user, isLoading: loadingUser, refetch: refetchUser} = useQuery(
    [QueryKeys.Keys.FETCH_USER],
    () =>  getUserByIdFn(props.userId!),
    { enabled: isDefined(props.userId) }
  );
  
  const { mutate: addUser, isLoading: isAddingUser } =  useMutation(
    QueryKeys.Keys.ADD_USER,
    (user: User) => addUsersFn(user),
    {
      onSuccess: () => {  
        queryClient.invalidateQueries([QueryKeys.Keys.FETCH_USERS]);
      },
      onError: (error) => {
        // handle error
      },
    }
  );


  const { mutate: editUser, isLoading: isEditingUser } = useMutation(
    QueryKeys.Keys.PATCH_USER,
    (user: User) =>  patchUserFn(user),
      {
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: [QueryKeys.Keys.FETCH_USERS]}),
          queryClient.invalidateQueries({queryKey: [QueryKeys.Keys.FETCH_USER]})
        },
        onError: (error) => {
          // handle error
        },
      }
  );

  const { mutate: deleteUser, isLoading: isDeletingUser } = useMutation(
    QueryKeys.Keys.DELETE_USER,
    (variables: {userId: number}) =>  deleteUserFn(variables.userId),
    {
      onSuccess: () => {  
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.Keys.FETCH_USERS]
        });
      },
      onError: (error) => {
        // handle error
      },
    }
  );

  return {
    user,
    isAddingUser,
    isEditingUser,
    addUser,
    loadingUser,
    editUser,
    deleteUser,
    refetchUser,
    isDeletingUser,
  }

}

export const useUserListController = () => {

  const { isLoading: loadingUsers, isError, data: users, refetch: reloadUsers } = useQuery(
    QueryKeys.Keys.FETCH_USERS,
    () => getAllUsersFn(),
    { enabled: true }
  );

  return {
    users,
    reloadUsers,
    loadingUsers,
    isError
  }
}


export const useUserIndController = () => {

  const queryClient = useQueryClient();

  const { mutate: updateUserIndFavorite, isLoading: updatingUserIndFavorite } = useMutation(
    QueryKeys.Keys.UPDATE_USER_IND_FAVORITE,
    (variables: {userId: number, indicatorId: number, onSuccess?: () => void}) =>  updateUserIndFavoriteFn(variables.userId, variables.indicatorId),
    {
      onSuccess: (_, variables) => {  
        variables.onSuccess?.()
      },
      onError: (error) => {
        // handle error
      },
    }
  );

  return {
    updateUserIndFavorite,
    updatingUserIndFavorite
  }
  
}

export const useUserSessionController = (email?: string) => {

  const { isLoading: loadingUser, isError, data: user, refetch: reloadUsers } = useQuery(
    QueryKeys.Keys.FETCH_SESSION_USER,
    () => getUserByIdMail(email!),
    { enabled: false}
  );

  return {
    user,
    reloadUsers,
    loadingUser,
    isError
  }
}