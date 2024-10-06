"use client";
import {
  faFacebook,
  faFacebookSquare,
  faGithub,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="h-fit w-full bg-secondary text-on-secondary flex sm:flex-row gap-4 flex-col px-10 md:px-20 py-10">
      <div className="flex sm:flex-row flex-col gap-10 grow">
        <div className="flex flex-col gap-2">
          <span className="font-bold">Products</span>
          <ul className="flex sm:flex-col gap-1 text-sm text-on-secondary/50 overflow-x-scroll no-scrollbar ">
            <li className="hover:text-on-secondary cursor-pointer">Category</li>
            <li className="hover:text-on-secondary cursor-pointer">Category</li>
            <li className="hover:text-on-secondary cursor-pointer">Category</li>
            <li className="hover:text-on-secondary cursor-pointer">Category</li>
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold">Services</span>
          <ul className="flex sm:flex-col gap-1 text-sm text-on-secondary/50">
            <li className="hover:text-on-secondary cursor-pointer">
              Contact us
            </li>
            <li className="hover:text-on-secondary cursor-pointer">
              Order tracking
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold">Our company</span>
          <ul className="flex sm:flex-col gap-1 text-sm text-on-secondary/50">
            <li className="hover:text-on-secondary cursor-pointer"><Link href="/about">About us</Link></li>
            <li className="hover:text-on-secondary cursor-pointer">Careers</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-end">
        <ul className=" flex flex-row items-start gap-4 text-xl grow">
          <button>
            <FontAwesomeIcon icon={faEnvelope} />
          </button>
          <button>
            <FontAwesomeIcon icon={faFacebookSquare} />
          </button>
          <button>
            <FontAwesomeIcon icon={faYoutube} />
          </button>
          <button>
            <FontAwesomeIcon icon={faGithub} />
          </button>
        </ul>
        <span className="font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</span>
        <div>&copy; MADE BY NHÓM 18 </div>
      </div>
    </div>
  );
};

export default Footer;
