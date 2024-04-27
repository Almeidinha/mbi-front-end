import * as QueryKeys from "@/lib/types/QueryKeys";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getFieldByIdFn, putFieldFn, putFieldsFn } from "./query";
import { isDefined } from "@/lib/helpers/safe-navigation";
import { BIAnalysisFieldDTO } from "@/lib/types/Filter";

export const useFieldsQuery = (props: {fieldId?: number}) => {

  const {data: field, isLoading: loadingField} = useQuery(
    [QueryKeys.Keys.FETCH_FIELD, props.fieldId!],
    () =>  getFieldByIdFn(props.fieldId!),
    { enabled: isDefined(props.fieldId) }
  );

  return {
    field,
    loadingField,
  }
}


export const useFieldsMutation = () => {

  const queryClient = useQueryClient();

  const { mutate: editField, isLoading: isEditingField } = useMutation(
    QueryKeys.Keys.PUT_FIELD,
    (variables: {field: BIAnalysisFieldDTO, onSuccess?: () => void}) =>  putFieldFn(variables.field),
      {
        onSuccess: (_, variables) => {
          variables.onSuccess?.();
          //queryClient.invalidateQueries({queryKey: QueryKeys.Keys.})
        },
        onError: (error) => {
          // handle error
        },
      }
  );

  const { mutate: editFields, isLoading: isEditingFields } = useMutation(
    QueryKeys.Keys.PUT_FIELD,
    (variables: {fields: BIAnalysisFieldDTO[], onSuccess?: () => void}) =>  putFieldsFn(variables.fields),
      {
        onSuccess: (_, variables) => {
          variables.onSuccess?.();
          //queryClient.invalidateQueries({queryKey: QueryKeys.Keys.})
        },
        onError: (error) => {
          // handle error
        },
      }
  );


  return {
    editField,
    isEditingField,
    editFields,
    isEditingFields
  }
}