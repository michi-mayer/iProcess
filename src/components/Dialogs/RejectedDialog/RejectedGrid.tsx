import { memo } from 'react'
import { Button, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import { colors } from 'theme'

const RejectedGridContainer = styled(Grid)({
  padding: 0,
  margin: 0,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
})

const RejectedGridCard = styled(Button)({
  minWidth: '55px',
  height: '50px',
  border: '1px solid #bbb',
  borderRadius: '0px',
  padding: '0px'
})

// Number of rejectedGridItems is 4x5
const rejectedGridItems = Array.from({ length: 20 }, (_, i) => 1 + i)

export type GridImage = 'gridImageA' | 'gridImageB'

interface RejectedGridProps {
  backgroundImage: string
  name: GridImage
  onClickRejectedGrid: (item: number, name: GridImage) => void
  nioClassificationGrid: number[] | undefined
}

const RejectedGrid = ({ backgroundImage, name, onClickRejectedGrid, nioClassificationGrid }: RejectedGridProps) => {
  return (
    <RejectedGridContainer container item style={{ backgroundImage }}>
      {rejectedGridItems.map((gridItem) => {
        return (
          <Grid item key={gridItem}>
            <RejectedGridCard
              id='rejected-tile'
              onClick={() => onClickRejectedGrid(gridItem, name)}
              style={{ backgroundColor: nioClassificationGrid?.includes(gridItem) ? colors.blueOpacity : undefined }}
            />
          </Grid>
        )
      })}
    </RejectedGridContainer>
  )
}

export default memo(RejectedGrid)
