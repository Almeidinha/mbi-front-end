import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from "@ant-design/icons"

export enum MessageType {
  INFO = 'INFO',
  ALERT = 'ALERT',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export const getMessageIcon = (type: MessageType) => {
  const getIcon = {
    'INFO': <InfoCircleOutlined style={{color: 'blue'}} />,
    'ALERT': <ExclamationCircleOutlined style={{color: 'orange'}} />,
    'ERROR': <ExclamationCircleOutlined style={{color: 'red'}} />,
    'SUCCESS': <CheckCircleOutlined style={{color: 'green'}} />,
    'DEFAULT': <InfoCircleOutlined style={{color: 'blue'}} />,
  }

  return getIcon[type] || getIcon['DEFAULT']
}