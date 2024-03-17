"use client"

import axios, { AxiosInstance } from "axios";
import { getSession } from "next-auth/react";
import { createContext, useContext, useMemo } from "react";


export const AxiosContext = createContext<AxiosInstance | undefined>(undefined);

export default function AxiosProvider({
  children,
}: React.PropsWithChildren<unknown>) {

  
  const instance = useMemo(() => {
    const axiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    });

    axiosInstance.interceptors.request.use(async config => {
      
      const session = await getSession();

      const token = session?.authToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    return axiosInstance;
  }, []);

  return (
    <AxiosContext.Provider value={instance}>{children}</AxiosContext.Provider>
  );
}

export function useAxios() {
  return useContext(AxiosContext);
}