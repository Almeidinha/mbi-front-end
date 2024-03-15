import { GenericFilter } from '@/lib/types/Filter'
import { Button, List } from 'antd'
import React from 'react'

interface IDimensionFilter {
  biDimensionFilter: GenericFilter
}


const DimensionFilters = () => {
  return <List
    bordered
    footer={<Button type="primary" block>Adicionar</Button>}
  />
}

export default DimensionFilters
