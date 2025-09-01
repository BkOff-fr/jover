'use client'

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const GSAPTest: React.FC = () => {
  const testRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('🧪 Test GSAP simple');
    
    if (!testRef.current) {
      console.error('❌ Élément test non trouvé');
      return;
    }

    if (typeof gsap === 'undefined') {
      console.error('❌ GSAP non disponible dans test');
      return;
    }

    console.log('✅ GSAP disponible, lancement test...');
    
    // Animation très simple
    gsap.to(testRef.current, {
      x: 100,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      onStart: () => console.log('🎬 Animation test démarrée'),
      onComplete: () => console.log('✅ Animation test terminée')
    });

  }, []);

  return (
    <div style={{ padding: '20px', background: 'rgba(255,0,0,0.2)' }}>
      <div 
        ref={testRef}
        style={{
          width: '50px',
          height: '50px',
          background: '#1EB900',
          borderRadius: '4px'
        }}
      >
        TEST
      </div>
      <p>Si GSAP fonctionne, ce carré vert doit bouger</p>
    </div>
  );
};

export default GSAPTest;