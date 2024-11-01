"use client";
import { formattedPrice } from "@actions/format";
import { getProductDetail,getAllProduct } from "@actions/product";
import CollapsibleContainer from "@components/UI/CollapsibleBanner";
import ProductCard from "@components/UI/ProductCard";
import ReviewStar from "@components/UI/ReviewStar";
import {
  faStar as faEmptyStar,
  faStarHalf,
} from "@fortawesome/free-regular-svg-icons";
import {
  faAngleLeft,
  faAngleRight,
  faCartShopping,
  faStar as faFullStar,
  faStarHalfStroke,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "@node_modules/next/navigation";
import { idText } from "@node_modules/typescript/lib/typescript";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const Product = () => {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);

  const [productFeedbacks, setProductFeedBacks] = useState([]);

  const [selectedImageId, setSelectedImageId] = useState(0);

  const productRating =
    productFeedbacks.length > 0
      ? parseFloat(
          (
            productFeedbacks.reduce(
              (acc, feedback) => acc + feedback.rating,
              0
            ) / productFeedbacks.length
          ).toFixed(1)
        )
      : 0;
  const productImageListRef = useRef(null);

  const handleSetSelectedId = (index) => {
    const imageList = productImageListRef.current;
    if (imageList) {
      const selectedImage = imageList.children[index];
      if (selectedImage) {
        const offsetLeft =
          selectedImage.offsetLeft -
          (imageList.clientWidth - selectedImage.clientWidth) / 2;
        imageList.scrollTo({ left: offsetLeft, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const imageList = productImageListRef.current;
    if (!imageList) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setSelectedImageId(index);
          }
        });
      },
      {
        root: imageList,
        threshold: 0.5,
      }
    );

    // Observe each image
    Array.from(imageList.children).forEach((image, index) => {
      observer.observe(image);
      image.dataset.index = index;
    });

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, [product?.images]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getAllProduct();

      setProducts(response);
    };
    const fetchProductDetails = async (id) => {
      const response = await getProductDetail(id);

      setProduct(response);
      setProductFeedBacks(response.product_feedbacks);
    };

    fetchProducts();
    fetchProductDetails(params.id);
  }, [params]);

  return (
    <section className="size-full flex flex-col items-center gap-4 p-4 overflow-visible">
      <ul className="flex flex-row items-center justify-start gap-2 w-full">
        <h3 className="text-xl opacity-50">
          {product?.categories[0].category_name}
        </h3>
        <span className="size-2 sm:size-3 bg-on-background rounded-full opacity-50"></span>
        <h3 className="text-xl">{product?.product_name}</h3>
      </ul>
      <div className="panel-2 w-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-10">
          <div className="grid grid-row-[1fr_auto]">
            <div className="w-full relative">
              <ul
                ref={productImageListRef}
                className="w-full size-fit flex flex-row items-center overflow-x-scroll no-scrollbar snap-mandatory snap-x gap-2 bg-secondary/50"
              >
                {product?.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt="product image"
                    width={800}
                    height={800}
                    className="size-full object-scale-down snap-start"
                  />
                ))}
              </ul>
            </div>
            <ul className="flex flex-row gap-2 w-full py-1 overflow-x-scroll no-scrollbar snap-x snap-mandatory">
              {product?.images.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-square cursor-zoom-in max-w-[100px] min-w-[80px] snap-start transition-transform duration-200 ${
                    selectedImageId === index
                      ? "scale-100 opacity-100"
                      : "scale-90 opacity-50"
                  }`}
                  onClick={() => handleSetSelectedId(index)}
                >
                  <Image
                    src={product.images[index]}
                    alt="product image "
                    width={200}
                    height={200}
                    className="size-full object-cover outline-none"
                  />
                </button>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4 md:p-8">
            <h3 className="font-bold text-xl md:text-3xl">
              {product?.product_name}
            </h3>
            <div className="flex flex-row gap-1 items-center text-yellow-400">
              <ReviewStar rating={productRating} />
              {productFeedbacks.length} reviews
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl">
              {formattedPrice(
                product?.price - (product?.price / 100) * product?.discount
              )}
            </div>
            {product?.discount > 0 && (
              <div className="flex gap-2 items-center text-base sm:text-lg md:text-xl">
                <span className="opacity-70">
                  {formattedPrice(product?.price)}
                </span>
                <span className="text-red-500">-{product?.discount}%</span>
              </div>
            )}
            <div>{product?.stock_quantity} in-stocks</div>

            <div className="flex flex-row gap-4">
              <button className="button-variant-1">
                Add to cart <FontAwesomeIcon icon={faCartShopping} />
              </button>
              <button className="button-variant-1">Buy now</button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto] w-full">
        <div className="panel-2 w-full h-fit">
          <div className="bg-primary-variant rounded-md text-on-primary md:text-xl font-bold text-center p-2">
            Product details
          </div>
          <CollapsibleContainer
            maxHeight={400}
            content={<div className="font-sans">{product?.description}</div>}
          />
        </div>
        <div className="panel-2 w-full  md:max-w-[350px] h-fit ">
          <div className="bg-primary-variant rounded-md text-on-primary md:text-xl font-bold text-center p-2">
            Product specs
          </div>
          <CollapsibleContainer
            maxHeight={400}
            content={
              <ul className="flex flex-col gap-2 py-2">
                {product?.attributes?.map((item) => (
                  <li
                    key={item._id}
                    className="grid-cols-2 break-all grid odd:bg-surface odd:text-on-surface rounded-lg p-2"
                  >
                    <div>
                      <b>{item.name}</b>
                    </div>
                    <div>{item.detail}</div>
                  </li>
                ))}
              </ul>
            }
          />
        </div>
        <div className="panel-2 w-full md:col-span-2 flex flex-col gap-2">
          <div className="bg-primary-variant rounded-md text-on-primary md:text-xl font-bold text-center p-2">
            Product ratings
          </div>
          <div className="flex flex-col md:flex-row gap-2 justify-start items-center shadow-inner rounded-xl p-2">
            <div className="flex flex-col gap-2 items-center">
              <span className="text-2xl md:text-3xl text-yellow-400 font-bold">
                {" "}
                {productRating} / 5
              </span>
              <ReviewStar rating={productRating} size={"text-2xl"} />
            </div>
            <ul className="flex flex-wrap gap-4">
              {[5, 4, 3, 2, 1, 0].map((value) => (
                <span
                  key={value}
                  className="flex flex-row gap-1 items-center text-yellow-400 text-sm p-2 bg-surface rounded-xl"
                >
                  <ReviewStar rating={value} />
                  <span className="text-on-surface">
                    (
                    {
                      productFeedbacks.filter(
                        (feedback) => feedback.rating === value
                      ).length
                    }
                    )
                  </span>
                </span>
              ))}
            </ul>
          </div>
          <ul className="flex flex-col gap-4 py-4">
            {productFeedbacks.map((feedback) => (
              <li
                key={feedback.feedback_id}
                className="w-full grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-2"
              >
                <span className="text-3xl">
                  <FontAwesomeIcon icon={faUserCircle} />
                </span>
                <div className="flex flex-col gap-2 items-start">
                  <span className="font-semibold">{feedback.customer_id}</span>
                  <ReviewStar rating={feedback.rating} size={"text-xs"} />
                  <span className="text-xs opacity-50">
                    {new Date(feedback.created_at).toISOString().split("T")[0]}
                  </span>

                  <p className="text-sm">{feedback.feedback}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 overflow-visible w-full">
        {products.map((item) => (
          <ProductCard key={item.product_id} product={item} />
        ))}
      </ul> 
    </section>
  );
};

export default Product;
