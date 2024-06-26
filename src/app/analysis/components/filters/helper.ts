import { isDefined } from "@/lib/helpers/safe-navigation";
import { DimensionFilterDTO, FiltersDTO, MetricFilterDTO } from "@/lib/types/Filter";
import { isArray } from "lodash";

export const findDimensionsHierarchy = (filters: FiltersDTO | undefined, link: string) => {

  const dimensionFilter: DimensionFilterDTO = filters!.dimensionFilter

  if (link.startsWith('1')) {
      
      if (dimensionFilter !== null) {
        let childFilter: DimensionFilterDTO = dimensionFilter;
        let parentFilter: DimensionFilterDTO | null = null;

        if (link.length > 1 && link.substring(2) !== "0") {
          link = link.substring(2);
          const strTok: string[] = link.split("-");
          let nxt: string;
          
          for (const token of strTok) {
            nxt = token;
            parentFilter = childFilter;
            childFilter = childFilter.filters[parseInt(nxt) - 1];
          }
        }
        return {childFilter, parentFilter};            
      }
  }
}

const findMetricFilters = (metricFilters: MetricFilterDTO[], link: string): MetricFilterDTO | undefined => {
  return metricFilterLookUp(metricFilters, link)
}


const findMetricSqlFilters = (metricSqlFilters: MetricFilterDTO[], link: string): MetricFilterDTO | undefined => {  
  return metricFilterLookUp(metricSqlFilters, link)
}

const metricFilterLookUp = (metricFilters: MetricFilterDTO[], link: string): MetricFilterDTO | undefined => {
  if (isDefined(metricFilters) && isArray(metricFilters)) {
    return metricFilters[parseInt(link.slice(-1)) - 1]
  }
}

export const findMetricFilter = (filters: FiltersDTO | undefined, link: string): MetricFilterDTO | undefined => {
  if (link.startsWith('2')) {
    return findMetricFilters(filters!.metricFilters, link)
  }
  if (link.startsWith('4')) {
    return findMetricSqlFilters(filters!.metricSqlFilter, link)
  }

}

export const getKeyByValue = <T extends object>(value: string, type: T)  => {
  const indexOfS = Object.values(type).indexOf(value as unknown as T);

  const key = Object.keys(type)[indexOfS];

  return key;
}

export const getValueByKey = <T extends object>(value: string, type: T)  => {
  const indexOfS = Object.values(type).indexOf(value as unknown as T)

  const key = Object.values(type)[indexOfS]

  return key;
}

