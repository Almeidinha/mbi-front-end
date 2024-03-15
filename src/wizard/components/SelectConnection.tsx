import { Card, Form, Modal, Select, Space } from "antd"
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useWizardState from "../hooks/use-wizard-state";
import { isDefined } from "@/lib/helpers/safe-navigation";
import { useConnectionsController } from "@/hooks/controllers/connections";
import { defaultTo } from "lodash";
import { selectFilterOption, selectFilterSort } from "@/lib/helpers/select";

export const SelectConnection: React.FC = () => {

  const {
    connection,
    setConnection,
  } = useWizardState.useContainer()

  const {
    connections,
    loadingConnections
  } = useConnectionsController()

  const [modal, contextHolder] = Modal.useModal();

  const conns = defaultTo(connections, []).map((conn) => ({
    label: conn.connectionName,
    value: conn.tenantId
  }))

  const handleConnectionChange = (value: string) => {
    if (isDefined(connection)) {
      modal.confirm({
        title: 'Change connection?',
        icon: <ExclamationCircleOutlined />,
        content: 'The connection is changing, all wizard data will be reset',
        onOk: () => setConnection(connections?.find((conn) => conn.tenantId === value))
      });
    } else {
      setConnection(connections?.find((conn) => conn.tenantId === value))
    }
  }

  return <Card type="inner">
    <Space direction="horizontal" style={{width:"100%", flexFlow:"column-reverse", marginTop: "24px"}}>
      <Form.Item
        label="Select a Connection"
      >
        <Select
          options={conns}
          showSearch
          value={connection?.tenantId}
          onChange={handleConnectionChange}
          style={{ width: 200 }}
          loading={loadingConnections}
          filterOption={selectFilterOption}
          filterSort={selectFilterSort}
        />
      </Form.Item>
    </Space>
    { contextHolder }
  </Card>
}