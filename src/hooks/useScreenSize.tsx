import { useEffect, useState } from 'react'

export interface ScreenSize {
  windowHeight: number
  windowWidth: number
}

const useScreenSize = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    windowHeight: window?.innerHeight,
    windowWidth: window?.innerWidth
  })

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        windowHeight: window?.innerHeight,
        windowWidth: window?.innerWidth
      })
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return screenSize
}

export default useScreenSize
