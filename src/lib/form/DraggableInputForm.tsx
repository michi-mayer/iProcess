import { CSSProperties, forwardRef, memo, MouseEvent, MutableRefObject, ReactNode, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { Divider, Grid, IconButton, Menu, MenuItem } from '@mui/material'
import { DragControls, motion, MotionValue } from 'framer-motion'
import BurgerIconWithDragControls from 'components/Icons/BurgerIconWithDragControls'
import { WithID } from 'shared'
import { colors } from 'theme'
import InputForm, { InputFormProps } from './InputForm'

export type Direction = 'top' | 'bottom'

export const moveItemTo = <T extends WithID>(direction: Direction, items: T[]) => {
  return direction === 'top' ? 0 : items.length - 1
}

interface Props extends InputFormProps {
  index: number
  onDelete: (index: number) => void
  dragControls: DragControls
  onClickMove: (direction: Direction, index: number) => void
  moveTopText: string
  moveBottomText: string
  MiddleComponent?: ReactNode
  boxShadow?: MotionValue<string>
  iconRef?: MutableRefObject<SVGSVGElement | null>
  containerStyle?: CSSProperties
}

const DraggableInputForm = forwardRef(
  (
    {
      dragControls,
      onDelete,
      index,
      onClickMove,
      moveTopText,
      moveBottomText,
      MiddleComponent,
      boxShadow,
      iconRef,
      containerStyle,
      disabled,
      ...restOfInputProps
    }: Props,
    ref
  ) => {
    // eslint-disable-next-line unicorn/no-null
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorElement)

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setAnchorElement(event.currentTarget)
    }

    const handleClose = () => {
      // eslint-disable-next-line unicorn/no-null
      setAnchorElement(null)
    }

    const handleClickMove = (direction: Direction) => {
      onClickMove(direction, index)
      handleClose()
    }

    return (
      <Grid container display='flex' alignItems='center' style={containerStyle}>
        <Grid item>
          <IconButton onContextMenu={handleClick} style={{ padding: 0, marginRight: '1rem' }}>
            <BurgerIconWithDragControls dragControls={dragControls} ref={iconRef} />
          </IconButton>
          <Menu
            id='basic-menu'
            anchorEl={anchorElement}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem onClick={() => handleClickMove('top')}>{moveTopText}</MenuItem>
            <Divider />
            <MenuItem onClick={() => handleClickMove('bottom')}>{moveBottomText}</MenuItem>
          </Menu>
        </Grid>
        <Grid item style={{ marginRight: '1rem' }}>
          <motion.div style={{ boxShadow }}>
            <InputForm
              marginTop='0px'
              type='text'
              inputProps={{
                maxLength: 16
              }}
              style={{ width: '100%' }}
              {...restOfInputProps}
              disabled={disabled}
              ref={ref}
            />
          </motion.div>
        </Grid>
        {!!MiddleComponent && <Grid item>{MiddleComponent}</Grid>}
        <Grid item>
          <IconButton id={`delete-item-${index}`} size='medium' onClick={() => onDelete(index)} disabled={disabled}>
            <DeleteIcon style={{ color: colors.blue }} />
          </IconButton>
        </Grid>
      </Grid>
    )
  }
)
DraggableInputForm.displayName = 'DraggableInputForm'

export default memo(DraggableInputForm)
