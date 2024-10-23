"use client";
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
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const Product = ({ params }) => {
  const [product, setProduct] = useState({
    id: "ABC123",
    name: "Iphone 19 Pro Max",
    category: "smart phone",
    description: `<p><strong>Product Name:</strong> QuantumX Pro Wireless Earbuds</p>
  <p><strong>Description:</strong> Experience sound like never before with the QuantumX Pro Wireless Earbuds. Engineered with precision and designed for comfort, these earbuds deliver crystal-clear audio and deep bass, all while being incredibly lightweight. Whether you're working out, commuting, or relaxing at home, the QuantumX Pro offers premium sound quality that adapts to your lifestyle.</p>

  <br/>
  <p><strong>Key Features:</strong></p>
  <ul>
    <li><strong>Advanced Noise Cancellation:</strong> Immerse yourself in music with active noise-canceling technology that blocks out unwanted background noise.</li>
    <li><strong>Long Battery Life:</strong> Enjoy up to 10 hours of playback on a single charge, with an additional 30 hours available through the sleek charging case.</li>
    <li><strong>Ergonomic Design:</strong> Crafted for all-day comfort, the QuantumX Pro comes with three different ear tip sizes for the perfect fit.</li>
    <li><strong>IPX5 Water Resistance:</strong> Sweatproof and splash-resistant, ideal for intense workouts and outdoor activities.</li>
    <li><strong>Touch Controls:</strong> Easily manage your music, take calls, and activate voice assistants with intuitive touch-sensitive controls on each earbud.</li>
    <li><strong>Bluetooth 5.2:</strong> Seamless connection with improved range and stability, ensuring uninterrupted sound quality up to 50 feet away.</li>
  </ul>
    <br/>
  <p><strong>Included in the Box:</strong></p>
  <ul>
    <li>QuantumX Pro Wireless Earbuds</li>
    <li>Charging Case</li>
    <li>USB-C Charging Cable</li>
    <li>Multiple Ear Tip Sizes</li>
    <li>Quick Start Guide</li>
    <li>Warranty: 1-year limited warranty</li>
  </ul>

  <p>Take your listening experience to the next level with the QuantumX Pro Wireless Earbuds—where innovation meets comfort.</p>`,
    specs: {
      Display: "6.7-inch Super Retina XDR",
      Processor: "A19 Bionic Chip",
      Storage: "256GB",
      Camera: "Triple 200MP + 48MP + 12MP rear, 48MP front",
      Battery: "4500mAh, 25W Fast Charging",
      WaterResistance: "IP68 water and dust resistance",
      OperatingSystem: "iOS 18",
      Connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3",
    },
    price: 49000000,
    discount: 30,
    stockCounts: 1230,
    images: [
      "https://happyphone.vn/wp-content/uploads/2024/05/iPhone-19-Pro-va-Pro-Max-se-ra-mat-vao-nam-2027.jpg",
      "https://i.ytimg.com/vi/MXt2O05hw0I/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGogaihqMA8=&rs=AOn4CLBiRdQP0wDe0U9Jz-iTO2kDHS_zSA",
      "https://happyphone.vn/wp-content/uploads/2024/05/He-lo-thong-tin-ve-iPhone-19-Series.jpg",
      "https://happyphone.vn/wp-content/uploads/2024/05/Camera-chinh-cua-iPhone-19-Pro-va-Pro-Max-co-do-phan-giai-200MP.jpg",
      "https://chamsocdidongviet.com/upload/product/iphone-13-pro-max-1-3-1-4517.jpg",
      "https://i.ytimg.com/vi/g7F9uZhHTZE/maxresdefault.jpg",
    ],
  });

  const [productFeedbacks, setProductFeedBacks] = useState([
    {
      id: "1",
      product_id: "1",
      customer_id: "123",
      rating: 5,
      feedback: "excellent product!!! Would buy again for my dog",
      created_at: "1/1/2024",
    },
    {
      id: "2",
      product_id: "1",
      customer_id: "1223",
      rating: 3,
      feedback: "the shipping is ok",
      created_at: "4/1/2024",
    },
    {
      id: "3",
      product_id: "1",
      customer_id: "14423",
      rating: 0,
      feedback: "very bad product!!! broke when i first opened",
      created_at: "2/3/2024",
    },
  ]);

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
  }, [product.images]);

  return (
    <section className="size-full flex flex-col items-center gap-4 p-4 overflow-visible">
      <ul className="flex flex-row items-center justify-start gap-2 w-full">
        <h3 className="text-xl opacity-50">{product.category}</h3>
        <span className="size-2 sm:size-3 bg-on-background rounded-full opacity-50"></span>
        <h3 className="text-xl">{product.name}</h3>
      </ul>
      <div className="panel-2 w-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-10">
          <div className="grid grid-row-[1fr_auto]">
            <div className="w-full relative">
              <ul
                ref={productImageListRef}
                className="w-full size-fit flex flex-row items-center overflow-x-scroll no-scrollbar snap-mandatory snap-x gap-2 bg-secondary/50"
              >
                {product.images.map((image, index) => (
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
              {product.images.map((image, index) => (
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
            <h3 className="font-bold text-xl md:text-3xl">{product.name}</h3>
            <div className="flex flex-row gap-1 items-center text-yellow-400">
              <ReviewStar rating={productRating} />
              53 reviews
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl">
              {Intl.NumberFormat("en-US").format(
                product.price - (product.price / 100) * product.discount
              )}{" "}
              VNĐ
            </div>
            {product.discount > 0 && (
              <div className="flex gap-2 items-center text-base sm:text-lg md:text-xl">
                <span className="opacity-70">
                  {Intl.NumberFormat("en-US").format(product.price)} VNĐ
                </span>
                <span className="text-red-500">-{product.discount}%</span>
              </div>
            )}
            <div>{product.stockCounts} in-stocks</div>

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
            content={
              <div
                className="font-sans"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            }
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
                {Object.entries(product.specs).map(([spec, detail], index) => (
                  <li
                    key={index}
                    className="grid-cols-2 break-all grid odd:bg-surface odd:text-on-surface rounded-lg p-2"
                  >
                    <div>
                      <b>{spec}</b>
                    </div>
                    <div>{detail}</div>
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
              {[5,4,3,2,1,0].map((value) => (
                <span
                  key={value}
                  className="flex flex-row gap-1 items-center text-yellow-400 text-sm p-2 bg-surface rounded-xl"
                >
                  <ReviewStar rating={value} />
                  <span className="text-on-surface">
                    (
                    {
                      productFeedbacks.filter(
                        (feedback) => feedback.rating ===value
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
                key={feedback.id}
                className="w-full grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-2"
              >
                <span className="text-3xl">
                  <FontAwesomeIcon icon={faUserCircle} />
                </span>
                <div className="flex flex-col gap-2 items-start">
                  <span className="font-semibold">{feedback.customer_id}</span>
                  <ReviewStar rating={feedback.rating} size={'text-xs'}/>
                  <span className="text-xs opacity-50">
                    {feedback.created_at}
                  </span>

                  <p className="text-sm">{feedback.feedback}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 overflow-visible w-full">
        {Array.from({ length: 16 }).map((item, index) => (
          <ProductCard key={index} />
        ))}
      </ul>
    </section>
  );
};

export default Product;
