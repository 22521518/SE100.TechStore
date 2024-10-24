'use client'
import {
  faBox,
  faKey,
  faLocationDot,
  faTicket,
  faUser,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const AccountPageNav = () => {
  const pathName = usePathname();
  const MenuItems = [
    { name: "My account", path: "/account", icon: faUser },
    { name: "Address", path: "/account/address", icon: faLocationDot },
    { name: "Change password", path: "/account/changePassword", icon: faKey },
    { name: "Orders", path: "/account/orders", icon: faBox },
    { name: "Vouchers", path: "/account/vouchers", icon: faTicket },
  ];

  return (
    <div className="grid grid-rows-[auto_1fr] gap-2 w-full">
      <div className="flex flex-row w-full gap-4">
        <button className="text-4xl">
          <FontAwesomeIcon icon={faUserCircle} />
        </button>
        <div className="flex flex-col justify-around items-start">
          <span className="text-xl">Username</span>
          <span className="text-sm">Edit user</span>
        </div>
      </div>
      <div className="  panel-1 ">
        <div className="overflow-x-scroll no-scrollbar w-full flex flex-row md:flex-col gap-2 text-sm items-center md:items-start ">
          {MenuItems.map((item) => (
            <Link key={item.name} href={item.path} className="w-full">
              <button className={`${pathName===item.path?'account-nav-bar-selected-item':'account-nav-bar-item'}`}>
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.name}</span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountPageNav;
