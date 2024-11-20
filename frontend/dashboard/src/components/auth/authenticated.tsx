import { SocketProvider } from '@components/socket/socketClient';
import { useIsAuthenticated, useGo } from '@refinedev/core';

type CAuthenticatedProps = {
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
  children?: React.ReactNode;
};

export const CAuthenticated: React.FC<CAuthenticatedProps> = ({
  children,
  fallback,
  loading
}) => {
  const { isLoading, data } = useIsAuthenticated();
  const go = useGo();

  if (isLoading) {
    return <>{loading}</> || null;
  }

  if (data?.authenticated) {
    return (
      <>
        <SocketProvider>{children}</SocketProvider>
      </>
    );
  } else {
    go({ to: '/login', type: 'replace' });
    return null;
  }
};
