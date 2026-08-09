import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function Card({ children, hover = false, className, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, transition: { duration: 0.15 } } : undefined}
      className={cn('sn-card', hover && 'sn-card-hover cursor-pointer', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
