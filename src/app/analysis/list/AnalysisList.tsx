"use client"

import { useAnalysisDtoListController } from '@/hooks/controllers/analysis'
import { useUserIndController } from '@/hooks/controllers/user'
import { defaultTo, is, isEmpty, isNil } from '@/lib/helpers/safe-navigation'
import { Card, Space, Switch, Tag, Tooltip, Typography, notification } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import React, { useMemo } from 'react'
import "./analysisList.css"
import { OpenFolderIcon } from '@/lib/icons/customIcons'
import { useRouter } from 'next/navigation'
import { MessageType, getMessageIcon } from '@/lib/helpers/alerts'

type DataType = {
  key: string,
  id: number,
  areaId: number,
  name: string,
  areaName: string,
  canEdit: boolean,
  favorite: boolean
}

const AnalysisList = () => {

  const {
    analysis,
    reloadAnalysis,
    loadingAnalysis
  } = useAnalysisDtoListController()

  const {
    updateUserIndFavorite,
    updatingUserIndFavorite
  } = useUserIndController();

  const router = useRouter()
  const [api, contextHolder] = notification.useNotification();
  const [selectedKey, setSelectedKey] = React.useState<string>('')

  
  const columns: ColumnsType<DataType> = [
    {
      title: 'Id',
      key: 'id',
      dataIndex: 'id',
      width: 75,
    },
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Area Name',
      key: 'areaName',
      dataIndex: 'areaName'
    },
    {
      title: 'Pode Editar',
      key: 'canEdit',
      dataIndex: 'canEdit',
      width: 100, 
      align: 'center',
      render: (canEdit: boolean) => <Tag color={canEdit ? "success" : "error"}>{canEdit ? "Sim" : "Não"}</Tag>
    },
    {
      title: 'Favorita',
      key: 'favorite',
      dataIndex: 'favorite',
      width: 100,
      align: 'center',
      render: (favorite: boolean, record: DataType) => <Switch 
        checked={favorite}
        loading={updatingUserIndFavorite} 
        onChange={() => updateUserIndFavorite({
          userId: 1,  // TODO Get user id from Redux
          indicatorId: record.id,
          onSuccess: reloadAnalysis
        })} 
      />
    },
  ]

  const data: DataType[] = useMemo(() => {
    return defaultTo(analysis, []).map((ana, index) => ({
      key: String(ana.id),
      id: ana.id,
      areaId: ana.areaId,
      name: ana.name,
      areaName: ana.areaName,
      canEdit: is(ana?.biUserIndDtoList.find(u => u.userId === 1)?.canChange) || is(ana?.biUserGroupIndDtoList.find(u => u.userGroupId === 1)?.canEdit), // TODO Get user / group id from Redux
      favorite: is(ana?.biUserIndDtoList.find(u => u.userId === 1)?.favorite) // TODO Get user id from Redux
    }))
  }, [analysis])

  
  const handleOpenAnalysis = () => {
    if (isEmpty(selectedKey)) { 
      api.info({
        message: 'Nenhuma Analise selecionada',
        icon: getMessageIcon(MessageType.INFO),
        description: "Selecione uma análise para abrir.",
        placement: 'topRight',
        role : 'alert'
      });
    } else {
      router.push(`/analysis/${selectedKey}`)
    }
    
  }

  return <Card type='inner'>
    
    <Space.Compact direction='vertical' className='analysis-table-list-wrapper'>
      
      <div className='custom-table-header'>
        <Typography.Text type='secondary'>
          Available Analysis
        </Typography.Text>
        <Space.Compact style={{float: "right", gap: "4px"}}>
          <Tooltip title="Open Analysis">
            <span onClick={handleOpenAnalysis}><OpenFolderIcon fill='green' style={{fontSize: "24px", cursor: "pointer"}}/></span>
          </Tooltip>
        </Space.Compact>
      </div>
    
      <Table
        className='analysis-table-list'
        columns={columns}
        dataSource={data}
        size='small'
        loading={loadingAnalysis}
        bordered
        rowSelection={{
          renderCell: () => null,
          hideSelectAll: true,
          type: 'radio',
          selectedRowKeys: [selectedKey]
        }}
        onRow={(data) => {
          return {
            onClick:  () => {
              setSelectedKey(() => data.key === selectedKey ? '' : data.key)
            }
          }
        }}
        pagination={{
          hideOnSinglePage: true,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
        }}
      />      
    </Space.Compact>      
    {contextHolder}
  </Card>
}

export default AnalysisList
