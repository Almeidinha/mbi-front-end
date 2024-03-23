import * as QueryKeys from "@/lib/types/QueryKeys";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getFieldByIdFn, putFieldFn } from "./query";
import { isDefined } from "@/lib/helpers/safe-navigation";
import { BIAnalysisFieldDTO } from "@/lib/types/Filter";

export const useFieldController = (props: {fieldId?: number}) => {

  const queryClient = useQueryClient();

  const {data: field, isLoading: loadingField} = useQuery(
    [QueryKeys.Keys.FETCH_FIELD, props.fieldId!],
    () =>  getFieldByIdFn(props.fieldId!),
    { enabled: isDefined(props.fieldId) }
  );

  const { mutate: editField, isLoading: isEditingField } = useMutation(
    QueryKeys.Keys.PUT_FIELD,
    (field: BIAnalysisFieldDTO) =>  putFieldFn(field),
      {
        onSuccess: () => {
          //queryClient.invalidateQueries({queryKey: QueryKeys.Keys.})
        },
        onError: (error) => {
          // handle error
        },
      }
  );


  return {
    field,
    loadingField,
    editField,
    isEditingField
  }
}