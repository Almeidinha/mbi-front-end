export const mapOrder = <T extends Partial<Record<K, any>>, K extends keyof T>(
  array: T[],
  orderOfIds: T[K][],
  key: K,
): T[] => {
  array.sort((a, b) => {
      const indexA = orderOfIds.indexOf(a[key]);
      const indexB = orderOfIds.indexOf(b[key]);
      
      if ( indexA === -1 && indexB === -1) {
        return 0;
      }

      if (indexA === -1) {
          return 1;
      }

      if (indexB === -1) {
          return -1;
      }
        
      return indexA - indexB;
  });

  return array;
};