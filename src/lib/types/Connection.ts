export type Connection = {
  tenantId?: string;
  companyId?: number;
  connectionName: string;
  databaseTypeValue: DatabaseTypes; 
  host?: string;
  instance: string;
  databaseName?: string;
  service?: string;
  informixServer?: string;
  informixOnline?: boolean;
  port?: number;
  sid?: string;
  dateFormat: string;
  decimalSeparator: DecimalSeparator;
  password: string;
  username: string;
  url: string;
  extraProperties?: string;
}

export enum DatabaseTypes {
  MYSQL,
  MSSQL,
  ORACLE,
  POSTGRE,
  DB2,
  INFORMIX,
  OPENEDGE,
}

export enum DecimalSeparator {
  DOTE = '.',
  COMA = ',',
}


export enum JdbcUrl {
  MYSQL = 'jdbc:mysql://',
  MSSQL = 'jdbc:sqlserver://',
  INFORMIX =  'jdbc:informix-sqli:',
  ORACLE = 'jdbc:oracle:thin:@',
  POSTGRE = 'jdbc:postgresql://',
  DB2 = 'jdbc:db2://',
  OPENEDGE = 'jdbc:datadirect:openedge://',
}