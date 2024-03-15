"use client"

import React from "react";
import AppHeader from "./app-header";
import { AppSideMenu } from "./app-side-menu";
import { MainLayout } from "./main-layout";
import { ReactQueryDevtools } from 'react-query/devtools'
import { withProviders } from "@/lib/with-provider";
import { 
  AntdConfigProvider, 
  NextAuthProvider, 
  QueryClientWrapperProvider, 
  ReduxProvider 
} from "@/app/providers";

const AppLayout: React.FC<{children?: React.ReactNode}> = ({ children }) => {

  return (
    <React.Fragment>
      <MainLayout header={<AppHeader />} sideMenu={<AppSideMenu />}>
        {children}
      </MainLayout>        
     <ReactQueryDevtools initialIsOpen={false} />
    </React.Fragment>
  )
}

export default withProviders(
  NextAuthProvider, 
  ReduxProvider, 
  QueryClientWrapperProvider, 
  AntdConfigProvider) (AppLayout)
