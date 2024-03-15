"use client"

import axios from "axios";
// import { useContext, useEffect, useMemo, useRef, useState } from "react";
// import { AxiosContext } from "./context";

/*
export const useAxios = <R, P>(url: string, method: string, payload: P, ResponseType: R) => {
    
  const [data, setData] = useState<ResponseType>();
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const contextInstance = useContext(AxiosContext);
  
  const instance = useMemo(() => {
    return contextInstance || axios;
  }, [contextInstance]);
  
  const controllerRef = useRef(new AbortController());
  const cancel = () => {
    controllerRef.current.abort();
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await instance.request<ResponseType>({
          signal: controllerRef.current.signal,
          data: payload,
          method,
          url,
          headers: {
            Authorization: ""
          }
        });

        setData(response.data);
      } catch (error) {
          if (axios.isAxiosError(error)) {
              setError(error.message);
            } else {
              setError(`unexpected error: ${error}`);
            }
      } finally {
        setLoaded(true);
      }
    })();
  }, []);
  
  return { cancel, data, error, loaded };
};
*/

// to use with react query
/*
export const useAxios2 = async (url: string, method: string, payload: {}) => {
    
  const contextInstance = useContext(AxiosContext);
  
  const instance = useMemo(() => {
    return contextInstance || axios;
  }, [contextInstance]);
  
  const controllerRef = useRef(new AbortController());


  const response = await instance.request({
    signal: controllerRef.current.signal,
    data: payload,
    method,
    url,
    // headers: {
    //   Authorization: ""
    // }
  });

  return response.data;
};
*/

const defaultOptions = {
  baseURL: process.env.BASE_URL,
  headers: {
    "Content-type": "application/json", 
    Authorization: ""
  }
};

export const axiosClient = axios.create(defaultOptions);

/*
export const request = async (options: {}, store: any) => {

  const onSuccess = (response: any) => {
    const {
      data: { data }
    } = response
    return data
  };

  const onError = (error: any) => {
    return Promise.reject(error.response);
  }

  return axiosClient({...defaultOptions, ...options}).then(onSuccess).catch(onError);

}
*/