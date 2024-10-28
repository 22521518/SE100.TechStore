"use client";
import DropDownButton from "@components/Input/DropDownButton";
import ProductCard from "@components/UI/ProductCard";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

export default function Search() {
  const [priceRange,setPriceRange] = useState([
    { id: "1", name: "dưới 1 triệu" },
    { id: "2", name: "dưới 10 triệu" },
    { id: "3", name: "dưới 50 triệu" },
  ]);
  const [categories, setCategories] = useState([
    {id:'1',name:'category1'},
    {id:'2',name:'category2'},
    {id:'3',name:'category3'},
    {id:'4',name:'category4'},
    {id:'5',name:'category5'},
  ]);

  const [selectedPriceRange,setSelectedPriceRange] = useState()
  const [selectedCategory,setSelectedCategory] = useState()

  return (
    <section className="flex flex-col gap-4 overflow-visible">
      {/* filter */}
      <div className="flex-wrap-reverse gap-4 flex items-center justify-end h-fit rounded-xl w-full bg-surface    py-2 px-4">
        <DropDownButton value={selectedPriceRange} name={'price range'} options={priceRange} onChange={setSelectedPriceRange} />
        <DropDownButton value={selectedCategory} name={'category'} options={categories} onChange={setSelectedCategory}/>
      </div>
      {/* product list */}
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 overflow-visible">
        {Array.from({ length: 24 }).map((item, index) => (
          <ProductCard key={index} />
        ))}
      </ul>
      {/* page selector */}
      <ul className="flex my-4 gap-2 flex-row items-center justify-center bg-background/20 backdrop-blur-sm rounded-xl size-fit m-auto">
        <button className="p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10">
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <button className="p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10">
          1
        </button>
        <button className="p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10">
          2
        </button>
        <button className="p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10">
          3
        </button>
        <button className="p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10">
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </ul>
    </section>
  );
}
