import  AxiosClient  from "@/services/axios";
import { useQuery } from "react-query";



export const getTestFn = async () => {
  const response = await AxiosClient.get<string>('/test/table/1');
  return response.data;
};

export const useTestDataController = () => {

  const { isLoading: loadingTestData, isError, data: testData, refetch: reloadTestData } = useQuery(
    "TESTE_QUERY",
    () => getTestFn(),
    { enabled: true }
  );

  return {
    testData,
    reloadTestData,
    loadingTestData,
    isError
  }
  
}