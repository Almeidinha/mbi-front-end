"use client"

import { useUserQuery } from "@/hooks/controllers/user"
import { Button, Card, Col, Form, Input, Modal, Row } from "antd"
import { useEffect, useState } from "react"
import { CloseCircleOutlined } from '@ant-design/icons';
import AddEditUser from "../components/AddEditUser";
import { useForm } from "antd/es/form/Form";

type IProps = {
  userId: number
}

const UserData = (props: IProps) => {

  const {
    user,
    loadingUser,
  } = useUserQuery({userId: props.userId})

  const [form] = useForm()
  
  const [userModalOpen, setUserModalOpen] = useState<boolean>(false);

  useEffect(() => {
    form.setFieldsValue(user)
   }, [form, user])

  return <Card title="User Info" loading={loadingUser}>
    <Row>
      <Col span={12} offset={6}>
        <Form
          name = "editUser"
          autoComplete="off"
          form={form}
          initialValues={user}
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
          >
            <Input variant="borderless"/>
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            labelAlign="left"
          >
            <Input variant="borderless"/>
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            labelAlign="left"
          >
            <Input type="email" variant="borderless"/>
          </Form.Item>

          <Form.Item
            label="User Group"
            name="userGroupId"
            labelAlign="left"
          >
            <Input variant="borderless"/>
          </Form.Item>
          <Form.Item wrapperCol={{offset: 24}}>
            <Button type="primary" onClick={() => setUserModalOpen(true)} style={{float: 'right'}}>
              Edit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
    <Modal
      title="Edit USer"
      open={userModalOpen}
      onCancel={() => setUserModalOpen(false)}
      footer={null}
      okText="Save"
      destroyOnClose
      closeIcon={<CloseCircleOutlined />}
    >
      <AddEditUser user={user} onFinish={() => {
        setUserModalOpen(false);
      }}/>
    </Modal>
  </Card>

}

export default UserData;