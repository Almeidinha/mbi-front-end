"use client"

import { useUserGroupMutation, useUserGroupListQuery } from "@/hooks/controllers/group"
import { UserGroup } from "@/lib/types/Group"
import { CloseCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import { Button, Card, Modal, Space } from "antd"
import Table, { ColumnsType } from "antd/es/table"
import { defaultTo, toNumber } from "lodash"
import { useMemo, useState } from "react"
import AddEditGroup from "../components/AddEditGroup"
import { is, isDefined } from "@/lib/helpers/safe-navigation"

type DataType = UserGroup & {
  key: string
}  
  
const UserGroupList = () => {

  const {
    userGroups,
    isError,
    loadingUserGroups
  } = useUserGroupListQuery()
  
  const {
    deleteUserGroup,
    isDeletingUserGroup,
  } = useUserGroupMutation()

  const [modalTitle, setModalTitle] = useState<string>("");
  const [groupModalOpen, setGroupModalOpen] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | undefined>(undefined);

  const [modal, contextHolder] = Modal.useModal();

  const columns: ColumnsType<DataType> = [
    {
      title: 'Id',
      key: 'id',
      dataIndex: 'id'
    },
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'description'
    },
    {
      title: 'Role',
      key: 'roleCode',
      dataIndex: 'roleCode'
    },    
    {
      title: 'Actions',
      key: 'actions',
      width: 300,
      dataIndex: 'group',
      render: (_, record) => <Space>
        <Button
          type="primary"
          onClick={() => handleEditGroupClick(record)}
          loading={isDeletingUserGroup}
        >
          Edit
        </Button>
        <Button
          onClick={() => confirmUserDelete(toNumber(record.id))}
          danger
          loading={isDeletingUserGroup}
        >
          Delete
        </Button>
      </Space>,
    }
  ]

  const data: DataType[] = useMemo(() => {
    return defaultTo(userGroups, []).map((group, index) => ({
      key: String(index),
      id: group.id,
      name: group.name,
      description: group.description,
      roleCode: group.roleCode
    }))
  }, [userGroups])

  const handleEditGroupClick = (record: DataType) => {
    setSelectedGroup({
      id: record.id,
      name: record.name,
      description: record.description,
      roleCode: record.roleCode,
    })

    setModalTitle("Edit Group")
    setGroupModalOpen(true)
  }

  const removeGroup = (groupId: number | undefined) => {    
    isDefined(groupId) && deleteUserGroup({userGroupId: groupId})
  }

  const confirmUserDelete = (groupId: number) => {
    modal.confirm({
      title: 'Confirm Group Deletion',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure, this has no come back!',
      onOk: () => removeGroup(groupId)
    });
  };

  const handleAddGroupClick = () => {
    setSelectedGroup(undefined)

    setModalTitle("Add Group")
    setGroupModalOpen(true)
  }

  return <Card type="inner">
    <Space direction="vertical" style={{width: "100%"}}>
      <Button
        type="primary"
        onClick={handleAddGroupClick}
      >
        Add Group
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        loading={loadingUserGroups}
        pagination={false}
        size="middle"
        bordered
      />
    </Space>
    <Modal
      title={modalTitle}
      open={groupModalOpen}
      onCancel={() => setGroupModalOpen(false)}
      footer={null}
      okText="Save"
      destroyOnClose
      closeIcon={<CloseCircleOutlined />}
    >
      <AddEditGroup group={selectedGroup} onFinish={() => setGroupModalOpen(false)}/>
    </Modal>
    { contextHolder }
  </Card>

}

export default UserGroupList;