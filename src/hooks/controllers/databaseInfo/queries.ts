import { axiosClient } from "@/services/axios";
import { DatabaseColumn, DatabaseTable, TablesRequest, TablesResponse } from "@/wizard/types";

export const getDatabaseTablesFn = async (tenantId: string) => {
  const response = await axiosClient.get<DatabaseTable[]>('/database/tables', {params: {tenantId}}); // {params: {tenantId}} ?
  return response.data;
};

export const getTableColumnsFn = async (tenantId: string, tableName: string) => {
  const response = await axiosClient.get<DatabaseColumn[]>('/database/columns', {params: {tenantId, tableName}}); // {params: {tenantId, tableName}} ?
  return response.data;
};

export const getTablesColumnsFn = async (tenantId: string, tableNames: string[]) => {
  const response = await axiosClient.get<DatabaseColumn[]>('/database/tables/columns', {params: {tenantId, tableNames}});
  return response.data;
};


export const postTablesColumnsFn = async (tablesRequest: TablesRequest) => {
  const response = await axiosClient.post<TablesResponse[]>('/database/tables', tablesRequest);
  return response.data;
};

export const postTablesFullInfoFn = async (tablesRequest: TablesRequest) => {
  const response = await axiosClient.post<TablesResponse[]>('/database/tables/full', tablesRequest);
  return response.data;
};