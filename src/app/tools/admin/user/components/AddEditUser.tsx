import { User } from "@/lib/types/User"
import { Button, Form, Input, Select } from "antd"
import { useForm } from "antd/es/form/Form"
import { SaveOutlined } from '@ant-design/icons';
import { useUserMutation } from "@/hooks/controllers/user";
import { isDefined } from "@/lib/helpers/safe-navigation";
import { useUserGroupListQuery } from "@/hooks/controllers/group";

type IAddEditUserProps = {
  user?: User
  onFinish?: () => void;
}

const AddEditUser = (props: IAddEditUserProps) => {

  const {
    user,
    onFinish
  } = props

  const {
    addUser,
    isAddingUser,
    editUser,
    isEditingUser,
  } = useUserMutation()

  const {
    loadingUserGroups,
    userGroups
  } = useUserGroupListQuery()

  const [form] = useForm()

  const initialValues = {
    id: user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    userGroupId: user?.userGroup.id
  }

  const handleFormSubmit = () => {
    
    form.validateFields().then(fields => {
      isDefined(fields.id) 
      ?  editUser(fields)
      : addUser(fields)

      onFinish?.()
    })
  }

  return <Form
    form = {form}
    name = "addEditUser"
    autoComplete="off"
    onFinish={handleFormSubmit}
    initialValues={initialValues}
    labelCol={{ span: 6 }}
    wrapperCol={{ span: 18 }}
  >
    <Form.Item
      label="User Id"
      name="id"
      labelAlign="left"
    >
      <Input disabled variant="borderless"/>
    </Form.Item>
    <Form.Item
      label="First Name"
      name="firstName"
      labelAlign="left"
      rules={[{ required: true, message: 'Please input user first name!' }]}
    >
      <Input/>
    </Form.Item>
    <Form.Item
      label="Last Name"
      name="lastName"
      labelAlign="left"
      rules={[{ required: true, message: 'Please input user last name!' }]}
    >
      <Input/>
    </Form.Item>
    <Form.Item
      label="Email"
      name="email"
      labelAlign="left"
      rules={[{ required: true, message: 'Please input user email!' }]}
    >
      <Input type="email"/>
    </Form.Item>

    <Form.Item
      label="User Group"
      name="userGroupId"
      labelAlign="left"
      rules={[{ required: true, message: 'Please select the user group!' }]}
    >
      <Select
        options={userGroups?.map((group) => ({
          label: group.name,
          value: group.id
        }))}
        loading={loadingUserGroups}
      />
    </Form.Item>
    
    <Form.Item wrapperCol={{ offset: 20 }}>
      <Button
        type="primary"
        loading={isAddingUser || isEditingUser}
        icon={<SaveOutlined />}
        htmlType="submit"
      >
        Save
      </Button>
    </Form.Item>
    
  </Form>  

}

export default AddEditUser;