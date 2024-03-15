import React, { useEffect } from 'react'
import { Spin } from 'antd';
import useWizardState from '../hooks/use-wizard-state'
import { isDefined, isEmpty, isNil } from '@/lib/helpers/safe-navigation'
import { useDatabaseTablesFullInfoQuery } from '@/hooks/controllers/databaseInfo';
import { ERDGraph } from '@/ERDEngine/graph';

const Relations: React.FC = () => {

  const {
    tenantId,
    databaseTableList,
  } = useWizardState.useContainer()

  const {
    tables,
    loadingTables,
    refetchTables,
    isRefetching,
  } = useDatabaseTablesFullInfoQuery({tenantId: tenantId!, tableNames: databaseTableList.map(table => table.tableName)})

  const [isReady, setIsReady] = React.useState(false)
  
  useEffect(() => {
    
    if (isEmpty(databaseTableList) || isNil(tables) || isEmpty(tables)) {
      return
    }
    
    const tableNames = tables.map(table => table.tableName)
    if (databaseTableList.some((databaseTable) => !tableNames.includes(databaseTable.tableName))) {
      refetchTables()
      return;
    }

    databaseTableList.forEach(table => {
      const t = tables.find((t) => t.tableName === table.tableName)
      if (isDefined(t)) {
        table.columns = t.columns
        table.primaryKeys = t.primaryKeys
        table.foreignKeys = t.foreignKeys
      }
    })
    setIsReady(true)
    
  }, [databaseTableList, refetchTables, tables])

  if (loadingTables || isRefetching || !isReady) {
    return <Spin />
  } 
  
  return <ERDGraph  />

}

export default Relations