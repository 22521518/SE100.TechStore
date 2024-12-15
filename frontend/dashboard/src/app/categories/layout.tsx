import { Layout as BaseLayout } from '@components/layout';
import { authProviderServer } from '@providers/auth-provider';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function Layout({ children }: React.PropsWithChildren) {
  return <BaseLayout>{children}</BaseLayout>;
}

async function getData() {
  const { authenticated, redirectTo } = await authProviderServer.check();

  return {
    authenticated,
    redirectTo
  };
}
