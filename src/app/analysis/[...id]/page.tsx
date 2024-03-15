"use client"

import React from 'react'
import AnalysisView from './AnalysisView'
import { useParams } from 'next/navigation'
import { getIdFromParameters } from '@/lib/helpers/safe-navigation'
import { toNumber } from 'lodash'
import { Card } from 'antd'
import AnalysisContainer from '../hooks/use-analysis-state'

const AnalysisPage = () => {
  
  const params = useParams()
  const indicatorId = getIdFromParameters(params, 'id')
  
  return <Card title="Analysis View">
    <AnalysisContainer.Provider>
      <AnalysisView indicatorId={toNumber(indicatorId)}/>
    </AnalysisContainer.Provider>
  </Card>
}

export default AnalysisPage
