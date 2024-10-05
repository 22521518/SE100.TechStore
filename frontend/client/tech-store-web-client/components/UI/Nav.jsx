"use client";
import {
  faCartPlus,
  faCircleUser,
  faSearch,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Nav = () => {
  return (
    <div className="w-full sticky top-0 left-0 bg-secondary grid gap-2 md:grid-cols-3 gap-y-4 md:gap-y-0 grid-cols-1 p-2 z-50 text-on-secondary">
      <div className="flex flex-row gap-2 items-center justify-between md:justify-start">
        <Image
          src={process.env.NEXT_PUBLIC_APP_LOGO}
          alt="app logo"
          width={42}
          height={42}
        />
        <div className="font-bold text-xl">
          {process.env.NEXT_PUBLIC_APP_NAME}
        </div>
      </div>
      <ul className="flex h-full whitespace-nowrap justify-between px-2 items-center text-sm font-semibold md:row-auto row-start-3">
        <Link href="/">
          <button className="hover:bg-primary hover:text-on-primary rounded-xl h-full p-2 w-[100px]">
            Home
          </button>
        </Link>
        <Link href="/search">
          <button className="hover:bg-primary hover:text-on-primary rounded-xl h-full p-2 w-[100px]">
            Product
          </button>
        </Link>
        <button className="hover:bg-primary hover:text-on-primary rounded-xl h-full p-2 w-[100px]">
          About us
        </button>
        <button className="hover:bg-primary hover:text-on-primary rounded-xl h-full p-2 w-[100px]">
          Support
        </button>
      </ul>
      <ul className="flex flex-row gap-4 text-2xl justify-end">
        <input
          type="text"
          className="w-full md:w-[100px] lg:w-[300px] rounded-xl bg-primary-variant text-base px-2 text-on-primary placeholder:text-on-primary"
          placeholder="Search product"
        />
        <button>
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <button>
          <FontAwesomeIcon icon={faShoppingCart} />
        </button>
        <button>
          <FontAwesomeIcon icon={faCircleUser} />
        </button>
      </ul> 
    </div>
  );
};

export default Nav;
