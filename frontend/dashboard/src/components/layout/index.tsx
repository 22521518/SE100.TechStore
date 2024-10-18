'use client';

import type { PropsWithChildren } from 'react';
import { Menu } from '../menu';

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="layout bg-primary-100 h-dvh overflow-hidden flex flex-row">
      <Menu />
      <div className="content py-6 grow-1">
        <div>{children}</div>
      </div>
    </div>
  );
};