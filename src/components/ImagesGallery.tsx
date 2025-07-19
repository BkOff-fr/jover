import React from 'react';
import image1 from '../assets/parallaxe/1.jpg';
import image2 from '../assets/parallaxe/2.jpg';
import image3 from '../assets/parallaxe/3.jpg';
import image4 from '../assets/parallaxe/4.jpg';
import image5 from '../assets/parallaxe/5.jpg';
import image6 from '../assets/parallaxe/6.jpg';
import image7 from '../assets/parallaxe/7.jpg';
import image8 from '../assets/parallaxe/8.jpg';
import image9 from '../assets/parallaxe/9.jpg';
import image10 from '../assets/parallaxe/10.jpg';

const ImagesGallery: React.FC = () => {
  const images: string[] = [
    image1, image2, image3, image4, image5, 
    image6, image7, image8, image9, image10
  ];

  return (
    <section className="images-gallery">
      {images.map((image, index) => (
        <div
          key={index}
          className="parallax-gallery-image"
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
    </section>
  );
};

export default ImagesGallery;