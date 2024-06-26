"use client"

import { useAnalysisDtoListQuery, useBIIndSummaryQuery } from '@/hooks/controllers/analysis'
import { useUserIndQuery } from '@/hooks/controllers/user'
import { defaultTo, is, isEmpty, isNil } from '@/lib/helpers/safe-navigation'
import { Card, Flex, Space, Switch, Tag, Tooltip, Typography, notification } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import React, { useMemo } from 'react'
import "./analysisList.css"
import { OpenFolderIcon } from '@/lib/icons/customIcons'
import { useRouter } from 'next/navigation'
import { MessageType, getMessageIcon } from '@/lib/helpers/alerts'
import { useAppSelector } from '@/app/redux/hooks'

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
    biIndSummary,
    loadingBIIndSummary,
    reloadBIIndSummary
  } = useBIIndSummaryQuery()

  const {
    updateUserIndFavorite,
    updatingUserIndFavorite
  } = useUserIndQuery();

  const router = useRouter()
  const [api, contextHolder] = notification.useNotification();
  const [selectedKey, setSelectedKey] = React.useState<string>('')

  const user = useAppSelector((state) => state.currentUser.user)
  
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
          userId: user?.id!,
          indicatorId: record.id,
          onSuccess: reloadBIIndSummary
        })} 
      />
    },
  ]

  const data: DataType[] = useMemo(() => {
    return defaultTo(biIndSummary, []).map((ind, index) => ({
      key: String(ind.id),
      id: ind.id,
      areaId: ind.areaId,
      name: ind.name,
      areaName: ind.areaName,
      canEdit: is(ind?.biUserIndicators.find(u => u.userId === user?.id)?.canChange) || is(ind?.biUserGroupIndicators.find(u => u.userGroupId === user?.userGroupId)?.canEdit),
      favorite: is(ind?.biUserIndicators.find(u => u.userId === user?.id)?.favorite)
    }))
  }, [biIndSummary, user])

  
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
        <Typography.Text type='secondary' strong>
          Available Analysis
        </Typography.Text>
        <Space.Compact style={{float: "right", gap: "4px"}}>
          <Tooltip title="Open Analysis">
            <Flex onClick={handleOpenAnalysis}><OpenFolderIcon style={{fontSize: "24px", cursor: "pointer", color:'#3377cc'}}/></Flex>
          </Tooltip>
        </Space.Compact>
      </div>
    
      <Table
        className='analysis-table-list'
        columns={columns}
        dataSource={data}
        size='small'
        loading={loadingBIIndSummary}
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
