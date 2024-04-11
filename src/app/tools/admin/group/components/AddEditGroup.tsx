import { useUserGroupController } from '@/hooks/controllers/group';
import enumToOptions from '@/lib/helpers/enumToOptions';
import { isDefined } from '@/lib/helpers/safe-navigation';
import { RoleCode, UserGroup } from '@/lib/types/Group';
import { SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react'

type IAddEditGroupProps = {
  group?: UserGroup
  onFinish?: () => void;
}


const AddEditGroup = (props: IAddEditGroupProps) => {

  const {
    group,
    onFinish
  } = props

  const {
    addUserGroup,
    isAddingUserGroup,
    editUserGroup,
    isEditingUserGroup
  } = useUserGroupController({})

  const [form] = useForm()

  const initialValues = {
    id: group?.id,
    name: group?.name,
    description: group?.description,
    roleCode: group?.roleCode 
  }

  const handleFormSubmit = () => {
    
    form.validateFields().then(fields => {      
      isDefined(fields.id) 
      ?  editUserGroup(fields)
      : addUserGroup(fields)

      onFinish?.()
    })
  }

  return <Form
      form = {form}
      name = "addEditGroup"
      autoComplete="off"
      onFinish={handleFormSubmit}
      initialValues={initialValues}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
    >
      <Form.Item
        label="Group Id"
        name="id"
        labelAlign="left"
      >
        <Input disabled variant="borderless"/>
      </Form.Item>
      <Form.Item
        label="Name"
        name="name"
        labelAlign="left"
        rules={[{ required: true, message: 'Please input group name!' }]}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        labelAlign="left"
        rules={[{ required: true, message: 'Please input group description!' }]}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        label="Role Code"
        name="roleCode"
        labelAlign="left"
        rules={[{ required: true, message: 'Please input group role code!' }]}
      >
        <Select options={enumToOptions(RoleCode)} placeholder="Select Role Code" />
      </Form.Item>
      
      <Form.Item wrapperCol={{ offset: 20 }}>
        <Button
          type="primary"
          loading={isAddingUserGroup || isEditingUserGroup}
          icon={<SaveOutlined />}
          htmlType="submit"
        >
          Save
        </Button>
      </Form.Item>
      
    </Form>
}

export default AddEditGroup
