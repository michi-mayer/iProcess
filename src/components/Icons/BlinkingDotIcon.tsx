import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'

interface DotIconProps {
  style?: CSSProperties
}

const BlinkingDotIcon = ({ style }: DotIconProps) => {
  return (
    <motion.div
      animate={{ opacity: 0.24 }}
      transition={{
        ease: 'easeInOut',
        easings: ['easeIn', 'easeOut'],
        duration: 1,
        repeat: Number.POSITIVE_INFINITY
      }}
      style={{
        height: '9px',
        width: '9px',
        borderRadius: '50%',
        marginRight: '4px',
        ...style
      }}
    />
  )
}

export default BlinkingDotIcon
