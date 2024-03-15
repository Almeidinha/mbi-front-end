import * as QueryKeys from "@/lib/types/QueryKeys";
import { useQuery } from "react-query";
import { getDatabaseTablesFn, getTableColumnsFn, postTablesColumnsFn, postTablesFullInfoFn } from "./queries";
import { isDefined } from "@/lib/helpers/safe-navigation";

type IProps = {
  tenantId?: string;
  tableName?: string;
  tableNames?: string[];
}

export const useDatabaseTablesQuery = (props: IProps ) => {

  const {data: tables, isLoading: loadingTables, refetch: refetchTables} = useQuery(
    [QueryKeys.Keys.FETCH_TABLE_NAMES, props.tenantId],
    () =>  getDatabaseTablesFn(props.tenantId!),
    { enabled: isDefined(props.tenantId) }
  );

  return {
    tables,
    loadingTables,
    refetchTables
  }

}

export const useDatabaseTableColumnsQuery = (props: IProps ) => {

  const {data: columns, isLoading: loadingColumns, refetch: refetchColumns} = useQuery(
    [QueryKeys.Keys.FETCH_COLUMN_NAMES, props.tenantId, props.tableName],
    () =>  getTableColumnsFn(props.tenantId!, props.tableName!),
    { enabled: isDefined(props.tenantId) }
  );

  return {
    columns,
    loadingColumns,
    refetchColumns
  }

}

export const useDatabaseTablesWithColumnsQuery = (props: IProps ) => {

  const {data: tables, isLoading: loadingTables, refetch: refetchTables} = useQuery(
    [QueryKeys.Keys.FETCH_TABLE_COLUMN_NAMES, props.tenantId, props.tableNames],
    () =>  postTablesColumnsFn({tenantId: props.tenantId!, tableNames: props.tableNames!}),
    { enabled: isDefined(props.tenantId), refetchOnMount: true }
  );

  return {
    tables,
    loadingTables,
    refetchTables
  }

}


export const useDatabaseTablesFullInfoQuery = (props: IProps ) => {

  const {data: tables, isLoading: loadingTables, refetch: refetchTables, isRefetching} = useQuery(
    [QueryKeys.Keys.FETCH_TABLE_FULL_INFO, props.tenantId, props.tableNames],
    () =>  postTablesFullInfoFn({tenantId: props.tenantId!, tableNames: props.tableNames!}),
    { enabled: isDefined(props.tenantId) }
  );

  return {
    tables,
    loadingTables,
    isRefetching,
    refetchTables
  }

}

