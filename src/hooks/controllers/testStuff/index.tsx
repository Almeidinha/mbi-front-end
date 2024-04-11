import { isDefined } from "@/lib/helpers/safe-navigation";
import  AxiosClient  from "@/services/axios";
import { useQuery } from "react-query";



export const getTestFn = async (id: string) => {
  const response = await AxiosClient.get<string>(`/test/table/${id}`);
  return response.data;
};

export const useTestDataController = (props: {id?: string}) => {

  const { isLoading: loadingTestData, isError, data: testData, refetch: reloadTestData } = useQuery(
    "TESTE_QUERY",
    () => getTestFn(props.id!),
    { enabled: false }
  );

  return {
    testData,
    reloadTestData,
    loadingTestData,
    isError
  }
  
}