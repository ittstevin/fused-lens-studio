import { motion } from 'framer-motion'
import './Effects.css'

export function ShimmerLine({ direction = 'horizontal', className = '' }) {
  return (
    <div className={`shimmer-container shimmer-container--${direction} ${className}`}>
      <motion.div
        className="shimmer-line"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}

