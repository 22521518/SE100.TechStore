"use client";
import { formattedPrice } from "@util/format";
import { getProductDetail, getAllProduct } from "@service/product";
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
import { useParams, useRouter } from "@node_modules/next/navigation";
import { idText } from "@node_modules/typescript/lib/typescript";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import InputBox from "@components/Input/InputBox";
import InputArea from "@components/Input/InputArea";
import Link from "@node_modules/next/link";
import { addFeedback } from "@service/feedback";
import { toastError, toastSuccess, toastWarning } from "@util/toaster";
import { useSession } from "@node_modules/next-auth/react";
import CommentTag from "@components/UI/FeedbackTag";
import FeedbackTag from "@components/UI/FeedbackTag";
import {
  useDispatch,
  useSelector,
} from "@node_modules/react-redux/dist/react-redux";
import { addItem } from "@provider/redux/cart/cartSlice";

const Product = () => {
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ rating: 0, content: "" });
  const [feedbackFilter, setFeedbackFilter] = useState(-1);
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

  const handleAddFeedback = async () => {
    if (feedback.content.trim() === "") {
      toastWarning("Please add your feedback before submit");
      return;
    }
    const newFeedback = {
      feedback_id: Math.random() * 1000 + 5,
      product_id: "cm2rnv4vf00039thyjfemcq9h",
      customer_id: "cm2rntc4r00001ly99t53s0cl",
      feedback: feedback.content,
      rating: feedback.rating,
      created_at: new Date(),
    };

    setProductFeedBacks((prev) => [...prev, newFeedback]);
    setFeedback({ content: "", rating: 0 });
    // addFeedback(newFeedback)
    switch (feedback.rating) {
      case 0:
        toastSuccess(
          "We are sorry to hear you had a bad experience. Thank you for your feedback."
        );
        break;
      case 1:
        toastSuccess(
          "Thank you for your feedback. We strive to improve your experience."
        );
        break;
      case 2:
        toastSuccess(
          "Thank you for your input. We are working on making things better."
        );
        break;
      case 3:
        toastSuccess(
          "Thank you! We appreciate your feedback and will continue to improve."
        );
        break;
      case 4:
        toastSuccess(
          "Great to hear you had a good experience! Thank you for your feedback."
        );
        break;
      case 5:
        toastSuccess(
          "Awesome! Your feedback means a lot to us. Thank you for using our products!"
        );
        break;
      default:
        toastSuccess("Thank you for your feedback! We appreciate your input.");
        break;
    }
  };
  const handleSetFeedbackFilter = (rate) => {
    setFeedbackFilter(rate === feedbackFilter ? -1 : rate);
  };

  const handleAddToCart = () => {
    if (!session.isAuthenticated) {
      toastError("You need to login to proceed");
      return;
    }

    dispatch(
      addItem({
        id:product.product_id
      })
    );

    toastSuccess("Product added to cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

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

  const fetchProducts = () => {
    getAllProduct().then((data) => setProducts(data));
  };

  const fetchProductDetails = (id) => {
    getProductDetail(id).then((data) => {
      setProduct(data);
      setProductFeedBacks(data.product_feedbacks);
    });
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
    setIsLoading(true);
    fetchProducts();
    fetchProductDetails(params.id);
    setTimeout(() => setIsLoading(false), 1000);
  }, [params]);

  return (
    <section className="size-full flex flex-col items-center gap-4 p-4 overflow-visible">
      <ul className="flex flex-row items-center justify-start gap-2 w-full">
        <h3 className="text-xl opacity-50 hover:opacity-100">
          <Link href={`/search?category=${product?.categories[0].category_id}`}>
            {product?.categories[0].category_name}
          </Link>
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
                className="w-full size-fit flex flex-row items-center overflow-x-scroll no-scrollbar snap-mandatory snap-x gap-4 bg-secondary/50"
              >
                {product?.images.map((image, index) => (
                  <li
                    key={index}
                    className="min-w-full h-fit relative flex items-center justify-center "
                  >
                    <Image
                      src={image}
                      alt="product image"
                      width={0}
                      height={0}
                      layout="responsive"
                      className="size-full object-contain snap-start"
                    />
                  </li>
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
              <button className="button-variant-1" onClick={handleAddToCart}>
                Add to cart <FontAwesomeIcon icon={faCartShopping} />
              </button>
              <button className="button-variant-1" onClick={handleBuyNow}>
                Buy now
              </button>
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

          <div className="flex flex-col gap-4 bg-surface p-4 overflow-hidden rounded-lg">
            <div className="w-full grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-2">
              <span className="text-3xl">
                <FontAwesomeIcon icon={faUserCircle} />
              </span>
              <div className="flex flex-col gap-2 items-start">
                <ReviewStar
                  rating={feedback.rating}
                  onChange={(num) =>
                    setFeedback((fb) => ({ ...fb, rating: num }))
                  }
                  size={"text-xl"}
                  editable={true}
                />
                <span className="text-xs opacity-50">
                  {new Date().toISOString().split("T")[0]}
                </span>
                <InputArea
                  value={feedback.content}
                  onTextChange={(e) =>
                    setFeedback((fb) => ({ ...fb, content: e.target.value }))
                  }
                  placeholder="add a feedback"
                />
              </div>
            </div>
            <button
              className="w-full button-variant-1"
              onClick={handleAddFeedback}
            >
              Add feedback
            </button>
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
                <button
                  key={value}
                  onClick={() => handleSetFeedbackFilter(value)}
                  className={`flex flex-row gap-1 items-center ${
                    feedbackFilter === value
                      ? "border-yellow-400"
                      : "border-surface"
                  } border-2  bg-surface   text-sm p-2  rounded-xl`}
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
                </button>
              ))}
            </ul>
          </div>
          <h2>
            {
              productFeedbacks.filter(
                (item) =>
                  item.rating === feedbackFilter || feedbackFilter === -1
              ).length
            }{" "}
            reviews
          </h2>
          <ul className="flex flex-col gap-4 py-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <FeedbackTag key={index} loading={true} />
                ))
              : productFeedbacks
                  .filter(
                    (item) =>
                      item.rating === feedbackFilter || feedbackFilter === -1
                  )
                  .map((feedback) => (
                    <FeedbackTag
                      key={feedback.feedback_id}
                      feedback={feedback}
                    />
                  ))}
          </ul>
        </div>
      </div>
      <p className="text-2xl font-semibold my-4 ">
        Other products from {product?.categories[0].category_name}
      </p>
      <ul className="w-full overflow-scroll no-scrollbar flex flex-row gap-2">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <ProductCard key={index} loading={true} />
            ))
          : products
              .filter(
                (pd) =>
                  pd.categories[0].category_id ===
                  product?.categories[0].category_id
              )
              .map((pd) => <ProductCard key={pd.product_id} product={pd} />)}
      </ul>
      <p className="text-2xl font-semibold my-4 ">Explore other products</p>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 overflow-visible w-full">
        {isLoading
          ? Array.from({ length: 16 }).map((_, index) => (
              <ProductCard key={index} loading={true} />
            ))
          : products.map((item) => (
              <ProductCard key={item.product_id} product={item} />
            ))}
      </ul>
    </section>
  );
};

export default Product;
