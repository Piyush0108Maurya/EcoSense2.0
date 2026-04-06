import React, { useMemo } from 'react';

const Particles = () => {
  const dots = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      size: (3 + Math.random() * 2) + 'px',
      duration: (12 + Math.random() * 16) + 's',
      delay: (Math.random() * 20) + 's',
    }));
  }, []);

  return (
    <div className="particles-bg">
      {dots.map(dot => (
        <div 
          key={dot.id}
          className="particle"
          style={{
            left: dot.left,
            width: dot.size,
            height: dot.size,
            animationDuration: dot.duration,
            animationDelay: dot.delay,
            borderRadius: '50%',
            opacity: 0.15,
            position: 'absolute',
          }}
        />
      ))}
    </div>
  );
};

export default Particles;
