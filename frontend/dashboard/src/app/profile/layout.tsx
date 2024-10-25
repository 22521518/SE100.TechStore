import { Layout as BaseLayout } from '@components/layout';
import { Stack } from '@mui/material';
import React from 'react';

const Layout = async ({ children }: React.PropsWithChildren) => {
  return (
    <BaseLayout>
      <Stack className="gap-4 px-32 ">{children}</Stack>
    </BaseLayout>
  );
};

export default Layout;
