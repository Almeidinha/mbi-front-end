
import { useConnectionMutation } from "@/hooks/controllers/connections";
import { isDefined, isEmpty, isNil } from "@/lib/helpers/safe-navigation";
import { Connection, DatabaseTypes, DecimalSeparator, JdbcUrl } from "@/lib/types/Connection";
import { Button, Checkbox, Divider, Form, Input, InputNumber, Radio, Select, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { SaveOutlined } from '@ant-design/icons';
import enumToOptions from "@/lib/helpers/enumToOptions";
import { useState } from "react";
import TagsInput from "@/components/tag-input/TagInputComponent";
import { spaceValidator } from "@/lib/helpers/validators";

type IAddEditConnection = {
  connection?: Connection
  onFinish?: () => void;
}

const AddEditConnection = (props: IAddEditConnection) => {
  const {
    connection,
    onFinish
  } = props

  const {
    addConnection,
    editConnection,
    isAddingConnection,
    isEditingConnection,
  } = useConnectionMutation()

  const [form] = useForm()
  const [passwordVisible, setPasswordVisible] = useState(false);

  const url = Form.useWatch((values) => {

    if (isNil(values.databaseTypeValue)) {
      return ""
    }

    const newUrl = [
      JdbcUrl[DatabaseTypes[values.databaseTypeValue] as keyof typeof JdbcUrl],
      values.host,
      values.databaseTypeValue === DatabaseTypes.MSSQL && (isDefined(values.instance) && !isEmpty(values.instance)) ? `\\${values.instance}` : '',
      isDefined(values.port) && !isEmpty(values.port) ? `:${values.port}` : '',
      values.databaseTypeValue === DatabaseTypes.ORACLE ? `:${isDefined(values.sid) ? values.sid : ''}` : '', 
      isDefined(values.databaseName) && values.databaseTypeValue !== DatabaseTypes.ORACLE ? `${values.databaseTypeValue === DatabaseTypes.MSSQL || values.databaseTypeValue === DatabaseTypes.OPENEDGE ? ';databaseName=' : '/'}${values.databaseName}` : '',
      values.databaseTypeValue !== DatabaseTypes.ORACLE && isDefined(values.extraProperties) && !isEmpty(values.extraProperties) ? `${values.databaseTypeValue === DatabaseTypes.MSSQL || values.databaseTypeValue === DatabaseTypes.OPENEDGE ? ';' : '?'}${values.extraProperties.join(';')}` : '',
    ]
    
    return newUrl.join('')

  }, form);


  const initialValues = {
    tenantId: connection?.tenantId,
    connectionName: connection?.connectionName,
    databaseTypeValue: connection?.databaseTypeValue,
    host: connection?.host,
    databaseName: connection?.databaseName,
    instance: connection?.instance,
    service: connection?.service,
    informixServer: connection?.informixServer,
    informixOnline: connection?.informixOnline,
    port: connection?.port,
    sid: connection?.sid,
    dateFormat: connection?.dateFormat,
    decimalSeparator: connection?.decimalSeparator,
    password: connection?.password,
    username: connection?.username,
    url: connection?.url,
    extraProperties: connection?.extraProperties?.split(','),
  }

  const handleFormSubmit = () => {
    
    form.validateFields().then(fields => {
      console.log('fields > ', fields)
      isDefined(fields.tenantId) 
      ?  editConnection({...fields, url: url, extraProperties: fields.extraProperties?.join(','), companyId: connection?.companyId})
      : addConnection({...fields, url: url, extraProperties: fields.extraProperties?.join(',')})

    }).then(() => onFinish?.())
  }

  return  <Form
    form = {form}
    name = "addEditConnection"
    autoComplete="off"
    onFinish={handleFormSubmit}
    initialValues={initialValues}
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
  >
    <Form.Item
      label="Connection Id"
      name="tenantId"
      labelAlign="left"
    >
      <Input disabled variant="borderless"/>
    </Form.Item>
    <Form.Item
      label="Connection Name"
      name="connectionName"
      labelAlign="left"
      rules={[{ required: true, message: 'Please input connection name!' }]}
    >
      <Input placeholder="Input connection name" />
    </Form.Item>
    <Form.Item
      label="Database Type"
      name="databaseTypeValue"
      labelAlign="left"
      rules={[{ required: true, message: 'Please select connection database type!' }]}
    >
      <Select options={enumToOptions(DatabaseTypes)} placeholder="Select Database Type" />
    </Form.Item>
    <Form.Item
      label="Host"
      name="host"
      labelAlign="left"
      rules={[{ required: true, message: 'Please input connection host!' }, {validator: spaceValidator}]}
    >
      <Input placeholder="Input the host server" onChange={(e) => {
        e.target.value = e.target.value.replace(/\s/g, '');
      }} />
    </Form.Item>
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) => prevValues.databaseTypeValue !== currentValues.databaseTypeValue}
    >
      {({ getFieldValue }) =>
        getFieldValue('databaseTypeValue') === DatabaseTypes.INFORMIX ? (
          <Form.Item
            label="Serviço"
            name="service"
            labelAlign="left"
            rules={[{ required: true, message: 'Please input connection service!' }, {validator: spaceValidator}]}
          >
            <Input placeholder="Input the Service name" />
          </Form.Item>
        ) : null
      }
    </Form.Item>
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) => prevValues.databaseTypeValue !== currentValues.databaseTypeValue}
    >
      {({ getFieldValue }) =>
        getFieldValue('databaseTypeValue') === DatabaseTypes.INFORMIX ? (
          <Form.Item
            label="Informix Server"
            name="informixServer"
            labelAlign="left"
            rules={[{ required: true, message: 'Please input connection informix server!' }, {validator: spaceValidator}]}
          >
            <Input placeholder="Input the Informix Server name" />
          </Form.Item>
        ) : null
      }
    </Form.Item>
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) => prevValues.databaseTypeValue !== currentValues.databaseTypeValue}
    >
      {({ getFieldValue }) =>
        getFieldValue('databaseTypeValue') === DatabaseTypes.MSSQL ? (
          <Form.Item
            label="Instância"
            name="instance"
            labelAlign="left"
            rules={[{validator: spaceValidator}]}
          >
            <Input placeholder="Input the host server" />
          </Form.Item>
        ) : null
      }
    </Form.Item>
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) => prevValues.databaseTypeValue !== currentValues.databaseTypeValue}
    >
      {({ getFieldValue }) =>
        getFieldValue('databaseTypeValue') === DatabaseTypes.ORACLE 
          || getFieldValue('databaseTypeValue') === DatabaseTypes.MSSQL
          || getFieldValue('databaseTypeValue') === DatabaseTypes.MYSQL 
          || getFieldValue('databaseTypeValue') === DatabaseTypes.POSTGRE 
          || getFieldValue('databaseTypeValue') === DatabaseTypes.OPENEDGE ? (
          <Form.Item
            label="Porta"
            name="port"
            labelAlign="left"
            rules={[{ 
              required: getFieldValue('databaseTypeValue') === DatabaseTypes.ORACLE || getFieldValue('databaseTypeValue') === DatabaseTypes.MYSQL 
                || getFieldValue('databaseTypeValue') === DatabaseTypes.POSTGRE || getFieldValue('databaseTypeValue') === DatabaseTypes.OPENEDGE, 
              message: 'Please input connection database!' 
            }]}
          >
            <InputNumber placeholder="Input the host server" />
          </Form.Item>
        ) : null
      }
    </Form.Item>
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) => prevValues.databaseTypeValue !== currentValues.databaseTypeValue}
    >
      {({ getFieldValue }) =>
        getFieldValue('databaseTypeValue') === DatabaseTypes.ORACLE ? (
          <Form.Item
            label="SID"
            name="sid"
            labelAlign="left"
            rules={[{ required: true, message: 'Please input connection database!' }, {validator: spaceValidator}]}
          >
            <Input placeholder="Input the host server" />
          </Form.Item>
        ) : null
      }
    </Form.Item>
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) => prevValues.databaseTypeValue !== currentValues.databaseTypeValue}
    >
      {({ getFieldValue }) =>
        getFieldValue('databaseTypeValue') !== DatabaseTypes.ORACLE ? (
          <Form.Item
            label="Database Name"
            name="databaseName"
            labelAlign="left"
            rules={[{ required: true, message: 'Please input connection database!' }, {validator: spaceValidator}]}
          >
            <Input placeholder="Input the connection database" />
          </Form.Item>
        ) : null
      }
    </Form.Item>
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) => prevValues.databaseTypeValue !== currentValues.databaseTypeValue}
    >
      {({ getFieldValue }) =>
        isDefined(getFieldValue('databaseTypeValue')) && getFieldValue('databaseTypeValue') !== DatabaseTypes.ORACLE ? (
          <Form.Item
          label="Extra Properties"
          name="extraProperties"
          labelAlign="left"
        >
          <TagsInput initialTags={initialValues.extraProperties} />
        </Form.Item>
        ) : null
      }
    </Form.Item>
    <Form.Item
      label="Date Format"
      name="dateFormat"
      labelAlign="left"
      rules={[{ required: true, message: 'Please input connection date format!' }, {validator: spaceValidator}]}
    >
      <Input placeholder="Input the host server" />
    </Form.Item>
    <Form.Item
      label="Separador Decimal"
      name="decimalSeparator"
      labelAlign="left"
      rules={[{ required: true, message: 'Please input connection decimal separator!' }]}
    >
      <Radio.Group>
        <Radio value={DecimalSeparator.DOTE}> {DecimalSeparator.DOTE} (Ponto) </Radio>
        <Radio value={DecimalSeparator.COMA}> {DecimalSeparator.COMA} (Virgula) </Radio>
      </Radio.Group>      
    </Form.Item>
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) => prevValues.databaseTypeValue !== currentValues.databaseTypeValue}
    >
      {({ getFieldValue }) =>
        getFieldValue('databaseTypeValue') === DatabaseTypes.INFORMIX ? (
          <Form.Item
            label="Informix Online"
            name="informixOnline"
            labelAlign="left"
            valuePropName="checked"
          >
             <Checkbox />
          </Form.Item>
        ) : null
      }
    </Form.Item>
    <Divider/>
    <Form.Item
      label="User Name"
      name="username"
      labelAlign="left"
      rules={[{ required: true, message: 'Please input connection username!'}, {validator: spaceValidator}]}
    >
      <Input placeholder="Input Database login" />
    </Form.Item>
    <Form.Item
      label="Password"
      name="password"
      labelAlign="left"
      rules={[{ required: true, message: 'Please input connection password!' }]}
    >
      <Input.Password
        placeholder="Input Database password" 
        visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
      />
    </Form.Item>
    <Typography>
        <pre>url: {url}</pre>
      </Typography>
    <Form.Item wrapperCol={{ offset: 20 }}>
      <Button
        type="primary"
        loading={isAddingConnection || isEditingConnection}
        icon={<SaveOutlined />}
        htmlType="submit"
      >
        Save
      </Button>
    </Form.Item>
  </Form>
}

export default AddEditConnection;