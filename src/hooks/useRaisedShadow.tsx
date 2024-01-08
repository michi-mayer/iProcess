import { useEffect } from 'react'
import { animate, MotionValue, useMotionValue } from 'framer-motion'
import { colors } from 'theme'

const inactiveShadow = `0px 0px 0px ${colors.gray1}`

export const useRaisedShadow = (value: MotionValue<number>) => {
  const boxShadow = useMotionValue(inactiveShadow)

  useEffect(() => {
    let isActive = false
    const unsubscribe = value.on('change', (latest: number) => {
      const wasActive = isActive
      if (latest !== 0) {
        isActive = true
        if (isActive !== wasActive) {
          animate(boxShadow, `5px 5px 10px ${colors.gray2}`)
        }
      } else {
        isActive = false
        if (isActive !== wasActive) {
          animate(boxShadow, inactiveShadow)
        }
      }
    })
    return () => unsubscribe()
  }, [value, boxShadow])
  return boxShadow
}
