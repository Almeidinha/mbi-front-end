import { useUserGroupListController } from '@/hooks/controllers/group'
import { useUserListController } from '@/hooks/controllers/user'
import { defaultTo, isEmpty, isNil } from '@/lib/helpers/safe-navigation'
import { FastBackwardOutlined, FastForwardOutlined, StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Table, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import useWizardState from '../hooks/use-wizard-state'
import { PermissionLevel, PermissionType, Permission } from '../types'
import { useState } from 'react'

interface DataType {
  key: string;
  name: string;
  id: string
  type?: PermissionType;
  children?: DataType[];
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Permissions',
    key: 'name',
    dataIndex: 'name',
  },
]

const SelectPermissions = () => {


  const {
    users,
    loadingUsers
  } = useUserListController()

  const {
    userGroups,
    loadingUserGroups
  } = useUserGroupListController()

  const {
    permissions,
    setPermissions
  } = useWizardState.useContainer()

  const [readKeys, setReadKeys] = useState<string[]>([])
  const [writeKeys, setWriteKeys] = useState<string[]>([])
  const [selectedSourceRow, setSelectedSourceRow] = useState<DataType | undefined>(undefined)

  const data: DataType[] = [
    {
      key: 'user',
      name: 'Usuarios',
      id: 'user',
      children: defaultTo(users, []).map(user => ({ 
        key: `user-${String(user.id)}`, 
        name: `${user.firstName} ${user.lastName}`, 
        id: String(user.id),
        type: PermissionType.USER,
      }))
    },
    {
      key: 'group',
      name: 'Grupos de Usuários',
      id: 'group',
      children: defaultTo(userGroups, []).map(group => ({ 
        key: `group-${String(group.id)}`, 
        name: `${group.roleCode} - ${group.description}`, 
        id: String(group.id),
        type: PermissionType.GROUP,
      }))
    }
  ] 

  const onSourceRowClick = (data: DataType, index?: number) => {
    return {
      onClick:  () => {
        
        if (data.key === 'user' || data.key === 'group') return;

        setSelectedSourceRow(data)
      } 
    }
  }

  const removeAllPermissions = (type: PermissionLevel) => {
    if (type === PermissionLevel.READ) {
      setPermissions(permissions.filter(permission => permission.level !== PermissionLevel.READ))
    }
    if (type === PermissionLevel.WRITE) {
      setPermissions(permissions.filter(permission => permission.level !== PermissionLevel.WRITE))
    }
  }

  const addPermissions = (level: PermissionLevel) => {
    
    if (isNil(selectedSourceRow) || permissions
      .some((permission) => permission.id === Number(selectedSourceRow.id) && permission.type === selectedSourceRow.type)) {
      return
    }

    setPermissions((prev) => [...prev, { 
      id: Number(selectedSourceRow.id),
      name: selectedSourceRow.name,
      type: selectedSourceRow.type!,
      userId: selectedSourceRow.type === PermissionType.USER ?  selectedSourceRow.id : undefined,
      groupId: selectedSourceRow.type === PermissionType.GROUP ?  selectedSourceRow.id : undefined,
      level: level
    }])
  }

  const removePermission = (type: PermissionLevel) => {

    const removingPermission = type === PermissionLevel.READ ? readKeys[0] : writeKeys[0]

    setPermissions((prev) => prev.filter(permission => permission.id !== Number(removingPermission)))

    if (type === PermissionLevel.READ) {
      setReadKeys([])
    }

    if (type === PermissionLevel.WRITE) {
      setWriteKeys([])
    }

  }

  const onReadRowClick = (data: DataType, index?: number) => {
    return {
      onClick:  () => {
      
        const hasKey = readKeys.includes(data.key)
        if (hasKey) {
          setReadKeys((oldData) => oldData.filter((key) => key !== data.key))
        } else {
          setReadKeys((oldData) => [...oldData, data.key])
        }
      } 
    }
  }

  const onWriteRowClick = (data: DataType, index?: number) => {
    return {
      onClick:  () => {
        
        const hasKey = writeKeys.includes(data.key)
        if (hasKey) {
          setWriteKeys((oldData) => oldData.filter((key) => key !== data.key))
        } else {
          setWriteKeys((oldData) => [...oldData, data.key])
        }
      } 
    }
  }

  return <Card type="inner">
    <Row>
      <Col span={10} style={{padding: '0 48px'}}>
        <Space.Compact direction='vertical' className='custom-table-wrapper'>
          <div className='custom-table-title'>
            <Typography.Title type='secondary' level={5}>
              Usuarios Disponíveis
            </Typography.Title>
          </div>
          <Table  
            showHeader={false}
            size="small"
            bordered
            style={{ maxHeight: '500px', overflowY: 'auto'}}
            className='source-table'
            pagination={false}
            columns={columns}
            dataSource={data}
            loading={loadingUsers || loadingUserGroups}
            onRow={onSourceRowClick}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: [defaultTo(selectedSourceRow?.key, '')]
            }}
          />  
        </Space.Compact>
      </Col>

      <Col span={4} style={{height: '500px'}}>
        <Row justify={'center'} align={'middle'} style={{flexDirection: 'column', height: '50%'}}>
          <Space direction='vertical'>
            <Button disabled={isNil(selectedSourceRow)} shape="round" onClick={() => addPermissions(PermissionLevel.READ)} icon={<StepForwardOutlined />}/>
            <Button disabled shape="round" icon={<FastForwardOutlined />}/>
            <Button onClick={() => removeAllPermissions(PermissionLevel.READ)} shape="round" icon={<FastBackwardOutlined />}/>
            <Button onClick={() => removePermission(PermissionLevel.READ)} disabled={isEmpty(readKeys)} shape="round" icon={<StepBackwardOutlined />}/>
          </Space>
        </Row>
        <Row justify={'center'} align={'middle'} style={{flexDirection: 'column', height: '50%'}}>
          <Space direction='vertical'>
            <Button disabled={isNil(selectedSourceRow)} shape="round" onClick={() => addPermissions(PermissionLevel.WRITE)} icon={<StepForwardOutlined />}/>
            <Button disabled shape="round" icon={<FastForwardOutlined />}/>
            <Button onClick={() => removeAllPermissions(PermissionLevel.WRITE)} shape="round" icon={<FastBackwardOutlined />}/>
            <Button onClick={() => removePermission(PermissionLevel.WRITE) } disabled={isEmpty(writeKeys)} shape="round" icon={<StepBackwardOutlined/>}/>
          </Space>
        </Row>
      </Col>

      <Col span={10} style={{padding: '0 48px'}}>
        <Row justify={'center'} style={{height:'50%'}}>
          <Space.Compact direction='vertical' className='custom-table-wrapper'>
            <div className='custom-table-title'>
              <Typography.Title type='secondary' level={5}>
                Permissão de Leitura
              </Typography.Title>
            </div>
            <Table 
              showHeader={false}
              size="small"
              bordered
              pagination={false}
              columns={columns}
              dataSource={permissions.filter(permission => permission.level === PermissionLevel.READ).map(permission => ({
                key: `${permission.type}-${permission.id}`,
                name: `${permission.name} (${permission.type})`,
                id: permission.id.toString(),
                type: permission.type 
              }))}
              style={{ maxHeight: '200px', overflowY: 'auto'}}
              className='dimension-table'
              onRow={onReadRowClick}
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: readKeys
              }}
            />  
          </Space.Compact>
        </Row>
        <Row justify={'center'} style={{height:'50%'}} >
          <Space.Compact direction='vertical' className='custom-table-wrapper'>
            <div className='custom-table-title'>
              <Typography.Title type='secondary' level={5}>
                Permissão de Gravação
              </Typography.Title>
            </div>
            <Table
              showHeader={false}
              size="small"
              pagination={false}
              columns={columns}
              dataSource={permissions.filter(permission => permission.level === PermissionLevel.WRITE).map(permission => ({
                key: `${permission.type}-${permission.id}`,
                name: `${permission.name} (${permission.type})`,
                id: permission.id.toString(),
                type: permission.type 
              }))}
              bordered
              style={{ maxHeight: '200px', overflowY: 'auto'}}
              className='metric-table'
              onRow={onWriteRowClick}
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: writeKeys
              }}
            />  
          </Space.Compact>
        </Row>
      </Col>
    </Row>
  </Card>
}

export default SelectPermissions
