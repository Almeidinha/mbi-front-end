import useWizardState from "../hooks/use-wizard-state"
import { Card } from "antd";
import { defaultTo, isEmpty } from "lodash";
import { useState } from "react";
import TableTransfer, { TableDataType, tableColumns } from "./TableTransfer";

import { useDatabaseTablesQuery } from "@/hooks/controllers/databaseInfo";
import { TransferDirection } from "antd/es/transfer";
import tableModel from "@/ERDEngine/hooks/table-model";

const SelectTables: React.FC = () => {

  const {
    tenantId,
    databaseTableList,
    setDatabaseTableList,
    setMetrics,
    setDimensions,
  } = useWizardState.useContainer()

  const {
    removeTable
  } = tableModel()

  const {
    tables,
    loadingTables,
  } = useDatabaseTablesQuery({tenantId: tenantId!})

  const [targetKeys, setTargetKeys] = useState<string[]>(defaultTo(databaseTableList, []).map(table => table.tableName));

  const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {

    if (direction === 'left' ) {

      const removedTables = databaseTableList.filter(c => moveKeys.includes(c.tableName))
      removedTables.forEach((removedTable) => {
        removeTable(removedTable.uid)
      })
      setMetrics((data) => data.filter((metric) => !moveKeys.includes(metric.tableName)))
      setDimensions((data) => data.filter((dimension) => !moveKeys.includes(dimension.tableName)))

    }

    setTargetKeys(nextTargetKeys);
    setDatabaseTableList(defaultTo(tables, []).filter((table) => nextTargetKeys.includes(table.tableName)));

  };
  
  const data: TableDataType[] = defaultTo(isEmpty(tables) ? [] : tables, []).map((table, index) => ({
    key: table.tableName,
    name: table.tableName,
    tableType: table.tableType,
  }));

  return <Card type="inner">
    <TableTransfer
      loadingTables={loadingTables} 
      dataSource={data}
      targetKeys={targetKeys}
      showSearch
      onChange={onChange}
      filterOption={(inputValue, item) =>
        item.name.toLowerCase().includes(inputValue.toLowerCase())
      }
      leftColumns={tableColumns}
      rightColumns={tableColumns}
    />
  </Card>
}

export default SelectTables