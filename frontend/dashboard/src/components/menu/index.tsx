'use client';

import { Divider, Typography } from '@mui/material';
import { useLogout, useMenu } from '@refinedev/core';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/images/logo.svg';

export const Menu = ({ className = '' }: { className: string }) => {
  const { mutate: logout } = useLogout();
  const { menuItems, selectedKey } = useMenu();

  return (
    <nav className={`menu ${className}`}>
      <div className="flex flex-row gap-3 h-max grow-0 items-center self-center">
        <Image src={logo} alt="Hive Electro" width={36} height={36} />
        <Typography
          variant="h1"
          className="text-2xl font-bold text-secondary-100 w-fit"
        >
          Hive Electro
        </Typography>
      </div>

      <div className="w-full flex flex-col justify-between items-center grow">
        <ul className="w-full flex-1 flex flex-col">
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={`w-full ${
                item.label === 'Profiles' ? 'mt-auto py-10' : ''
              }`}
            >
              <Link
                href={item.route ?? '/'}
                className={`{ px-4 py-2 inline-block text-start rounded-md w-full
                ${
                  selectedKey === item.key
                    ? 'bg-secondary-100 text-accent font-bold'
                    : 'bg-transparent text-secondary-100'
                }
                }`}
              >
                {item.label}
              </Link>
              {item.label === 'Customers' && (
                <Divider className="w-full h-1 border-b-2 border-solid border-slate-300 py-2 mb-2 opacity-50" />
              )}
            </li>
          ))}
        </ul>
        <button onClick={() => logout()}>Logout</button>
      </div>
    </nav>
  );
};
