import { startCase, toLower } from "lodash";

const enumToOptions = (enumObj: { [key: string]: any }, disabledValues: Array<string | number> = [], labelName: string = 'label', valueName: string = 'value'): { [x: string]: any; }[] => {
  if (!enumObj) {
    return [];
  }
  return (Object.keys(enumObj)
    .filter(key => isNaN(Number(key))) || [])
    .map(key => ({
      [labelName]: startCase(toLower(key)),
      [valueName]: enumObj[key],
      disabled: disabledValues.includes(enumObj[key])
    }))
}

export default enumToOptions