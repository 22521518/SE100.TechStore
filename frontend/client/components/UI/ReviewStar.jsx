'use client'
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
import React from "react";

const ReviewStar = ({rating,size}) => {
  return (
    <div className={`flex flex-row gap-1 items-center text-yellow-400 ${size}`}>
      {Array.from({ length: rating / 1 }).map((_, index) => (
        <FontAwesomeIcon key={`full-${index}`} icon={faFullStar} />
      ))}
      {rating % 1 >= 0.5 && <FontAwesomeIcon icon={faStarHalfStroke} />}
      {Array.from({ length: 5 - Math.ceil(rating) }).map((_, index) => (
        <FontAwesomeIcon key={`empty-${index}`} icon={faEmptyStar} />
      ))}
    </div>
  );
};

export default ReviewStar;
