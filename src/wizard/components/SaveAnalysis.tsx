import { useAnalysisController } from '@/hooks/controllers/analysis'
import { useAreaListController } from '@/hooks/controllers/area'
import { Button, Card, Col, Form, Input, Modal, Row, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React, { useEffect } from 'react'
import useWizardState from '../hooks/use-wizard-state'
import { debounce, isEmpty, isNil } from 'lodash'
import { QuestionCircleOutlined, SaveOutlined } from '@ant-design/icons'
import { AnalysisInput } from '../types'
import { AggregationType, AnalyticType, Endpoint, FieldType, LinkDict, UserDataType } from '@/ERDEngine/types'
import { defaultTo, is, isDefined } from '@/lib/helpers/safe-navigation'
import { Field } from '@/lib/types/Analysis'
import { navigate } from '@/app/api/redirect'

const SaveAnalysis = () => {

  const [form] = useForm()

  const {
    areas,
    loadingAreas,
    isError
  } = useAreaListController();

  const {
    addAnalysis,
    isAddingAnalysis,
    editAnalysis,
    isEditingAnalysis,
    newIndicator,
    indicatorUpdated,
    updatedIndicator,
    indicatorCreated,
  } = useAnalysisController({})

  const {
    areaId,
    setAreaId,
    analysisName,
    setAnalysisName,
    dimensions,
    metrics,
    tableList,
    linkDict,
    permissions,
    tenantId,
    dbAnalysis,
    setDdbAnalysis
  } = useWizardState.useContainer();

  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {

    const shouldRedirect = (id: number) => {
      modal.confirm({
        title: 'indicvador Criado!',
        icon: <QuestionCircleOutlined />,
        content: 'Deseja Abrilo ou ir para a Lista?',
        footer: (_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <Button onClick={() => navigate('analysis/list')}>List</Button>
            <OkBtn/>
          </>
        ),
        okText: 'Abrir',
        onOk: () => navigate(`analysis/${id}`),
      });
    }

    if (is(indicatorUpdated)) {
      setDdbAnalysis(updatedIndicator)
    }

    if (!is(indicatorUpdated) && is(indicatorCreated)) {
      setDdbAnalysis(newIndicator)
    }

    if (is(indicatorUpdated) || is(indicatorCreated)) {
      shouldRedirect(newIndicator?.id! || updatedIndicator?.id!)  
    }
    
    

  },[indicatorCreated, newIndicator, updatedIndicator, indicatorUpdated, setDdbAnalysis, modal])


 
  const handleFormSubmit = () => {
    
    form.validateFields().then(formFields => {

      const fields: Field[] =  getFields([...dimensions, ...metrics])
      const fromClause = "FROM " + tableList.map((table) => `${table.name} ${table.name}`).join(", ")
      
      const searchClause = "SELECT " + fields.map((field) => {
        if (field.aggregationType !== AggregationType.EMPTY) {
          return `${field.aggregationType}(${field.tableNickname}.${field.name}) ${field.nickname}`  
        }
        return `${field.tableNickname}.${field.name} ${field.nickname}`
      }).join(", ")

      const links = insureLinksHasNoDuplicates()

      const whereClause = "WHERE " + (isEmpty(links) ? '1 = 1' : links.map((link: LinkDict) => {
        const endPoints = link.endpoints;
                
        return `${getTableFieldName(endPoints[0])} = ${getTableFieldName(endPoints[1])}`
      }).join(" AND "))

      const analysis: AnalysisInput = {
        id: dbAnalysis?.id,
        biAreaByArea: {
          ...dbAnalysis?.biAreaByArea,
          id: formFields.areaId
        },
        userId: 1,
        connectionId: tenantId!,
        name: formFields.analysisName,
        biAnalysisFields: fields,
        biFromClause: {
          ...dbAnalysis?.biFromClause,
          sqlText: fromClause
        },
        biSearchClause: {
          ...dbAnalysis?.biSearchClause,
          sqlText: searchClause
        },
        biWhereClause: {
          ...dbAnalysis?.biWhereClause,
          sqlText: whereClause
        },
        permissions: permissions      
      }

      saveOrUpdateIndicator(analysis)
      
    })
  }

  const saveOrUpdateIndicator = (analysis: AnalysisInput) => {
    
    isDefined(analysis?.id ) 
      ? editAnalysis({
        analysis: {
          ...analysis,
          id: analysis.id
        }}
      ) 
      : addAnalysis({analysis: analysis}) 
  }

  const insureLinksHasNoDuplicates = () => {
    const links = Object.values(linkDict);
    return links.filter((obj, index) => {
      return links.findIndex((item) => item.endpoints[0].id === obj.endpoints[0].id 
          && item.endpoints[0].fieldId === obj.endpoints[0].fieldId) === index
          && links.findIndex((item) => item.endpoints[1].id === obj.endpoints[1].id 
          && item.endpoints[1].fieldId === obj.endpoints[1].fieldId) === index
    })
  }

  const getTableFieldName = (endPoint: Endpoint) => {
    return `${getTableName(endPoint.id)}.${getFieldName(endPoint.id, endPoint.fieldId)}`
  }

  const getTableName = (tableId: string) => {
    return defaultTo(tableList, []).find((table) => table.id === tableId)?.name || ""
  }

  const getFieldName = (tableId: string, fieldId: string) => {
    const table = defaultTo(tableList, []).find((table) => table.id === tableId)
    
    if (isNil(table)) {
      return ""
    }

    return table.fields.find((field) => field.id === fieldId)?.name || ""
  }

  const searchForFieldId = (field: FieldType) => {
    if (isNil(dbAnalysis)) {
      return undefined
    }
    return defaultTo(dbAnalysis.biAnalysisFields, [])
      .find((analysisField) => analysisField.tableNickname === field.tableName 
        &&  analysisField.name === field.nickname)?.fieldId
  }

  const getFields = (rawFields: FieldType[]): Field[] => {
    return rawFields.map((field) => ({
      fieldId: searchForFieldId(field),
      indicatorId: dbAnalysis?.id,
      name: field.name,
      title: field.title!,
      fieldType: field.analyticType === AnalyticType.DIMENSION ? 'D' : "M",
      dataType: field.analyticType === AnalyticType.METRIC ? "N" : getDatatypeAbr(field.userDataType!),
      nickname: field.nickname!,
      expression: false,
      filterSequence: field.analyticType === AnalyticType.DIMENSION ? field.drillDownLevel! : 0,
      visualizationSequence: field.visualizationOrder!,
      defaultField: field.initiallyVisible! ? "S" : "N",
      fieldOrder: 0,
      tableNickname: field.tableName,
      direction: 'ASC',
      decimalPosition: 0,
      fieldTotalization: false,
      vertical: "N",
      aggregationType: field.aggregationType!,
      accumulatedShare: "N",
      accumulatedValue: false,
      localApres: 0,
      columnWidth: 100,
      columnAlignment: field.analyticType === AnalyticType.DIMENSION ? 'E' : 'D',
      horizontal: "N",
      lineFieldTotalization: false,
      accumulatedLineField: false,
      partialTotalization: false,
      horizontalParticipation: false,
      accumulatedHorizontalParticipation: false,
      accumulatedOrder: 0,
      accumulatedOrderDirection: 'ASC',
      usesLineMetric: false,
      fixedValue: false,
      originalAnalysisField: 0,
      drillDown: field.analyticType === AnalyticType.DIMENSION ? true : false,
      generalFilter: 0,
      mandatoryFilter: false,
    }))
  }

  const getDatatypeAbr =  (type: UserDataType) => {
    switch (type) {
      case UserDataType.DATE:
        return "D"
      case UserDataType.NUMBER:
        return "N"
      case UserDataType.STRING:
        return "S"
      default:
        return "S"
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnalysisName(e.target.value)
  }

  const initialValues = {
    areaId: areaId,
    analysisName: analysisName
  }

  return <Card type="inner">
    <Row>
      <Col span={12} offset={6}>
        <Form
          className='save-analysis-form'
          form = {form}
          size='middle'
          initialValues={initialValues}
          name = "saveAnalysisForm"
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={handleFormSubmit}
        >
          <Form.Item
            label="Area"
            name="areaId"
            labelAlign="left"
            rules={[{ required: true, message: 'Please select area!' }]}
          >
            <Select  options={defaultTo(areas, []).map((area) => ({
              label: area.description,
              value: area.id
              }))} 
              loading={loadingAreas}
              onChange={setAreaId}
            />
          </Form.Item>
          <Form.Item
            label="Analysis Name"
            name="analysisName"
            labelAlign="left"
            rules={[{ required: true, message: 'Please input analysis name!' }]}
          >
            <Input onChange={debounce(onInputChange, 500)}/>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 24 }}>
            <Button 
              type='primary' 
              htmlType="submit" 
              icon={<SaveOutlined />} 
              style={{float: 'right'}}
              loading={isAddingAnalysis || isEditingAnalysis}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
    {contextHolder}
  </Card>
}

export default SaveAnalysis
