import ProductCard from "@components/UI/ProductCard";
import { faEquals } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      {/* banner */}
      <div className="w-full overflow-hidden rounded-lg shadow-md relative">
        <button className="button-variant-1 absolute right-10 bottom-10">
          Buy now
        </button>
        <Image
          src="https://www.pcworld.com/wp-content/uploads/2024/10/Nvidia-Geforce-RTX-5090-1.jpg?quality=50&strip=all"
          alt="banner image"
          width={800}
          height={800}
          className='w-full'
        />
      </div>

      {/* product categories */}
      <div className="flex gap-2 justify-center items-center">
        <ul className="px-4 py-2 min-h-[48px] flex-wrap items-center bg-surface text-on-surface gap-6 flex rounded-xl text-lg">
          <li>Category</li>
          <li>Category</li>
          <li>Category</li>
          <li>Category</li>
          <li>Category</li>
        </ul>
        <button className="size-12 text-2xl text-on-surface bg-surface rounded-xl">
          <FontAwesomeIcon icon={faEquals} />
        </button>
      </div>

      <p className="text-2xl font-semibold my-4">See our newest products</p>
      {/* product list */}
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Array.from({ length: 16 }).map((item) => (
          <ProductCard />
        ))}
      </ul>

      {/* banner */}
      <div className="w-full overflow-hidden rounded-lg shadow-md relative">
        <button className="button-variant-1 absolute right-10 bottom-10">
          Buy now
        </button>
        <Image
          src="https://www.pcworld.com/wp-content/uploads/2024/10/Nvidia-Geforce-RTX-5090-1.jpg?quality=50&strip=all"
          alt="banner image"
          width={800}
          height={800}
          className='w-full'
        />
      </div>
    </div>
  );
}
