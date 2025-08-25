import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const CustomPrevArrow = ({ className, onClick }) => (
  <div
    className={className}
    style={{
      ...arrowStyle,
      left: "10px"
    }}
    onClick={onClick}
  />
);

const CustomNextArrow = ({ className, onClick }) => (
  <div
    className={className}
    style={{
      ...arrowStyle,
      right: "-5px"
    }}
    onClick={onClick}
  />
);

const arrowStyle = {
  display: "block",
  zIndex: 2,
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: "40px",
  height: "40px",
  borderRadius: "50%"
};

const ImageSlider = () => {
  const images = [
    "public/Images/Laptop.jpg",
    "public/Images/Buds.jpg",
    "public/Images/samsung.webp",
    "public/Images/Tv.avif",
  ];

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />
  };

  return (
    <div style={{ height: "100%", margin: "auto", position: "relative" }}>
      <Slider {...settings}>
        {images.map((url, index) => (
          <div key={index}>
            <img
              src={url}
              alt={`Slide ${index + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
