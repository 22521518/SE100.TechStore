"use client";
import { getAllProduct } from "@actions/product";
import ProductCard from "@components/UI/ProductCard";
import { faEquals } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getAllCategory } from "@actions/category";
import Link from "@node_modules/next/link";

export default function Home() {
  const [isLoading,setIsLoading] = useState(true)
  const bannerImage = [
    "https://cdn.thewirecutter.com/wp-content/media/2024/07/laptopstopicpage-2048px-3685-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp",
    "https://pianohouse.vn/image/cache/large/catalog/products/phu-kien-piano/Loa%20Marshall/marshall-banner-2.jpg",
    "https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4090/geforce-ada-4090-web-og-1200x630.jpg",
    "https://i.ytimg.com/vi/3hPoEmlBQdY/maxresdefault.jpg",
    "https://dlcdnwebimgs.asus.com/gain/9F8C42DB-36CE-4003-95E1-94E92594127F/fwebp",
  ];
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const firstBannerRef = useRef(null);
  const secondBannerRef = useRef(null);
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      const response = await getAllProduct();

      setProducts(response.slice(0, 16));
      setIsLoading(false)
    };

    const fetchCategories = async () => {
      const response = await getAllCategory();

      setCategories(response);
    };

    fetchProducts();
    fetchCategories();

    const scrollInterval = setInterval(() => {
      // Scroll the first banner
      if (firstBannerRef.current) {
        const scrollWidth = firstBannerRef.current.scrollWidth;
        const clientWidth = firstBannerRef.current.clientWidth;

        // Check if scrolled to the end
        if (firstBannerRef.current.scrollLeft + clientWidth >= scrollWidth) {
          firstBannerRef.current.scrollLeft = 0
        } else {
          firstBannerRef.current.scrollBy({
            left: clientWidth,
            behavior: "smooth",
          }); // Scroll to the right
        }
      }

      // Scroll the second banner
      if (secondBannerRef.current) {
        const scrollWidth = secondBannerRef.current.scrollWidth;
        const clientWidth = secondBannerRef.current.clientWidth;

        // Check if scrolled to the end
        if (secondBannerRef.current.scrollLeft + clientWidth >= scrollWidth) {
          secondBannerRef.current.scrollLeft = 0
        } else {
          secondBannerRef.current.scrollBy({
            left: clientWidth,
            behavior: "smooth",
          }); // Scroll to the right
        }
      }
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(scrollInterval); // Cleanup on unmount
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* banner */}
      <div className="w-full overflow-hidden rounded-lg shadow-md relative">
        <ul
          ref={firstBannerRef}
          className="relative w-full flex flex-row items-center overflow-x-scroll no-scrollbar snap-mandatory snap-x gap-2 bg-secondary/50"
        >
          {bannerImage.map((image, index) => (
            <li key={index} className="flex-shrink-0 w-full h-80 snap-start">
              {" "}
              {/* Specify height here */}
              <Image
                src={image}
                alt="product image"
                width={800} // Set the width of the image
                height={256} // Set the height of the image for proper aspect ratio
                className="object-cover w-full h-full" // Ensure the image covers the entire area
              />
            </li>
          ))}
        </ul>
        <Link href={"/search"}>
          <button className="button-variant-1 absolute right-10 bottom-10">
            Buy now
          </button>
        </Link>
      </div>

      {/* product categories */}
      <div className="flex gap-2 justify-center items-center">
        <ul className="px-4 py-2 min-h-[48px] flex-wrap items-center bg-surface text-on-surface gap-6 flex rounded-xl text-lg">
          {categories.slice(0,5).map((item) => (
            <li key={item.category_id} className="hover:font-bold cursor-pointer"><Link href={`/search?category=${item.category_id}`}>{item.category_name}</Link></li>
          ))}
        </ul>
        <button className="size-12 text-2xl text-on-surface bg-surface rounded-xl">
          <FontAwesomeIcon icon={faEquals} />
        </button>
      </div>

      <p className="text-2xl font-semibold my-4">See our newest products</p>
      {/* product list */}
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 overflow-visible">
        {isLoading
        ?Array.from({length:16}).map((_,index)=>
          <ProductCard key={index} loading={true}/>
        )
        :products.map((item) => (
          <ProductCard key={item.product_id} product={item} />
        ))}
      </ul>

      {/* banner */}
      <div className="w-full overflow-hidden rounded-lg shadow-md relative">
        <ul
          ref={secondBannerRef}
          className="relative w-full flex flex-row items-center overflow-x-scroll no-scrollbar snap-mandatory snap-x gap-2 bg-secondary/50"
        >
          {bannerImage.map((image, index) => (
            <li key={index} className="flex-shrink-0 w-full h-80 snap-start">
              {" "}
              {/* Specify height here */}
              <Image
                src={image}
                alt="product image"
                width={800} // Set the width of the image
                height={256} // Set the height of the image for proper aspect ratio
                className="object-cover w-full h-full" // Ensure the image covers the entire area
              />
            </li>
          ))}
        </ul>
        <Link href={"/search"}>
          <button className="button-variant-1 absolute right-10 bottom-10">
            Buy now
          </button>
        </Link>
      </div>
    </div>
  );
}
