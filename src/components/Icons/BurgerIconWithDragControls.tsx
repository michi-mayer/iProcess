import { forwardRef, LegacyRef } from 'react'
import { DragControls } from 'framer-motion'
import { colors } from 'theme'

const BurgerIconWithDragControls = forwardRef(
  ({ dragControls }: { dragControls?: DragControls }, ref: LegacyRef<SVGSVGElement>) => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        height='24'
        width='24'
        style={{ cursor: 'move' }}
        onPointerDown={(event) => dragControls?.start(event)}
        ref={ref}
      >
        <path fill={colors.blue} d='M20 6v1H4V6h16zM20 17v1H4v-1h16zM20 12.5v-1H4v1h16z' />
      </svg>
    )
  }
)

BurgerIconWithDragControls.displayName = 'BurgerIconWithDragControls'

export default BurgerIconWithDragControls
