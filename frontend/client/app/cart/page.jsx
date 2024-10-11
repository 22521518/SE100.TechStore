"use client";
import CheckBox from "@components/Input/CheckBox";
import CartItem from "@components/UI/CartItem";
import Divider from "@components/UI/Divider";
import { faCheckSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useReducer, useState, useEffect } from "react";

function reducer(state, action) {
  if (action.type === "change_subtotal" && action.payload >= 0) {
    return { ...state, subtotal: action.payload };
  } else if (action.type === "change_discount" && action.payload >= 0) {
    return { ...state, discount: action.payload };
  } else if (action.type === "change_total" && action.payload >= 0) {
    return { ...state, total: action.payload };
  }
  return state;
}

const Cart = () => {
  const router = useRouter()
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "iPhone 16 Pro Max",
      category: "smart phone",
      price: 16000000,
      quantity: 1,
      checked: false,
    },
    {
      id: "2",
      name: "Laptop dell",
      category: "laptop",
      price: 45000000,
      quantity: 1,
      checked: false,
    },
    {
      id: "3",
      name: "PS5",
      category: "game console",
      price: 7000000,
      quantity: 1,
      checked: false,
    },
  ]);
  const [receipt, dispatch] = useReducer(reducer, {
    subtotal: 0,
    discount: 0,
    total: 0,
  });

  useEffect ( () => {
    const newSubtotal = cartItems.reduce((acc, item) => {
      return item.checked ? acc + item.price * item.quantity : acc;
    }, 0);

    dispatch({ type: "change_subtotal", payload: newSubtotal });

  },[cartItems])

  useEffect(() => {
    const total = receipt.subtotal - receipt.discount;
    dispatch({ type: "change_total", payload: total < 0 ? 0 : total });
  }, [receipt.subtotal, receipt.discount]);

  const handleCheckout = async () => {
    router.push('cart/checkout')
  }

  const handleRemoveItem = (id) => {
    const newCart = cartItems.filter(item => item.id!==id)
    
    setCartItems(newCart)

  };

  

  const handleRemoveAllItems = () => {
    setCartItems([])
  };

  const setAllCheckState = (checked) => {
    const newCart = cartItems.map((item) => {
      return { ...item, checked };
    });

    setCartItems(newCart)
  };


  const handleCalculateSubtotal = (id, quantity, checked) => {
    const newCart = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, checked, quantity };
      }
      return item;
    });

    setCartItems(newCart)

  };

  return (
    <section className="size-full flex flex-col items-center gap-10 p-4">
      <div className="w-full grid grid-cols-1 md:grid-rows-[auto_1fr] md:grid-flow-col gap-4">
        {/* Cart header */}
        <div className="flex flex-row justify-between items-end">
          <h1 className="font-bold text-4xl">Cart</h1>
          <button
            className="button-variant-1 text-xs md:text-base"
            onClick={handleRemoveAllItems}
          >
            <FontAwesomeIcon icon={faTrash} />
            <span>Remove all</span>
          </button>
        </div>
        {/* Cart items list */}
        <div className="panel-1 ">
          <div className="w-full">
            <div className="grid grid-cols-[auto_1fr_1fr] sm:grid-cols-[auto_1fr_1fr_20%] items-center font-bold gap-2 text-on-surface">
              <CheckBox
                onChecked={() => setAllCheckState(true)}
                onUnchecked={() => setAllCheckState(false)}
              />
              <h1 className="text-left">Produt</h1>
              <h1 className="hidden sm:inline-block text-center ml-auto">
                Quanity
              </h1>
              <h1 className="text-right">Price</h1>
            </div>
            <Divider/>
            <ul className="flex flex-col gap-4 py-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  reCalculate={handleCalculateSubtotal}
                  cartItem={item}
                  removeItem={handleRemoveItem}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* Total review */}
        <div className="panel-1 flex flex-col gap-10 text-base min-w-[250px] md:row-start-2">
          <div className="flex flex-row justify-between items-center gap-4">
            <h1 className="opacity-70">Subtotal</h1>
            <span className="">
              {Intl.NumberFormat("en-US").format(receipt.subtotal)} VNĐ
            </span>
          </div>
          <div className="flex flex-row justify-between items-center gap-4">
            <h1 className="opacity-70">Discount</h1>
            <span>
              {Intl.NumberFormat("en-US").format(receipt.discount)} VNĐ
            </span>
          </div>

          <Divider/>

          <div className="flex flex-row justify-between items-center gap-4">
            <h1>Grand total</h1>
            <span className="font-bold text-lg">
              {Intl.NumberFormat("en-US").format(receipt.total)} VNĐ
            </span>
          </div>

          <button className="button-variant-1 w-full" onClick={handleCheckout}> Checkout now</button>
        </div>
      </div>
    </section>
  );
};

export default Cart;
