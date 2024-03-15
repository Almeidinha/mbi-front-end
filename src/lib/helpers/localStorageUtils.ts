"use client"
export const setLSItem = (key: string, item: string | Object) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(item));
  }
};

export const clearStore = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
  }
};

export const removeLSItem = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

export const getSLItem = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return ''

};