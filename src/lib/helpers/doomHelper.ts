import { defaultTo, kebabCase, snakeCase } from "lodash";
import { ITableStyles } from "../types/Analysis";

interface Style {
  [key: string]: string;
}

export const stringToStyleArray = (input: string, split: boolean = true): string[] => {
  const styles: string[] = [];
  const dom = new DOMParser().parseFromString(input, "text/html");
  dom.querySelectorAll('[style]').forEach((el: Element) => {
    const styleAttribute = el.getAttribute("style");
    if (styleAttribute) {
      if (split) {
        styles.push(...styleAttribute.split(';'));
      } else {
        styles.push(styleAttribute);
      }
    }
  })
  return styles;
}

export const extractPropValue = (html: string, propName: string): string | null => {
  const dom = new DOMParser().parseFromString(html, "text/html");
  if (!dom) {
      return null;
  }
  
  const element = dom.querySelector(`[${propName}]`);
  if (!element) {
      return null;
  }
  
  return element.getAttribute(propName);
}

export const convertToStyleTag = (styles: ITableStyles[]): string =>{
  let styleString = '<style>';

  for (const className in styles) {
    styleString += `.${className} {`;

    const classProperties = styles[className];
    for (const property in classProperties) {
      const snakeCaseProperty = kebabCase(property);
      styleString += `  ${snakeCaseProperty}: ${classProperties[property]};`;
    }

    styleString += ` }\n`;
  }

  styleString += '</style>';
  return styleString;
}

export const getCellStyles = (className: string, styles: any): Style | undefined => {    
  const classNames = defaultTo(className?.split(' '), []);

  return classNames.reduce((acc: Style | undefined, currClassName: string) => {
      const style = styles?.[currClassName];
      if (style) {
          return { ...acc, ...style };
      }
      return acc;
  }, {});
};