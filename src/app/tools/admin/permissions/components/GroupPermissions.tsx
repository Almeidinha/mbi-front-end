"use client"
import { useInterfaceListController } from "@/hooks/controllers/biInterface"
import { useUserGroupListController } from "@/hooks/controllers/group"
import { isDefined, isNil } from "@/lib/helpers/safe-navigation"
import { BIInterface, BIInterfaceAction, BIUserGroupInterface } from "@/lib/types/Interface"
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

export const BIGroupInterfacesPermissions: React.FC  = () => {

  const {
    isError,
    biInterfaces,
    loadingInterfaces,
    reloadInterfaces
  } = useInterfaceListController()

  const {
    userGroups,
    loadingUserGroups
  } = useUserGroupListController()

  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(undefined)
  
  const data: DataType[] = useMemo(() => {

    const checkForPermission = (biInterface: BIInterface, biInterfaceAction: BIInterfaceAction): boolean => {

      if (isNil(biInterface.biUserGroupInterfaces)) {
        return false
      }
  
      const userPermission: BIUserGroupInterface | undefined = biInterface.biUserGroupInterfaces
        .find((biUserInterface) => biUserInterface.userGroupId === selectedGroupId) // TODO Get ID from Select
  
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
  }, [biInterfaces, selectedGroupId])

  return <Card type="inner">
    <Space direction="vertical" style={{width: "100%"}}>
      <Select
        options={userGroups?.map((group) => ({
          label: group.description,
          value: group.id
        }))}
        loading={loadingUserGroups}
        style={{width: "250px"}}
        value={selectedGroupId}
        onChange={setSelectedGroupId}
      />
      {
        isDefined(selectedGroupId) && <Table
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