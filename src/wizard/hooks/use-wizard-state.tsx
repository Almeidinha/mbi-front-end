"use client";

import { Connection } from "@/lib/types/Connection";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createContainer } from "unstated-next";
import { AnalysisInput, DatabaseColumn, DatabaseTable, Permission } from "../types";
import { FieldType, LinkDictState, TableDict, TableDictState } from "@/ERDEngine/types";
import { useQueryClient } from "react-query";


interface BoxState {
  x: number;
  y: number;
  w: number;
  h: number;
  clientW: number;
  clientH: number;
}

interface WizardState {
  areaId: number | undefined;
  setAreaId: (areaId: number | undefined) => void
  analysisName: string;
  setAnalysisName: (name: string) => void
  currentStep: number,
  tenantId: string | undefined,
  setCurrentStep: (step: number) => void,
  databaseTableList: DatabaseTable[],
  setDatabaseTableList: (databaseTableList: DatabaseTable[]) => void,
  columnList: DatabaseColumn[],
  setColumnList: (columnList: DatabaseColumn[]) => void,
  connection: Connection | undefined, 
  setConnection: (connection: Connection | undefined) => void
  tableList: TableDict[];
  tableDict: TableDictState;
  setTableDict: React.Dispatch<React.SetStateAction<TableDictState>>;
  linkDict: LinkDictState;
  setLinkDict: React.Dispatch<React.SetStateAction<LinkDictState>>;
  metrics: FieldType[];
  setMetrics: React.Dispatch<React.SetStateAction<FieldType[]>>;
  dimensions: FieldType[];
  setDimensions: React.Dispatch<React.SetStateAction<FieldType[]>>;
  permissions: Permission[];
  setPermissions: React.Dispatch<React.SetStateAction<Permission[]>>;
  box: BoxState;
  theme: string;
  setBox: React.Dispatch<React.SetStateAction<BoxState>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  dbAnalysis: AnalysisInput | undefined;
  setDdbAnalysis: React.Dispatch<React.SetStateAction<AnalysisInput | undefined>>;
}

const useWizardState = (): WizardState => {

  const [currentStep, setCurrentStep] = useState<number>(0)
  const [tenantId, setTenantId] = useState<string | undefined>(undefined)
  const [connection, setConnection] = useState<Connection | undefined>()
  const [databaseTableList, setDatabaseTableList] = useState<DatabaseTable[]>([])
  const [columnList, setColumnList] = useState<DatabaseColumn[]>([])
  const [name, setName] = useState<string>("CURRENT_GRAPH");
  const [theme, setTheme] = useState('#94bfff'); // 'dark' : 'light'
  const [box, setBox] = useState<BoxState>({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    clientW: 0,
    clientH: 0,
  });
  const [tableDict, setTableDict] = useState<TableDictState>({} as TableDictState);
  const [linkDict, setLinkDict] = useState<LinkDictState>({} as LinkDictState);
  const [metrics, setMetrics] = useState<FieldType[]>([])
  const [dimensions, setDimensions] = useState<FieldType[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [areaId, setAreaId] = useState<number | undefined>(undefined)
  const [analysisName, setAnalysisName] = useState<string>("")
  const [dbAnalysis, setDdbAnalysis] = useState<AnalysisInput | undefined>(undefined)

  const queryClient = useQueryClient();

  useEffect(() => {
    setTenantId(connection?.tenantId)
    //queryClient.invalidateQueries(QueryKeys.Keys.FETCH_TABLE_NAMES)
  }, [connection, queryClient])

  const resizeHandler = useCallback(() => {
    if (typeof window !== "undefined") {
      setBox((state) => ({
        ...state,
        w:
          state.w && state.clientW
            ? state.w * (window.innerWidth / state.clientW)
            : window.innerWidth,
        h:
          state.h && state.clientH
            ? state.h * (window.innerHeight / state.clientH)
            : window.innerHeight,
        clientW: window.innerWidth,
        clientH: window.innerHeight,
      }));
    }
  }, []);

  useEffect(() => {
    setTableDict({} as TableDictState);
    setLinkDict({} as LinkDictState);
    setName('');
    resizeHandler();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [resizeHandler]);

  const tableList = useMemo(() => Object.values(tableDict), [tableDict]);

  return {
    areaId,
    setAreaId,
    analysisName,
    setAnalysisName,
    currentStep,
    setCurrentStep,
    databaseTableList,
    setDatabaseTableList,
    columnList,
    setColumnList,
    connection,
    tenantId,
    setConnection,
    tableList,
    tableDict,
    setTableDict,
    linkDict,
    setLinkDict,
    box,
    theme,
    setBox,
    name,
    setName,
    metrics,
    setMetrics,
    dimensions,
    setDimensions,
    permissions, 
    setPermissions,
    dbAnalysis,
    setDdbAnalysis
  }
}

export default createContainer(useWizardState)