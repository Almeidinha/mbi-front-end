"use client"

import React, { useEffect } from "react";
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
import { useAppDispatch } from "@/app/redux/hooks";
import { setUser } from "@/app/redux/features/user/user-slice";
import { signOut, useSession } from "next-auth/react";
import { useUserSessionQuery } from "@/hooks/controllers/user";
import { isDefined } from "@/lib/helpers/safe-navigation";
import { log } from "console";
import { clearStore } from "@/lib/helpers/localStorageUtils";

const AppLayout: React.FC<{children?: React.ReactNode}> = ({ children }) => {

  const dispatch = useAppDispatch()
  const { data: session } = useSession();

  const {
    reloadUsers,
  } =  useUserSessionQuery(session?.user.email)

  useEffect(() => {
    
    console.log('session?.user.email >> ', session?.user.email)
    if (isDefined(session?.user.email)) {
      reloadUsers().then((result) => {
        
        if (isDefined(result?.data)) {
          dispatch(setUser(result.data))
        }
      })
    }
    
  }, [dispatch, reloadUsers, session?.user.email])

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
