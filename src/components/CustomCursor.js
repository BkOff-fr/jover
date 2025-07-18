import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const crosshairRef = useRef(null);
  const rectangleRef = useRef(null);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    let animationId;
    let mouseX = 0;
    let mouseY = 0;
    let rectX = 0;
    let rectY = 0;
    const smoothness = 0.1;

    const updateCursorPosition = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Initialiser la position du rectangle au premier mouvement
      if (rectX === 0 && rectY === 0) {
        rectX = mouseX;
        rectY = mouseY;
      }
    };

    const animateCursor = () => {
      // Curseur principal (croix) suit exactement la souris
      if (crosshairRef.current) {
        crosshairRef.current.style.left = `${mouseX}px`;
        crosshairRef.current.style.top = `${mouseY}px`;
        crosshairRef.current.style.opacity = '1';
      }
      
      // Rectangle suit avec délai
      if (rectangleRef.current) {
        rectX += (mouseX - rectX) * smoothness;
        rectY += (mouseY - rectY) * smoothness;
        
        rectangleRef.current.style.left = `${rectX}px`;
        rectangleRef.current.style.top = `${rectY}px`;
        rectangleRef.current.style.opacity = '1';
      }
      
      animationId = requestAnimationFrame(animateCursor);
    };

    const hideCursor = () => {
      if (crosshairRef.current) {
        crosshairRef.current.style.opacity = '0';
      }
      if (rectangleRef.current) {
        rectangleRef.current.style.opacity = '0';
      }
    };

    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mouseleave', hideCursor);
    
    animationId = requestAnimationFrame(animateCursor);

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mouseleave', hideCursor);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseEnter = () => {
      crosshairRef.current?.classList.add('hover');
      rectangleRef.current?.classList.add('hover');
    };

    const handleMouseLeave = () => {
      crosshairRef.current?.classList.remove('hover');
      rectangleRef.current?.classList.remove('hover');
    };

    const handleClick = () => {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 150);
    };

    const interactiveElements = document.querySelectorAll('a, button, .interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    document.addEventListener('click', handleClick);

    return () => {
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      {/* Petit carré avec croix - suit exactement la souris */}
      <div 
        ref={crosshairRef}
        className={`cursor-crosshair ${isFlashing ? 'flashing' : ''}`}
        style={{
          position: 'fixed',
          width: '12px',
          height: '12px',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          willChange: 'left, top, opacity',
        }}
      />
      
      {/* Rectangle extérieur - suit avec délai */}
      <div 
        ref={rectangleRef}
        className="cursor-rectangle"
        style={{
          position: 'fixed',
          width: '50px',
          height: '30px',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          willChange: 'left, top, opacity',
        }}
      />
    </>
  );
};

export default CustomCursor;