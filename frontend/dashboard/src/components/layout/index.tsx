'use client';

import type { PropsWithChildren } from 'react';
import { Menu } from '../menu';
import React from 'react';
import { CAuthenticated } from '@components/auth/authenticated';

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <CAuthenticated>
      <div className="layout bg-primary-100 h-dvh overflow-hidden grid grid-cols-5 relative">
        <Menu className="bg-accent h-full col-span-1 py-6 px-4 flex flex-col gap-6 " />
        <div className="content py-2 col-span-4">{children}</div>
      </div>
    </CAuthenticated>
  );
};
