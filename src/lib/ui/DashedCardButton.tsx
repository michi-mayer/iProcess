import { memo, ReactNode } from 'react'
import { Card, CardActionArea, styled, Typography } from '@mui/material'
import useDialogHandler from 'hooks/useDialogHandler'
import { colors } from 'theme'

const StyledCard = styled(Card)({
  height: '132px',
  width: '164px',
  margin: '10px',
  borderStyle: 'dashed',
  borderColor: colors.blue,
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative'
})

const SyledCardAction = styled(CardActionArea)({
  height: '100%',
  flex: 1
})

const Circle = styled('div')({
  background: colors.blue,
  fontSize: 24,
  height: 40,
  width: 40,
  margin: 'auto',
  borderRadius: '50%',
  color: colors.white
})

interface Props {
  dialogComponent: (onClose: () => void, open: boolean) => ReactNode
  label?: string
  id?: string
}

export const DashedCardButton = memo(({ dialogComponent, label, id }: Props) => {
  const { open, handleClickOpen, handleClose } = useDialogHandler()

  return (
    <StyledCard role='button'>
      <SyledCardAction id={id} onClick={handleClickOpen}>
        <Circle>+</Circle>
      </SyledCardAction>
      {dialogComponent(handleClose, open)}
      {label && (
        <Typography
          variant='caption'
          style={{ position: 'absolute', bottom: '0.75rem', right: '1rem', color: colors.blue }}
        >
          {label}
        </Typography>
      )}
    </StyledCard>
  )
})

DashedCardButton.displayName = 'DashedCardButton'
