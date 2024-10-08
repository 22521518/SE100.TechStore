"use client";
import CheckBox from "@components/Input/CheckBox";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React, { useState, useEffect, useReducer } from "react";

function reducer(state, action) {
  if (action.type === "incremented_quantity") {
    return { quantity: state.quantity + 1 };
  } else if (action.type === "decremented_quantity" && state.quantity > 1) {
    return { quantity: state.quantity - 1 };
  }
  return state;
}

const CartItem = ({reCalculate, cartItem , removeItem }) => {
  const [isChecked, setIsChecked] = useState(cartItem.checked);
  const [state,dispatch] = useReducer(reducer,{quantity:cartItem.quantity})

  useEffect(() => {
    reCalculate(cartItem.id,state.quantity,isChecked);
  }, [state.quantity,isChecked]);

  useEffect(() => {
    setIsChecked(cartItem.checked);
  }, [cartItem.checked]);

  const handleRemoveItem = () => {
    removeItem(cartItem.id)
  }

  return (
    <div className="grid grid-cols-[auto_1fr_1fr] sm:grid-cols-[auto_1fr_auto_20%] items-center gap-2 pb-2 last:border-none">
      <CheckBox onChecked={() => setIsChecked(true)} onUnchecked={() => {setIsChecked(false)}} checked={cartItem.checked}/>

      <div className="flex flex-row">
        <div className="w-[70px] md:w-[100px]  md:scale-[1.2] transition-transform duration-200 aspect-square">
          <Image
            src="https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-15-Pro/Blue-Titanium/Apple-iPhone-15-Pro-Blue-Titanium-thumbnail.png"
            alt="product image"
            width={300}
            height={300}
            className="size-full object-contain"
          />
        </div>
        <div className="flex flex-col justify-around items-start">
          <h1 className="text-sm">{cartItem.name}</h1>
          <h2 className="text-xs text-on-surface/40">{cartItem.category}</h2>
        </div>
      </div>
      <div className='sm:flex flex-col gap-2 items-center justify-center hidden'>
        <div className="bg-secondary/40 border-2 border-on-surface rounded-xl  w-fit text-on-surface grid grid-cols-3 ml-auto">
          <button
            className="size-7 text-xl flex items-center justify-center"
            onClick={() =>  dispatch({ type: "decremented_quantity" })}
        
          >
            -
          </button>
          <div className="size-7 text-xl flex items-center justify-center">
            {state.quantity}
          </div>
          <button
            className="size-7 text-xl flex items-center justify-center"
            onClick={() => dispatch({ type: "incremented_quantity" })}
        
          >
            +
          </button>
        </div>

        <button className='flex flex-row items-center justify-center gap-2 underline text-sm md:text-base'  onClick={handleRemoveItem}>
          <FontAwesomeIcon icon={faTrash}/>
           Remove
        </button>
      </div>
      <div className="flex flex-col items-end sm:justify-center justify-between h-full">
        <span className="text-sm sm:text-base font-semibold">
          {Intl.NumberFormat("en-US").format(cartItem.price)} VNĐ
        </span>
        <div className='sm:hidden flex-col gap-2 items-end justify-center flex'>
          <div className="bg-secondary/40 border-2 border-on-surface rounded-xl  w-fit text-on-surface grid grid-cols-3 ">
            <button
              className="size-5 text-base flex items-center justify-center"
              onClick={() => dispatch({ type: "decremented_quantity" })}
          
            >
              -
            </button>
            <div className="size-5 text-base flex items-center justify-center">
              {state.quantity}
            </div>
            <button
              className="size-5 text-base flex items-center justify-center"
              onClick={() => dispatch({ type: "incremented_quantity" })}
          
            >
              +
            </button>
          </div>
          <button className='flex flex-row items-center justify-center gap-2 underline text-sm md:text-base' onClick={handleRemoveItem}>
            <FontAwesomeIcon icon={faTrash}/>
             Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
