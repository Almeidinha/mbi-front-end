

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