"use client"
import { useInterfaceListController } from "@/hooks/controllers/biInterface"
import { useUserListController } from "@/hooks/controllers/user"
import { isDefined, isNil } from "@/lib/helpers/safe-navigation"
import { BIInterface, BIInterfaceAction, BIUserInterface } from "@/lib/types/Interface"
import { Card, Select, Space, Switch, TableColumnsType } from "antd"
import Table from "antd/es/table"
import { defaultTo } from "lodash"
import { useMemo, useState } from "react"

type DataType = Omit<BIInterface, 'biInterfaceActions'>  & {
  key: string,
  hasPermission?: boolean
  children: BIInterfaceAction[]
}


const columns: TableColumnsType<DataType> = [  
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: 'Has Permission',
    key: 'hasPermission',
    dataIndex: 'hasPermission',
    render: (_, record) => {
      if (isDefined(record.children)) {
        return 
      }
      return <Switch checked={record.hasPermission} />
    }
  },
]

export const BIUserInterfacesPermissions: React.FC  = () => {

  const {
    isError,
    biInterfaces,
    loadingInterfaces,
    reloadInterfaces
  } = useInterfaceListController()

  const {
    users,
    loadingUsers
  } = useUserListController()

  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined)
  
  const data: DataType[] = useMemo(() => {

    const checkForPermission = (biInterface: BIInterface, biInterfaceAction: BIInterfaceAction): boolean => {

      if (isNil(biInterface.biUserInterfaces)) {
        return false
      }
  
      const userPermission: BIUserInterface | undefined = biInterface.biUserInterfaces
        .find((biUserInterface) => biUserInterface.userId === selectedUserId) // TODO Get ID from Select
  
      return isDefined(userPermission) 
        && userPermission.permissionLevel >= biInterfaceAction.actionWeight
  
    }

    return defaultTo(biInterfaces, []).map((biInterface) => ({
      key: String(biInterface.id),
      id: biInterface.id,
      name: biInterface.name,
      children: biInterface.biInterfaceActions.map((biInterfaceAction) => ({
        key: `${biInterface.id}-${biInterfaceAction.id}`,
        id: biInterfaceAction.id,
        name: biInterfaceAction.description,
        interfaceId: biInterfaceAction.id, 
        actionWeight: biInterfaceAction.actionWeight, 
        description: biInterfaceAction.description,
        hasPermission: checkForPermission(biInterface, biInterfaceAction),
      })),
    }))
  }, [biInterfaces, selectedUserId])

  return <Card type="inner">
    <Space direction="vertical" style={{width: "100%"}}>
      <Select
        options={users?.map((user) => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user.id
        }))}
        loading={loadingUsers}
        style={{width: "250px"}}
        value={selectedUserId}
        onChange={setSelectedUserId}
      />
      {
        isDefined(selectedUserId) && <Table
          columns={columns}
          dataSource={data}
          loading={loadingInterfaces}
          pagination={false}
          size="small"
        />
      }
    </Space>
  </Card>
}