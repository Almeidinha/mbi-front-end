"use client"

import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { decrement, increment, incrementByAmount } from './redux/features/counter/counter-slice'
import { Button, Divider, Input, InputNumber, List, Select, Space, Typography } from 'antd'
import { useGetBreedsQuery } from './redux/features/dogs/dogs-api-slice'
import Image from 'next/image'

const TestPage = () => {

  const [numDogs, setNumDogs] = useState<string>('5')
  const [customValue, setCustomValue] = useState<number | null>(0)
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  const {
    data = [], isFetching, error
  } = useGetBreedsQuery(+numDogs)

  return (
    <Space direction='vertical'>
      <Divider orientation='left'>Counter</Divider>
      <Typography.Text>Count: {count}</Typography.Text>
      <Space direction='vertical'>
        <Space direction='horizontal'>
          <Button onClick={() => dispatch(increment())}>Increment</Button>
          <Button onClick={() => dispatch(decrement())}>Decrement</Button>  
        </Space> 
        <Space direction='horizontal'>
          <InputNumber value={customValue} onChange={setCustomValue}/>
          <Button onClick={() => dispatch(incrementByAmount(customValue!))} >Increment by amount</Button>
        </Space>
      </Space>
      <Divider orientation='left'>Dogs</Divider>
      <Typography.Text>Number of Dogs: {data.length}</Typography.Text>
      <Select value={numDogs} options={[
          {label: '5', value: 5},
          {label: '10', value: 10},
          {label: '15', value: 15},
          {label: '20', value: 20},
        ]} onChange={setNumDogs}/>    
      <List
        loading={isFetching}
        dataSource={data}
        renderItem={(item) => (
          <List.Item
          extra={
            <Image
              width={272}
              height={200}
              alt="logo"
              src={item.image.url}
            />
          }
          >
            <Typography.Text>{item.name}</Typography.Text>            
          </List.Item>
        )}
      />
    </Space> 
  )
}

export default TestPage
