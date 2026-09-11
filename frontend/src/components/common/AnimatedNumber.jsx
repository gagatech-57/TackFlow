import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const AnimatedNumber = ({ value = 0, duration = 0.8, className = '' }) => {
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (current) => Math.round(current));
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = display.on('change', (latest) => {
      setCurrentValue(latest);
    });
    return () => unsubscribe();
  }, [display]);

  return (
    <span className={className} style={{ fontFamily: 'var(--font-mono)' }}>
      {currentValue}
    </span>
  );
};

export default AnimatedNumber;
