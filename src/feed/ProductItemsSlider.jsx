import React, { useCallback, useState } from "react";
import Dialog from "@material-ui/core/Dialog";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

export const ProductItemsSlider = ({
  openSlider,
  handleSliderOpen,
  handleSliderClose,
  productImages,
}) => {
  return (
    <Dialog
      onClose={handleSliderClose}
      open={openSlider}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <Carousel autoPlay={false} showThumbs={false} interval={60000}>
        {productImages.map((eachImage) => (
          <div>
            <img className="product_item_picture" src={eachImage} />
          </div>
        ))}
      </Carousel>
    </Dialog>
  );
};
