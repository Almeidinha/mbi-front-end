"use client"

import { useConnectionMutationController, useConnectionsController } from "@/hooks/controllers/connections"
import { Connection, DatabaseTypes } from "@/lib/types/Connection"
import { Button, Card, Modal, Space, Table } from "antd"
import { ColumnsType } from "antd/es/table"
import { CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { defaultTo } from "lodash"
import { useMemo, useState } from "react"
import AddEditConnection from "./components/AddEditConnection";
import { isDefined } from "@/lib/helpers/safe-navigation";

type DataType = Connection & {
  key: string
}

const Connections = () => {
  
  const {
    connections,
    isError,
    loadingConnections,
    fetchingConnections
  } = useConnectionsController()

  const {
    deleteConnection,
    isDeletingConnection,
  } = useConnectionMutationController()

  const [modal, contextHolder] = Modal.useModal();
  const [modalTitle, setModalTitle] = useState<string>("");
  const [connectionModalOpen, setConnectionModalOpen] = useState<boolean>(false);
  const [selectedConnection, setSelectedConnection] = useState<Connection | undefined>(undefined);
  
  const columns: ColumnsType<DataType> = [
    {
      title: 'Connection Name',
      key: 'connectionName',
      dataIndex: 'connectionName'
    },
    {
      title: 'Database',
      key: 'databaseType',
      dataIndex: 'databaseType'
    },
    {
      title: 'Host',
      key: 'host',
      dataIndex: 'host'
    },
    {
      title: 'Date Format',
      key: 'dateFormat',
      dataIndex: 'dateFormat'
    },
    {
      title: 'Separador Decimal',
      key: 'decimalSeparator',
      dataIndex: 'decimalSeparator'
    },
    {
      title: 'Extra Properties',
      key: 'extraProperties',
      dataIndex: 'extraProperties'
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 300,
      dataIndex: 'group',
      render: (_, record) => <Space>
        <Button
          onClick={() => handleEditUserClick(record)}
          loading={isDeletingConnection}
        >
          Edit
        </Button>
        <Button
          onClick={() => confirmDeleteConn(record.tenantId!)}
          danger
          loading={isDeletingConnection}
        >
          Delete
        </Button>
      </Space>,
    }
  ]

  const handleEditUserClick = (record: DataType) => {
    setSelectedConnection({
      tenantId: record?.tenantId,
      companyId: record?.companyId,
      connectionName: record?.connectionName,
      databaseTypeValue: record?.databaseTypeValue,
      host: record?.host,
      databaseName: record?.databaseName,
      service: record?.service,
      informixServer: record?.informixServer,
      informixOnline: record?.informixOnline,
      port: record?.port,
      sid: record?.sid,
      dateFormat: record?.dateFormat,
      decimalSeparator: record?.decimalSeparator,
      password: record?.password,
      username: record?.username,
      url: record?.url,
      instance: record?.instance,
      extraProperties: record?.extraProperties,
    })

    setModalTitle("Edit Connection")
    setConnectionModalOpen(true)
  }

  const removeConnection = (connectionId: string | undefined) => {    
    isDefined(connectionId) && deleteConnection({connectionId})
  }
  const confirmDeleteConn = (connectionId: string) => {
    modal.confirm({
      title: 'Confirm Connection Deletion',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure, this has no come back!',
      onOk: () => removeConnection(connectionId)
    });
  };

  const data: DataType[] = useMemo(() => {
    return defaultTo(connections, []).map((connection, index) => ({
      key: String(index),
      tenantId: connection.tenantId,
      connectionName: connection.connectionName,
      username: connection.username,
      password: connection.password,
      databaseName: connection.databaseName,
      companyId: connection.companyId, 
      databaseTypeValue: connection.databaseTypeValue,
      databaseType: DatabaseTypes[connection.databaseTypeValue],
      dateFormat: connection.dateFormat,
      decimalSeparator: connection.decimalSeparator,
      url: connection.url,
      host: connection.host,
      port: connection.port,
      instance: connection.instance,
      sid: connection.sid,
      service: connection.service,
      informixServer: connection.informixServer,
      informixOnline: connection.informixOnline,
      extraProperties: connection.extraProperties,
    }))
  }, [connections])

  if (isError) {
    return <span>Error</span>
  }

  const handleAddConnectionClick = () => {
    setSelectedConnection(undefined) 
    setModalTitle("Add Connection")
    setConnectionModalOpen(true);
  }

  return <Card type="inner">
    <Space direction="vertical" style={{width: "100%"}}>
      <Button
        type="primary"
        onClick={handleAddConnectionClick}
      >
        Add Connection
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        loading={loadingConnections || fetchingConnections}
        size="middle"
        bordered
      />
    </Space>
    <Modal
      title={modalTitle}
      open={connectionModalOpen}
      onCancel={() => setConnectionModalOpen(false)}
      footer={null}
      okText="Save"
      destroyOnClose
      closeIcon={<CloseCircleOutlined />}
    >
      <AddEditConnection  connection={selectedConnection} onFinish={() => setConnectionModalOpen(false)}/>
    </Modal>
    { contextHolder }
  </Card>
  
}

export default Connections;