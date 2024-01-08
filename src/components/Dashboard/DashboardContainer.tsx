import { CSSProperties, PropsWithChildren } from 'react'
import { Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import useMediaQuery from 'hooks/useMediaQuery'
import { colors } from 'theme'

const StyledPaper = styled(Paper)({
  backgroundColor: colors.white,
  height: '100%',
  width: '1720px',
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${colors.gray3}`,
  borderRadius: '8px',
  margin: '0 16px 16px 16px'
})

interface UseDynamicHeight {
  mobileHeight?: string
}

const useDynamicHeight = ({ mobileHeight = '11.7rem' }: UseDynamicHeight) => {
  const [isDesktopWidth] = useMediaQuery('lg')
  const spaceToRemoveFromContainer = isDesktopWidth ? '10.7rem' : mobileHeight

  return `calc(100vh - ${spaceToRemoveFromContainer})`
}

interface Props extends PropsWithChildren, UseDynamicHeight {
  style?: CSSProperties
  id?: string
}

const DashboardContainer = ({ children, style, id, mobileHeight }: Props) => {
  const dynamicHeight = useDynamicHeight({ mobileHeight })
  const baseStyle = mobileHeight ? { height: dynamicHeight } : { minHeight: dynamicHeight }

  return (
    <StyledPaper elevation={0} id={id} style={{ ...baseStyle, ...style }}>
      {children}
    </StyledPaper>
  )
}

export default DashboardContainer
