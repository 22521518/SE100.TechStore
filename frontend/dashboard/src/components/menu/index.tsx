'use client';

import { Typography } from '@mui/material';
import { useLogout, useMenu } from '@refinedev/core';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/images/logo.svg';

export const Menu = () => {
  const { mutate: logout } = useLogout();
  const { menuItems, selectedKey } = useMenu();

  return (
    <nav className="menu bg-accent h-full w-1/5 py-6 px-4 flex flex-col gap-6">
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
        <ul className="w-full">
          {menuItems.map((item) => (
            <li key={item.key} className="w-full">
              <Link
                href={item.route ?? '/'}
                className={`{ px-4 py-2 inline-block text-start rounded-md w-full
                ${item.label === 'Categories' ? 'hidden' : ''}
                ${
                  selectedKey === item.key
                    ? 'bg-secondary-100 text-accent font-bold'
                    : 'bg-transparent text-secondary-100'
                }
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <button onClick={() => logout()}>Logout</button>
      </div>
    </nav>
  );
};
