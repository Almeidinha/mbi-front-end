import { IndicatorDTO } from "@/lib/types/Analysis";
import { FilterType, FiltersDTO } from "@/lib/types/Filter";
import { useState } from "react";
import { createContainer } from "unstated-next"
import { findDimensionsHierarchy, findMetricFilter, getKeyByValue, getValueByKey } from "../components/filters/helper";
import { isDefined } from "@/lib/helpers/safe-navigation";
import { ConnectorType, EditingFilter, OperatorTypeValues } from "../components/filters/types";
import { defaultTo, isNil, startCase } from "lodash";


interface AnalysisState {
  synchronized: boolean;
  setSynchronized: React.Dispatch<React.SetStateAction<boolean>>;
  indicator: IndicatorDTO | undefined;
  setIndicator: React.Dispatch<React.SetStateAction<IndicatorDTO | undefined>>;
  filters: FiltersDTO | undefined;
  setFilters: React.Dispatch<React.SetStateAction<FiltersDTO | undefined>>;
  editingFilter: EditingFilter | undefined;
  updateDimensionFilter: (link: string, operator: string, value: string) => void;
  updateMetricFilter: (link: string, operator: string, value: string) => void;
  updateEditingFilter: (filterType: FilterType | undefined, link: string) => void;
}

const useAnalysisState = (): AnalysisState => {

  const [indicator, setIndicator] = useState<IndicatorDTO | undefined>(undefined)
  const [filters, setFilters] = useState<FiltersDTO | undefined>(undefined)
  const [synchronized, setSynchronized] = useState<boolean>(true)
  const [editingFilter, setEditingFilter] = useState<EditingFilter | undefined>(undefined)

  const updateEditingFilter = (filterType: FilterType | undefined, link: string) => {
    
    if(isNil(filterType)) {
      return setEditingFilter(undefined)
    }

    if (filterType === FilterType.DIMENSION) {
      const dimensionsHierarchy = findDimensionsHierarchy(filters, link)
      if (isDefined(dimensionsHierarchy)) {
        const {childFilter, parentFilter} = dimensionsHierarchy
        setEditingFilter({
          connector: getKeyByValue(defaultTo(parentFilter?.connector, "AND"), ConnectorType) as ConnectorType, 
          field: childFilter.condition.field.fieldId, 
          operator: childFilter.condition.operator.symbol as OperatorTypeValues, 
          value: childFilter.condition.value
        })
      }
    } else {

      const filter = findMetricFilter(filters, link)
      setEditingFilter({
        connector: ConnectorType.AND,
        field: filter?.condition.field.fieldId, 
        operator: getValueByKey(filter?.condition.operator.symbol!, OperatorTypeValues) as OperatorTypeValues, 
        value: filter?.condition.value
      })
    }
  }

  const updateDimensionFilter = (link: string, operator: string, value: string) => {
    const dimensionsHierarchy = findDimensionsHierarchy(filters, link)

    if (dimensionsHierarchy) {
      const {childFilter} = dimensionsHierarchy
      childFilter.condition.operator.symbol = operator, 
      childFilter.condition.operator.description = startCase(getKeyByValue(operator, OperatorTypeValues) as OperatorTypeValues).toLocaleLowerCase(), 
      childFilter.condition.value = value
      childFilter.condition.valuesMap = value.split(";").reduce((acc: any, curr: any, index: number) => ({ ...acc, [index + 1]: curr }), {})
    }

  }

  const updateMetricFilter = (link: string, operator: string, value: string) => {
    const metricFilter = findMetricFilter(filters, link)
    
    if (isDefined(metricFilter)) {
      metricFilter.condition.operator.symbol = operator
      metricFilter.condition.operator.description = startCase(getKeyByValue(operator, OperatorTypeValues) as OperatorTypeValues).toLocaleLowerCase(), 
      metricFilter.condition.value = value
    }
  }
  

  return {
    indicator,
    setIndicator,
    filters,
    setFilters,
    synchronized,
    setSynchronized,
    editingFilter,
    updateEditingFilter,
    updateDimensionFilter,
    updateMetricFilter
  }
}

export default createContainer(useAnalysisState)