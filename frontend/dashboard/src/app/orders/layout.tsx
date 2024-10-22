import { Layout as BaseLayout } from '@components/layout';
import React from 'react';

const Layout = async ({ children }: React.PropsWithChildren) => {
  return <BaseLayout>{children}</BaseLayout>;
};

export default Layout;
