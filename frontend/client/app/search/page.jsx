import DropDownButton from "@components/Input/DropDownButton";
import ProductCard from "@components/UI/ProductCard";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Search() {
  return (
    <div className="flex flex-col gap-4 overflow-visible">
      {/* filter */}
      <div className="flex gap-4 flex-wrap items-center justify-end h-fit rounded-xl w-full bg-surface    py-2 px-4">
        <DropDownButton />
        <DropDownButton />
      </div>
      {/* product list */}
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 overflow-visible">
        {Array.from({ length: 24 }).map((item,index) => (
          <ProductCard key={index} />
        ))}
      </ul>
      {/* page selector */}
      <ul className="flex my-4 gap-2 flex-row items-center justify-center bg-background/20 backdrop-blur-sm rounded-xl size-fit m-auto">
        <button className='p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10'>
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <button className='p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10'>1</button>
        <button className='p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10'>2</button>
        <button className='p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10'>3</button>
        <button className='p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10'>
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </ul>
    </div>
  );
}
