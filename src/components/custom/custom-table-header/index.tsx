import { Input, Space, Typography } from 'antd'
import React, { MouseEventHandler, ReactNode } from 'react'

import './custom-table-header.css'

interface Props {
  title: ReactNode
  style?: React.CSSProperties 
  titleStyle?: React.CSSProperties 
  actions?: Action[]
  children: ReactNode
}

interface Action {
  onClick?: MouseEventHandler<HTMLSpanElement> | undefined;
  icon: ReactNode
}

const CustomTableHeader = (props: Props) => {
  return <Space.Compact direction='vertical' className='custom-table-wrapper'>
    <div className='custom-table-title' style={props.style}>
      <Typography.Text type='secondary' strong style={props.titleStyle}>
        {props.title}
      </Typography.Text>
      {
        props.actions && <Space.Compact style={{float: "right", gap: "4px"}}>
          {props.actions.map((action, i) => <span key={i} onClick={action.onClick} >{action.icon}</span>)}
        </Space.Compact>
      }
    </div>
    {props.children}
  </Space.Compact> 
}

export default CustomTableHeader
