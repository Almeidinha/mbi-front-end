import { isDefined } from "@/lib/helpers/safe-navigation";
import { UserGroup } from "@/lib/types/Group";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { addUsersGroupFn, deleteUsersGroupFn, getAllUsersGroupsFn, getUsersGroupByIdFn, patchUsersGroupFn } from "./queryes";
import * as QueryKeys from "@/lib/types/QueryKeys";

export const useUserGroupQuery = (props: {userGroupId?: number}) => {

  const {data: userGroup, isLoading: loadingUserGroup} = useQuery(
    [QueryKeys.Keys.FETCH_USER, props.userGroupId!],
    () =>  getUsersGroupByIdFn(props.userGroupId!),
    { enabled: isDefined(props.userGroupId) }
  );

  return {
    userGroup,
    loadingUserGroup,
  }

} 

export const useUserGroupMutation = () => {

  const queryClient = useQueryClient();
  
  const { mutate: addUserGroup, isLoading: isAddingUserGroup } =  useMutation(
    QueryKeys.Keys.ADD_USER_GROUP,
    (user: UserGroup) => addUsersGroupFn(user),
    {
      onSuccess: () => {  
        queryClient.invalidateQueries([QueryKeys.Keys.FETCH_USER_GROUPS]);
      },
      onError: (error) => {
        // handle error
      },
    }
  );


  const { mutate: editUserGroup, isLoading: isEditingUserGroup } = useMutation(
    QueryKeys.Keys.PATCH_USER,
    (user: UserGroup) =>  patchUsersGroupFn(user),
      {
        onSuccess: () => {  
          queryClient.invalidateQueries([QueryKeys.Keys.FETCH_USER_GROUPS]);
        },
        onError: (error) => {
          // handle error
        },
      }
  );

  const { mutate: deleteUserGroup, isLoading: isDeletingUserGroup } = useMutation(
    QueryKeys.Keys.DELETE_USER,
    (variables: {userGroupId: number}) =>  deleteUsersGroupFn(variables.userGroupId),
    {
      onSuccess: () => {  
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.Keys.FETCH_USER_GROUPS]
        });
      },
      onError: (error) => {
        // handle error
      },
    }
  );

  return {
    isAddingUserGroup,
    isEditingUserGroup,
    addUserGroup,
    editUserGroup,
    deleteUserGroup,
    isDeletingUserGroup,
  }

}

export const useUserGroupListQuery = () => {

  const { isLoading: loadingUserGroups, isError, data: userGroups, refetch: reloadUserGroups } = useQuery(
    QueryKeys.Keys.FETCH_USER_GROUPS,
    () => getAllUsersGroupsFn(),
    { enabled: true }
  );

  return {
    userGroups,
    reloadUserGroups,
    loadingUserGroups,
    isError
  }
}