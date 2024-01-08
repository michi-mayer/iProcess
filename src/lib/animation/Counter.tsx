import { AnimatePresence, motion, Variants } from 'framer-motion'

const variants: Variants = {
  initial: {
    translateY: '-110%',
    translateX: '-50%',
    opacity: 0,
    transition: {
      translateY: { duration: 0.5 },
      opacity: { duration: 0.5 }
    }
  },
  animate: {
    translateY: '-50%',
    translateX: '-50%',
    opacity: 1,
    transition: {
      translateY: { duration: 0.5 },
      opacity: { duration: 0.5 }
    }
  },
  exit: {
    translateY: '-20%',
    translateX: '-50%',
    opacity: 0,
    transition: {
      translateY: { duration: 0.5 },
      opacity: { duration: 0.5 }
    }
  }
}

interface CounterProps {
  value: number | string
}

const Counter = ({ value }: CounterProps) => (
  <AnimatePresence>
    <motion.span
      key={value}
      variants={variants}
      animate='animate'
      initial='initial'
      exit='exit'
      style={{
        position: 'absolute',
        top: '72px'
      }}
    >
      {value}
    </motion.span>
  </AnimatePresence>
)

export default Counter
