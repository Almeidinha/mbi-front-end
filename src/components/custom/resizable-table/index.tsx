"use client"

import { Table, TableColumnsType, TableProps } from 'antd'
import React, { useState } from 'react'
import { ResizableTitle } from '../resizable-title'
import { defaultTo, isDefined } from '@/lib/helpers/safe-navigation';
import { ResizeCallbackData } from 'react-resizable';

import './resizableTable.css'

type DataType = {
  [key: string]: any
}

const ResizableTable = (props:TableProps) => {

  const [columns, setColumns] = useState<TableColumnsType<DataType> | undefined>(defaultTo(props.columns, [])
    .map((col, index) => ({
      ...col,
      onHeaderCell: (column: TableColumnsType<DataType>[number]) => ({
        width: column.width,
        onResize: handleResize(index) as React.ReactEventHandler<any>,
      }),
    }))
  )

  if (!isDefined(columns)){
    return null
  }

  const handleResize: Function = (index: number) => (_: React.SyntheticEvent<Element>, { size }: ResizeCallbackData) => {
    console.log('size > ', size)
    const newColumns = [...columns];
    newColumns[index] = {
      ...newColumns[index],
      width: size.width,
    };
    console.log('newColumns > ', newColumns);
    setColumns(newColumns);
  };
  
  return <Table
    {...props}
    columns={columns}
    components={{
      header: {
        cell: ResizableTitle,
      },
    }}
  />
}

export default ResizableTable
