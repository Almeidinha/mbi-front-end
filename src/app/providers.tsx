"use client";

import { store } from "@/app/redux/store";
import { MessageType, getMessageIcon } from "@/lib/helpers/alerts";
import { handleErrorMessage } from "@/lib/helpers/errorhandling";
import { ConfigProvider, notification } from "antd";
import theme from "@/lib/themeConfig";
import { SessionProvider, useSession } from "next-auth/react";
import { QueryClientProvider, MutationCache, QueryCache, QueryClient } from "react-query";
import { Provider } from "react-redux";

type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export const ReduxProvider = ({ children }: Props) => {
  return <Provider store={store}>{children}</Provider>
};

export const AntdConfigProvider = ({ children }: Props) => {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>
};

export const QueryClientWrapperProvider = ({ children }: Props) => {

  const [api, contextHolder] = notification.useNotification();

  const queryClientConfig = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: 5,
        staleTime: 60 * 1000,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        
        //if (query.options.onError) return;
  
        const errorMessage = handleErrorMessage(error);
  
        api.info({
          message: "Error",
          icon: getMessageIcon(MessageType.ERROR),
          description: errorMessage,
          placement: 'topRight',
          role : 'alert'
        });
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        
        //if (mutation.options.onError) return;
  
        const errorMessage = handleErrorMessage(error);
  
        console.log('errorMessage > ', errorMessage)
        api.info({
          message: "Error",
          icon: getMessageIcon(MessageType.ERROR),
          description: errorMessage,
          placement: 'topRight',
          role : 'alert'
        });
      },
      onSuccess: () => {
        api.info({
          message: "Success",
          icon: getMessageIcon(MessageType.SUCCESS),
          placement: 'topRight',
          role : 'alert'
        });
      }
    }),
  });

  return <QueryClientProvider client={queryClientConfig}>
    {contextHolder}
    {children}
  </QueryClientProvider>
};
