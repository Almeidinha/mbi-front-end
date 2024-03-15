"use client"

/*
import axios, { AxiosInstance } from "axios";
import { createContext, useEffect, useRef, ReactNode } from "react";

type ContextValue = AxiosInstance | undefined;

export const AxiosContext = createContext<ContextValue>(undefined);

type InstanceProvider =  {
  config: {},
  requestInterceptors?: never[],
  responseInterceptors?: never[],
  children: ReactNode
}

export const AxiosInstanceProvider = ({
  config = {},
  requestInterceptors = [],
  responseInterceptors = [],
  children,
}: InstanceProvider) => {
  
  const instanceRef = useRef(axios.create(config));

  useEffect(() => {
    requestInterceptors.forEach((interceptor) => {
      instanceRef.current.interceptors.request.use(
        interceptor
      );
    });
    responseInterceptors.forEach((interceptor) => {
      instanceRef.current.interceptors.response.use(
        interceptor
      );
    });
  }, []);

  return (
    <AxiosContext.Provider value={instanceRef.current}>
      {children}
    </AxiosContext.Provider>
  );
};
*/