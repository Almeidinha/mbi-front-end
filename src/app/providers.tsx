"use client";

import { store } from "@/app/redux/store";
import { MessageType, getMessageIcon } from "@/lib/helpers/alerts";
import { handleErrorMessage } from "@/lib/helpers/errorhandling";
import { ConfigProvider, Modal, notification } from "antd";
import theme from "@/lib/themeConfig";
import { SessionProvider, signOut } from "next-auth/react";
import { QueryClientProvider, MutationCache, QueryCache, QueryClient } from "react-query";
import { Provider } from "react-redux";
import { isDefined } from "@/lib/helpers/safe-navigation";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { clearStore } from "@/lib/helpers/localStorageUtils";
import { isAxiosError } from "axios";

type Props = {
  children?: React.ReactNode;
};

const MAX_RETRIES = 6;
const HTTP_STATUS_TO_NOT_RETRY = [400, 401, 403, 404];

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

  const [api, apiContext] = notification.useNotification();
  const [modal, modalContext] = Modal.useModal();

  const queryClientConfig = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: 60 * 1000,
        retry: (failureCount, error) => {
          console.log('error', error)
          if (failureCount > MAX_RETRIES) {
            return false
          }
          if (isAxiosError(error)) {
            const errorMessage = handleErrorMessage(error);
            if (HTTP_STATUS_TO_NOT_RETRY.includes(error.response?.status ?? 0) || errorMessage.includes('JWT expired')) {
              return false
            }
          }
          return true;
        }
        
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        
        const errorMessage = handleErrorMessage(error);

        if (isDefined(errorMessage)) {


          if (errorMessage.includes('JWT expired')) {
            modal.warning({
              title: "Session Expired",
              icon: <ExclamationCircleOutlined />,
              content: "Your session has expired. Please sign in again.",
              onOk: () => {
                clearStore()
                signOut()
              }
            })
          } else {
            api.info({
              message: "Error",
              icon: getMessageIcon(MessageType.ERROR),
              description: errorMessage,
              placement: 'topRight',
              role : 'alert'
            });
          }
        }
        
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
      
        const errorMessage = handleErrorMessage(error);
  
        if (isDefined(errorMessage)) {
          api.info({
            message: "Error",
            icon: getMessageIcon(MessageType.ERROR),
            description: errorMessage,
            placement: 'topRight',
            role : 'alert'
          });
        }
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
    {apiContext}
    {modalContext}
    {children}
  </QueryClientProvider>
};
