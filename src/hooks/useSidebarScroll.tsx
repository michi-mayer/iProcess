import { createRef, useEffect, useMemo, useRef } from 'react'
import { useStoreSideBar } from 'contexts/sidebarStore'
import useMediaQuery from 'hooks/useMediaQuery'

const useSidebarScroll = <T extends object>(items: T[] | undefined, maxHeightScrollableArea: number) => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [{ isCollapsed, hasUnitSelected }, setStore] = useStoreSideBar((_) => _)
  const [isDesktopWidth, isTabletHeight] = useMediaQuery('lg', 'max-height: 800px')
  const pixelsToScroll = isTabletHeight ? 60 : 70

  const handleScrollUp = () => {
    if (scrollRef.current?.scrollTop) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollTop - pixelsToScroll,
        behavior: 'smooth'
      })
    }
  }

  const handleScrollDown = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollTop + pixelsToScroll,
        behavior: 'smooth'
      })
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      if (scrollTop === 0) {
        setStore({
          showScrollUp: false,
          showScrollDown: true
        })
      } else if (scrollTop + clientHeight === scrollHeight) {
        setStore({
          showScrollUp: true,
          showScrollDown: false
        })
      } else {
        setStore({
          showScrollUp: true,
          showScrollDown: true
        })
      }
    }
  }
  // eslint-disable-next-line unicorn/prevent-abbreviations
  const unitRefs = useMemo(() => items?.map(() => createRef<HTMLDivElement>()), [items])

  useEffect(() => {
    const listener = () => {
      if (unitRefs) {
        let totalHeight: number = 0

        for (const divRef of unitRefs) {
          totalHeight += divRef.current?.offsetHeight ?? 0
        }

        const height = window.innerHeight - maxHeightScrollableArea
        if (totalHeight <= height) {
          setStore({
            showScrollDown: false,
            showScrollUp: false
          })
        } else {
          setStore({
            showScrollDown: true
          })
        }
      }
    }
    listener()
    window.addEventListener('resize', listener)
    return () => {
      window.removeEventListener('resize', listener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitRefs, isCollapsed, maxHeightScrollableArea])

  useEffect(() => {
    const listener = () => {
      if (hasUnitSelected && !isDesktopWidth) {
        setStore({ isCollapsed: true })
      }
    }
    window.addEventListener('resize', listener)
    return () => {
      window.removeEventListener('resize', listener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    scrollRef,
    unitRefs,
    handleScroll,
    handleScrollDown,
    handleScrollUp
  }
}

export default useSidebarScroll
