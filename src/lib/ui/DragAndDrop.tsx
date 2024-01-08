import { CSSProperties, FC, MutableRefObject, PropsWithChildren, ReactNode, useEffect, useRef } from 'react'
import { Stack } from '@mui/material'
import { DragControls, MotionValue, Reorder, useDragControls, useMotionValue } from 'framer-motion'
import { useRaisedShadow } from 'hooks/useRaisedShadow'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getChildren = (children: ReactNode | ((...args: any[]) => ReactNode), ...args: unknown[]) =>
  typeof children === 'function' ? children(...args) : children

interface Item {
  id: string
  name: string
  index: number
}

interface GroupProps<T extends Item> extends PropsWithChildren {
  values: T[]
  onReorder: (items: T[]) => void
  style?: CSSProperties
  axis?: 'x' | 'y'
}

export const Group = <T extends Item>({ values, onReorder, style, children, axis }: GroupProps<T>) => (
  <Reorder.Group axis={axis} values={values} onReorder={onReorder} style={{ margin: 0, padding: 0, ...style }}>
    {children}
  </Reorder.Group>
)

Group.displayName = 'DragAndDrop.Group'

interface ItemProps<T extends Item> {
  dragConstraints?: MutableRefObject<HTMLDivElement | null>
  item?: T
  children:
    | ReactNode
    | ((
        dragControls: DragControls,
        boxShadow: MotionValue<string>,
        iRef: MutableRefObject<SVGSVGElement | null>
      ) => ReactNode)
  hasShadow?: boolean
}

export const Item = <T extends Item>({ dragConstraints, item, children, hasShadow = false }: ItemProps<T>) => {
  const iRef = useRef<SVGSVGElement | null>(null)
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()

  useEffect(() => {
    const touchHandler = (event: Event) => event.preventDefault()

    const iTag = iRef.current

    if (iTag) {
      iTag.addEventListener('touchstart', touchHandler, { passive: false })

      return () => {
        iTag.removeEventListener('touchstart', touchHandler)
      }
    }
  }, [iRef])

  return (
    <Reorder.Item
      id={item?.id}
      value={item}
      dragConstraints={dragConstraints}
      dragElastic={0.2}
      dragControls={dragControls}
      dragListener={false}
      style={{
        listStyleType: 'none',
        y,
        boxShadow: hasShadow ? boxShadow : undefined
      }}
    >
      {getChildren(children, dragControls, boxShadow, iRef)}
    </Reorder.Item>
  )
}

Item.displayName = 'DragAndDrop.Item'

interface DragAndDropProps {
  children: ReactNode | ((dragConstraints: MutableRefObject<HTMLDivElement | null>) => ReactNode)
  style?: CSSProperties
}

interface DragAndDropSubComponents {
  Item: typeof Item
  Group: typeof Group
}

const DragAndDrop: FC<DragAndDropProps> & DragAndDropSubComponents = ({ children, style }: DragAndDropProps) => {
  const dragConstraints = useRef<HTMLDivElement | null>(null)

  return (
    <Stack ref={dragConstraints} style={style}>
      {getChildren(children, dragConstraints)}
    </Stack>
  )
}

DragAndDrop.Item = Item
DragAndDrop.Group = Group

export default DragAndDrop
