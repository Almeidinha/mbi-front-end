import useWizardState from "@/wizard/hooks/use-wizard-state";
import { Endpoint } from "../types";
import { Button, Modal, Popconfirm, Space } from "antd";

interface LinkModalProps {
  editingLink: Endpoint | null;
  setEditingLink: React.Dispatch<React.SetStateAction<Endpoint | null>>;
}

const LinkModal: React.FC<LinkModalProps> = (props) => {
  
  const { setLinkDict } = useWizardState.useContainer();

  const { editingLink, setEditingLink } = props;

  const changeRelation = (relation: string) => {
    if (!editingLink) return;

    const { id, fieldId } = editingLink;
    setLinkDict((state) => {
      return {
        ...state,
        [id]: {
          ...state[id],
          endpoints: state[id].endpoints.map((endpoint: Endpoint) => {
            if (endpoint.fieldId === fieldId) {
              return {
                ...endpoint,
                relation,
              };
            }
            if (relation === "*" && endpoint.fieldId !== fieldId) {
              return {
                ...endpoint,
                relation: "1",
              };
            }
            return endpoint;
          }),
        },
      };
    });
    setEditingLink(null);
  };

  const removeLink = () => {
    if (!editingLink) return;

    const { id } = editingLink;
    setLinkDict((state) => {
      const newState = { ...state };
      delete newState[id];
      return newState;
    });
    setEditingLink(null);
  };

  return (
    <Modal
      title="Link"
      open={!!editingLink}
      onCancel={() => setEditingLink(null)}
      footer={null}
      centered={true}
      destroyOnClose={true}
    >
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Space>
          <label>Change relation:</label>
          <Button
            type="primary"
            onClick={() => {
              changeRelation("1");
            }}
          >
            1
          </Button>
          <Button
            type="primary"
            onClick={() => {
              changeRelation("*");
            }}
          >
            *
          </Button>
        </Space>
        <Popconfirm
          title="Are you sure to delete this path?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => {
            removeLink();
          }}
        >
          <Button>Delete Path</Button>
        </Popconfirm>
      </Space>
    </Modal>
  );
};

export default LinkModal;
