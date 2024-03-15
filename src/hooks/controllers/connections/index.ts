import * as QueryKeys from "@/lib/types/QueryKeys";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { addConnectionFn, deleteConnectionFn, getAllConnectionsFn, getConnectionByIdFn, patchConnectionFn, putConnectionFn } from "./queries";
import { isDefined } from "@/lib/helpers/safe-navigation";
import { Connection } from "@/lib/types/Connection";

export const useConnectionController = (props: {connectionId?: string}) => {
  
  const {data: connection, isLoading: loadingConnection, refetch: refetchConnection} = useQuery(
    [QueryKeys.Keys.FETCH_CONNECTION],
    () =>  getConnectionByIdFn(props.connectionId!),
    { enabled: isDefined(props.connectionId) }
  );

  return {
    connection,
    loadingConnection,
    refetchConnection
  }
}

export const useConnectionsController = () => {

  const { isLoading: loadingConnections, isError, data: connections, refetch: reloadConnections, isFetching: fetchingConnections} = useQuery(
    QueryKeys.Keys.FETCH_CONNECTIONS,
    getAllConnectionsFn, // test
    { enabled: true }
  );

  return {
    connections,
    reloadConnections,
    fetchingConnections,
    loadingConnections,
    isError
  }
}

export const useConnectionMutationController = () => {

  const queryClient = useQueryClient();
  
  const { mutate: addConnection, isLoading: isAddingConnection, isError: errorOnAdding, error: errorAdding } =  useMutation(
    QueryKeys.Keys.ADD_CONNECTION,
    (connection: Connection) => addConnectionFn(connection),
    {
      onSuccess: () => {  
        queryClient.invalidateQueries(QueryKeys.Keys.FETCH_CONNECTIONS);
      },
      onError: (error) => {
        // handle error
      },
    }
  );


  const { mutate: editConnection, isLoading: isEditingConnection } = useMutation(
    QueryKeys.Keys.PATCH_CONNECTION,
    (connection: Connection) =>  putConnectionFn(connection),
      {
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: QueryKeys.Keys.FETCH_CONNECTIONS})
        },
        onError: (error) => {
          // handle error
        },
      }
  );

  const { mutate: deleteConnection, isLoading: isDeletingConnection } = useMutation(
    QueryKeys.Keys.DELETE_CONNECTION,
    (variables: {connectionId: string}) =>  deleteConnectionFn(variables.connectionId),
    {
      onSuccess: () => {  
        queryClient.invalidateQueries({queryKey: QueryKeys.Keys.FETCH_CONNECTIONS})
      },
      onError: (error) => {
        // handle error
      },
    }
  );

  return {
    addConnection,
    editConnection,
    errorAdding,
    errorOnAdding,
    deleteConnection,
    isAddingConnection,
    isEditingConnection,
    isDeletingConnection,
  }

}