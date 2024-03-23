import { Field } from "@/lib/types/Analysis";
import { GenericFilter } from "@/lib/types/Filter";
import { BIUserGroupIndDTO, BIUserIndDTO } from "@/lib/types/User";

export type DatabaseColumn = {
  uid: string;
  columnName: string;
  userDataType: string;
  originalDataType: string;
  columnSize: string;
  isNullable: boolean;
}

export type DatabaseTablePK = {
  tableName: string;
  columnName: string;
}

export type DatabaseTableFK = {
  pkTableName: string;
  pkColumnName: string;
  fkTableName: string;
  fkColumnName: string;
}

export type DatabaseTable = {
  uid: string;
  tableName: string;
  tableType: string;
  columns?: DatabaseColumn[];
  primaryKeys?: DatabaseTablePK[];
  foreignKeys?: DatabaseTableFK[];
}

export type TablesRequest = {
  tenantId: string;
  tableNames: string[];
}

export type TablesResponse = {
  [key: string]: any;
  tableName: string;
  tableColumns: DatabaseColumn[];
}

export type Permission = {
  type: PermissionType;
  id: number;
  name: string;
  userId?: string;
  groupId?: string;
  level: PermissionLevel;
  favorite?: boolean;
}

export enum PermissionLevel {
  READ = 'READ',
  WRITE = 'WRITE'
}

export enum PermissionType {
  USER = 'USER',
  GROUP = 'GROUP'
}

export type AnalysisInput = {  
  id?: number,
  userId: number,
  connectionId: string,
  name: string,
  usesSequence?: boolean,
  defaultDisplay?: string,
  biAnalysisFields: Field[]
  biAreaByArea: {
    companyId?: number,
    description?: string,
    id: number,
  },
  biSearchClause: GenericFilter,
  biFromClause: GenericFilter,
  biWhereClause: GenericFilter,
  biDimensionFilter?: GenericFilter
  biIndMetricFilter?: GenericFilter
  biIndSqlMetricFilter?: GenericFilter
  permissions: Permission[]
}

export type BIIndDTO = {
  id: number,
  companyId: number,
  areaId: number,
  name: string,
  areaName: string,
  biUserIndDtoList: BIUserIndDTO[],
  biUserGroupIndDtoList: BIUserGroupIndDTO[],
}


