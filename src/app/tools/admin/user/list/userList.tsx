"use client"

import { useUserController, useUserListController } from "@/hooks/controllers/user"
import { User } from "@/lib/types/User"
import { Button, Card, Modal, Space } from "antd"
import Table, { ColumnsType } from "antd/es/table"
import { defaultTo, toNumber } from "lodash"
import { useMemo, useState } from "react"
import AddEditUser from "../components/AddEditUser"
import { CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { isDefined } from "@/lib/helpers/safe-navigation"


type DataType = User & {
  key: string
}

const UserList = () => {

  const {
    users,
    isError,
    loadingUsers
  } = useUserListController()
  
  const {
    deleteUser,
    isDeletingUser
  } = useUserController({})

  const [modalTitle, setModalTitle] = useState<string>("");
  const [userModalOpen, setUserModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  
  const [modal, contextHolder] = Modal.useModal();

  const columns: ColumnsType<DataType> = [
    {
      title: 'Id',
      key: 'id',
      dataIndex: 'id'
    },
    {
      title: 'First Name',
      key: 'firstName',
      dataIndex: 'firstName'
    },
    {
      title: 'Last Name',
      key: 'lastName',
      dataIndex: 'lastName'
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email'
    },
    {
      title: 'Group',
      key: 'group',
      dataIndex: 'group',
      render: (_, record) => <>{record.userGroup?.name}</>,
    },
    {
      title: 'Group Role',
      key: 'role',
      dataIndex: 'role',
      render: (_, record) => <>{record.userGroup?.roleCode}</>,
    },
    {
      title: 'Actions',
      key: 'actions',
      dataIndex: 'group',
      render: (_, record) => <Space>
        <Button
          type="primary"
          onClick={() => handleEditUserClick(record)}
          loading={isDeletingUser}
        >
          Edit
        </Button>
        <Button
          onClick={() => confirmUserDelete(toNumber(record.id))}
          danger
          loading={isDeletingUser}
        >
          Delete
        </Button>
      </Space>,
    }
  ]

  const handleEditUserClick = (record: DataType) => {
    setSelectedUser({
      id: record.id,
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      userGroup: record.userGroup
    })

    setModalTitle("Edit User")
    setUserModalOpen(true)
  }

  const handleAddUserClick = () => {
    setSelectedUser(undefined)

    setModalTitle("Add User")
    setUserModalOpen(true)
  }

  const removeUser = (userId: number | undefined) => {    
    isDefined(userId) && deleteUser({userId})
  }

  const data: DataType[] = useMemo(() => {
    return defaultTo(users, []).map((user, index) => ({
      key: String(index),
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userGroup: user.userGroup
    }))
  }, [users])

  if (isError) {
    return <span>Error</span>
  }

  const confirmUserDelete = (userId: number) => {
    modal.confirm({
      title: 'Confirm User Deletion',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure, this has no come back!',
      onOk: () => removeUser(userId)
    });
  };

  return <Card type="inner">
    <Space direction="vertical" style={{width: "100%"}}>
      <Button
        type="primary"
        onClick={handleAddUserClick}
      >
        Add user
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        loading={loadingUsers}
        pagination={false}
        size="middle"
        bordered
      />
    </Space>
    <Modal
      title={modalTitle}
      open={userModalOpen}
      onCancel={() => setUserModalOpen(false)}
      footer={null}
      okText="Save"
      destroyOnClose
      closeIcon={<CloseCircleOutlined />}
    >
      <AddEditUser user={selectedUser} onFinish={() => setUserModalOpen(false)}/>
    </Modal>
    { contextHolder }
  </Card>

}

export default UserList;