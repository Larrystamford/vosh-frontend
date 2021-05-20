import React, { useState, useEffect } from "react";
import "./Components.css";
import { ImageLoadWithFade } from "./ImageLoadWithFade";

// these video definitely has product image/s
export const ProductImagesCarousel = ({ affiliateProducts, className }) => {
  let index = 0;
  let imageIndex;

  const [displayingImage, setDisplayingImage] = useState("");
  const [fadeIn, setFadeIn] = useState(true);

  function changeImage(productImages) {
    setFadeIn(true);
    index++;
    imageIndex = index % productImages.length;
    setDisplayingImage(productImages[imageIndex]);
    setTimeout(() => {
      setFadeIn(false);
    }, 6400);
  }

  useEffect(() => {
    let setFirstImage = false;
    const productImages = [];
    for (const eachProduct of affiliateProducts) {
      if (eachProduct.itemImage) {
        if (!setFirstImage) {
          setDisplayingImage(eachProduct.itemImage);
          setFirstImage = true;
        }
        productImages.push(eachProduct.itemImage);
      }
    }

    if (productImages.length > 1) {
      setTimeout(() => {
        setFadeIn(false);
      }, 6400);

      setInterval(() => changeImage(productImages), 7000);
    }
  }, []);

  return (
    <ImageLoadWithFade
      src={displayingImage}
      className={className}
      fadeIn={fadeIn}
      setFadeIn={setFadeIn}
    />
  );
};
