import React from "react";
import galleryImages from "./galleryImages";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const MasonryImagesGallery = () => {
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 576: 2, 768: 3, 1024: 4, 1200: 5 }}>
      <Masonry gutter="1rem">
        {galleryImages.map((item, index) => (
          <img
            className="masonry__img"
            src={item}
            key={index}
            alt=""
            style={{
              width: "100%",
              display: "block",
              borderRadius: "10px",
              height: index === 4 || index === 5 ? "300px" : "200px", // taller for vertical images
              objectFit: "cover" // maintain aspect ratio and fill the space
            }}
          />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default MasonryImagesGallery;
