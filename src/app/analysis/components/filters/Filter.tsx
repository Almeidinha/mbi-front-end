import React, { useEffect, useState } from 'react'
import { Button, Card, Space, Tooltip, Tree, TreeDataNode, Typography } from 'antd';

import { CubeStackIcon, DatabaseIcon, SetSquareIcon } from '@/lib/icons/customIcons';
import { CloseCircleOutlined, DeleteOutlined, DownOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { useIndFiltersQuery, useIndFiltersMutation } from '@/hooks/controllers/filters';
import { DimensionFilterDTO, FilterAction, FilterBuilderInput, FiltersDTO, MetricFiltersDTO, MetricSqlFiltersDTO } from '@/lib/types/Filter';
import { isDefined, isEmpty, isNil, safeArray, startCase, toLower, validStrValue } from '@/lib/helpers/safe-navigation';
import { FilterType } from './types';
import useAnalysisState from '../../hooks/use-analysis-state';
import AddFilterModal from './AddFilterModal';
import { findMetricFilter } from './helper';

import './filter.css'

interface ModalState {
  title: string;
  open: boolean;
}

interface ModalAction {
  filterType: FilterType;
  action: FilterAction;
  link: string
}


const getNodeName = (dimensionFilter: DimensionFilterDTO, link: string, filterType: FilterType, filterAction: Function) => {
  const title = validStrValue(dimensionFilter.connector) 
    ? dimensionFilter.connector
  : `${dimensionFilter.condition.field.title} ${dimensionFilter.condition.operator.description} (${dimensionFilter.condition.value})`

  return <Space className='title-wrapper'>
    <Typography.Text strong type="secondary" style={{float: 'right'}}>{title}</Typography.Text>
    {
      !validStrValue(dimensionFilter.connector) && <div className='icon-wrapper'>
        { filterType === FilterType.DIMENSION && <Tooltip title='Add'>
            <PlusOutlined onClick={() => filterAction(link, filterType, FilterAction.ADD)}/>
          </Tooltip>
        }
        <Tooltip title='Edit'>
          <EditOutlined  onClick={() => filterAction(link, filterType, FilterAction.UPDATE)}/>
        </Tooltip>
        <Tooltip title='Delete'>
          <DeleteOutlined onClick={() => filterAction(link, filterType, FilterAction.REMOVE)}/>
        </Tooltip>
      </div>
    }    
  </Space>
}

const getMainNodeTitle = (title: string, link: string, filterType: FilterType, filterAction: Function) => {
  return <Space className='title-wrapper'>
    <Typography.Text strong type="secondary" style={{float: 'right'}}>{title}</Typography.Text>
    <Tooltip title='Add'>
      <PlusOutlined onClick={() => filterAction(link, filterType, FilterAction.ADD)}/>
    </Tooltip>
  </Space>
}

const getFilterIcon = (dimensionFilter: DimensionFilterDTO) => { 
  if (validStrValue(dimensionFilter.connector)) {
    return null
  }
  return <CubeStackIcon style={{color:'#3377cc'}} />
}

const buildMetricTree = (metricFilters: MetricFiltersDTO | undefined, link: string, filterAction: Function): TreeDataNode[] => {
  
    if (isNil(metricFilters) || isEmpty(metricFilters)) {
      return []
    }
  
    return metricFilters.map((metricFilter, index) => {
      const nodeLink = `${link}-${index + 1}`
      return {
        title: getNodeName(metricFilter as DimensionFilterDTO, nodeLink, FilterType.METRIC, filterAction),
        icon: <SetSquareIcon style={{color:'#3377cc'}}/>,
        key: nodeLink,
        children: []
      }
    })  
}

const buildMetricSqlTree = (metricSqlFilters: MetricSqlFiltersDTO | undefined, link: string, filterAction: Function): TreeDataNode[] => {
  
  if (isNil(metricSqlFilters) || isEmpty(metricSqlFilters)) {
    return []
  }

  return metricSqlFilters.map((metricSqlFilter, index) => {
    const nodeLink = `${link}-${index + 1}`
    return {
      title: getNodeName(metricSqlFilter as DimensionFilterDTO, nodeLink, FilterType.METRIC_SQL, filterAction),
      icon: <DatabaseIcon style={{color:'#3377cc'}}/>,
      key: nodeLink,
      children: []
    }
  })  
}

const buildDimensionTree = (dimensionFilter: DimensionFilterDTO | undefined, link: string, filterAction: Function): TreeDataNode[] => {

  if (isNil(dimensionFilter)) {
    return []
  }

  return [{
    title: getNodeName(dimensionFilter, link, FilterType.DIMENSION, filterAction),
    icon: getFilterIcon(dimensionFilter),
    key: link,
    children: safeArray(dimensionFilter?.filters).map((filter, index) => buildDimensionTree(filter, `${link}-${index + 1}`, filterAction)).flat()
  }]
}


const treeData = (filters: FiltersDTO | undefined, filterAction: Function): TreeDataNode[] => {
  if (isNil(filters)) {
    return []
  }
  
  return [{
      title: getMainNodeTitle("Dimensões", '1', FilterType.DIMENSION, filterAction),
      key: "dimension-1",
      children: buildDimensionTree(filters.dimensionFilter, '1', filterAction)
    },
    {
      title: getMainNodeTitle("Métricas", '2', FilterType.METRIC, filterAction),
      key: "metric-2",
      children: buildMetricTree(filters.metricFilters, '2', filterAction)
    },
    {
      title: getMainNodeTitle("Métricas SQL", '4', FilterType.METRIC_SQL, filterAction),
      key: "metric-sql-4",
      children: buildMetricSqlTree(filters.metricSqlFilter, '4', filterAction)
    },
    /*{
      title: "Funções",
      key: "3",
      children: buildDimensionTree(filters.dimensionFilter, '3')
    }*/
  ]
}

const AnalysisFilter = (props: {indicatorId: number, onFinish?: () => void}) => {

  const { indicatorId } = props

  const {
    indicator,
    filters: stateFilters,
    setFilters,
    updateEditingFilter
  } = useAnalysisState.useContainer()

  const {
    indFilters,
    loadingIndFilters,
  } = useIndFiltersQuery({indicatorId})

  const {
    updateIndFilter,
    updatingFilter,
    removeFilterMutation,
    filtersAfterRemove,
  } = useIndFiltersMutation()

  useEffect(() => {
    
    if (isDefined(indFilters)) {
      setFilters(indFilters)
    }

    if (isDefined(filtersAfterRemove)) {
      setFilters(filtersAfterRemove)
    }

  }, [indFilters, filtersAfterRemove, setFilters])

  const [modalState, setModalState] = useState<ModalState>({title: '', open: false});
  const [modalAction, setModalAction] = useState<ModalAction>({filterType: FilterType.DIMENSION, action: FilterAction.ADD, link: ''});

  const filterAction = (link: string, filterType: FilterType, action : FilterAction) => {  
    
    if (action === FilterAction.ADD || action === FilterAction.REMOVE) { 
      updateEditingFilter(undefined, link)
    }

    if (action === FilterAction.REMOVE) { 
      
      const input: FilterBuilderInput = {
        filters: {...stateFilters!},
        link: link,
      }

      if (filterType !== FilterType.DIMENSION) {

        const metricFilter = findMetricFilter(stateFilters, link)
        const condition = metricFilter?.condition
        if (isDefined(condition)) {
          input.field =  condition.field;
          input.operator = condition.operator.symbol;
          input.value = condition.value;        
        }
      }

      removeFilterMutation({
        input: {
          ...input              
        },
        indicatorId: indicator!.code!
      })
      return
    }

    setModalAction({filterType, action, link})

    if (action === FilterAction.UPDATE) {
      updateEditingFilter(filterType, link)
    }

    setModalState((prev) => ({
      ...prev, 
      title: `${action} ${filterType} filter.`, 
      open: true
    }))
  }

  return <Space direction='vertical' style={{width: '100%'}}>
    <Card loading={loadingIndFilters}
      className='filter-card'
      bodyStyle={{borderTopRightRadius: '8px', borderTopLeftRadius: '8px'}}
    >    
      <Tree
        className='filter-tree'
        showLine
        showIcon
        switcherIcon={<DownOutlined style={{color: "#4182bc"}} />}
        defaultExpandAll={true}
        selectable={false}
        treeData={treeData(stateFilters || indFilters, filterAction)}
      />
    </Card>
    <Space style={{width: '100%', flexDirection: 'row-reverse'}}>              
    <Button 
      type='primary'
      icon={<SaveOutlined/>} 
      loading={loadingIndFilters || updatingFilter}
      onClick={() => updateIndFilter({indicatorId, dto: stateFilters!, onSuccess: props.onFinish})}>Save
    </Button>
    </Space>
    <AddFilterModal
      title={startCase(toLower(modalState.title))}
      open={modalState.open}      
      destroyOnClose={true}
      onFinish={() => setModalState((prev) => ({...prev, open: false}))}
      onCancel={() => setModalState((prev) => ({...prev, open: false}))}
      closeIcon={<CloseCircleOutlined />}
      filterType={modalAction.filterType}
      footer={null}
      link={modalAction.link}
      action={modalAction.action}
    />
  </Space>
}

export default AnalysisFilter
