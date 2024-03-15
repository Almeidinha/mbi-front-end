"use client"

import React, { useEffect } from "react"

import { Space, Steps } from "antd"
import { TabletFilled, DatabaseFilled, SnippetsFilled } from '@ant-design/icons';
import { SelectConnection } from "./components/SelectConnection";
import SelectTables from "./components/SelectTables";
import SelectFields from "./components/SelectFields";
import useWizardState from "./hooks/use-wizard-state";
import { isNil } from "lodash";
import { isEmpty } from "@/lib/helpers/safe-navigation";
import Relations from "./components/Relations";
import FieldsConfiguration from "./components/FieldsConfiguration";
import SelectPermissions from "./components/SelectPermissions";
import SaveAnalysis from "./components/SaveAnalysis";

type StepType = {
  title: String,
  content: React.ReactNode,
  icon: React.ReactNode,
  disabled: boolean
}

export const Wizard: React.FC = () => {

  const {
    currentStep,
    setCurrentStep,
    connection,
    tableList,
    setBox,
    metrics,
    dimensions,
    permissions,
    databaseTableList
  } = useWizardState.useContainer()


  useEffect(() => {
    setBox({
      x: -70,
      y: -35,
      w: 1024,
      h: 780,
      clientW: 1024,
      clientH: 780
    })
  }, [setBox])


  const onChange = (value: number) => {
    setCurrentStep(value);
  };

  const steps: StepType[] = [
    {
      title: "Conexão",
      content: <SelectConnection/>,
      disabled: false,
      icon: <DatabaseFilled />
    },
    {
      title: "Tabelas",
      content: <SelectTables/>,
      disabled: isNil(connection),
      icon: <TabletFilled />
    },
    {
      title: "Relações",
      content: <Relations/>,
      disabled: isEmpty(databaseTableList),
      icon: <SnippetsFilled />
    },
    {
      title: "Campos",
      content: <SelectFields/>,
      disabled: (currentStep < 2) || isEmpty(tableList),
      icon: <SnippetsFilled />
    },
    {
      title: "Configurações",
      content: <FieldsConfiguration/>,
      disabled: (currentStep < 3) || (isEmpty(dimensions) || isEmpty(tableList)),
      icon: <SnippetsFilled />
    },
    {
      title: "Permissões",
      content: <SelectPermissions/>,
      disabled: (currentStep < 4) || isEmpty(tableList),
      icon: <SnippetsFilled />
    },
    {
      title: "Finalizar",
      content: <SaveAnalysis/>,
      disabled: isEmpty(permissions),
      icon: <SnippetsFilled />
    }
    
  ]

  const items = steps.map(item => ({
    title: item.title,
    disabled: item.disabled,
  }))


  return <Space direction="vertical" style={{width: "100%"}}>
    <Steps
      current={currentStep}
      onChange={onChange}
      items={items}
    />
    {
      steps[currentStep].content
    }
  </Space>
}