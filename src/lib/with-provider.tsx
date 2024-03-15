import React from "react";

interface Props {
  children: React.ReactNode;
}

export const withProvider = (Provider: React.FC<Props>) => (
  Component: React.ComponentType<Props>
): React.ComponentType => {
  return React.memo<{children?: React.ReactNode}>(function ProviderWrappedComponent(props: any) {
    return (
      <Provider>
        <Component {...props} />
      </Provider>
    );
  });
};

export const withProviders = (...Providers: React.FC<Props>[]) => (
  Component: React.ComponentType
): React.ComponentType<Props> => {
  return  React.memo<{children?: React.ReactNode}>(function ProviderWrappedComponent(props: any) {
    const composedProvider = Providers.reduceRight((acc, Provider) => {
      return <Provider>{acc}</Provider>;
    }, <Component {...props} />);
    
    return composedProvider;
  });
};