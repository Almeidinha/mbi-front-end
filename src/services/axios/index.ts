"use client"

import axios from "axios";
import { getSession } from "next-auth/react";

const defaultOptions = {
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL,
  headers: {
    "Content-type": "application/json",
  }
};

const AxiosClient = () => {

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(async (request) => {
    const session = await getSession();
    
    if (session) {
      request.headers['Authorization'] = `Bearer ${session.authToken}`;
      request.headers['userEmail'] = session.user.email;
    }
    
    return request;
  });

  instance.interceptors.response.use((response) => {
    
    return response;
  },
  /*(error: any) => {
      console.log(`error`, error);
    },*/
  );

  return instance;
};

export default AxiosClient();