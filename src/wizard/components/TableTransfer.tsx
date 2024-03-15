import { GetProp, Table, TableColumnsType, TableProps, Transfer, TransferProps } from "antd";
import { difference } from "lodash";

type TransferItem = GetProp<TransferProps, 'dataSource'>[number];
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

export type TableDataType = {
  key: string;
  name: string;
  tableType: string;
}


export const tableColumns: TableColumnsType<TableDataType> = [
  {
    dataIndex: 'name',
    title: 'Table Name',
  },
  {
    dataIndex: 'tableType',
    title: 'Table Type',
  },
];

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: TableDataType[];
  leftColumns: TableColumnsType<TableDataType>;
  rightColumns: TableColumnsType<TableDataType>;
  loadingTables: boolean;
}

const TableTransfer: React.FC<TableTransferProps> = ({ leftColumns, rightColumns, loadingTables, ...restProps }: TableTransferProps) => (
  <Transfer {...restProps}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection: TableRowSelection<TransferItem> = {
        getCheckboxProps: (item) => ({ disabled: listDisabled || item.disabled }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys as string[], selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key as string, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          loading={loadingTables}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          style={{ pointerEvents: listDisabled ? 'none' : undefined }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key as string, !listSelectedKeys.includes(key as string));
            },
          })}
        />
      );
    }}
  </Transfer>
);

export default TableTransfer;