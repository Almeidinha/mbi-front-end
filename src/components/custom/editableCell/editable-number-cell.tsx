import type { InputRef } from 'antd';
import { Form, Input, Table } from "antd"
import React, { useEffect, useRef, useState } from "react"
import { isEmpty } from '@/lib/helpers/safe-navigation';

import './editable-number-cell.css'


interface EditableNumberCellProps<T> {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof T
  record: T
  handleSave: (record: T) => void
}

type EditableTableProps = Parameters<typeof Table>[0]
export type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

/*
Add this to your table:
rowClassName={() => 'editable-row'}
*/
export const EditableNumberCell = <T,>(props: EditableNumberCellProps<T>) => {

  const {
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  } = props


  const [editing, setEditing] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const [form] = Form.useForm();

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()

      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  const childNode = editable 
  ? editing 
    ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex as any}
        rules={[
          () => ({
            validator(_, value) {
              if (isEmpty(value)) {
                return Promise.reject(`Field is required.`);
              }
              if (isNaN(value)) {
                return Promise.reject(`Field is required.`);
              }
              if (value < 0) {
                return Promise.reject(`Field Cant be negative`);
              }
              if (value > 11) {
                return Promise.reject(`Field Cant be Greater than 10`);
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input type='number' min={0} max={10} ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) 
    : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        {children}
      </div>
    ) 
  : children

  return <Form form={form} component={false}>
    <td {...restProps}>{childNode}</td>
  </Form>
  
  
}