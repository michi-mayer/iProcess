import { CSSProperties, ReactNode } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { Color, colors } from 'theme'

interface Props {
  borderColor: Color
  Icon: ReactNode
  description: string
  onClose?: () => void
  containerStyle?: CSSProperties
  lineStyle?: CSSProperties
  typographyStyle?: CSSProperties
}

const Toast = ({
  Icon,
  description,
  onClose,
  borderColor,
  containerStyle: style,
  lineStyle,
  typographyStyle
}: Props) => {
  return (
    <AnimatePresence>
      <motion.div
        style={style}
        initial={{ opacity: 0, y: 20, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.5 }}
      >
        <Stack
          style={{
            margin: '8px',
            border: `2px solid ${borderColor}`,
            padding: '12px 24px',
            borderRadius: '2px',
            ...lineStyle
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              {Icon}
              <Typography variant='body1' style={{ marginLeft: '1rem', ...typographyStyle }}>
                {description}
              </Typography>
            </Box>
            {!!onClose && (
              <IconButton onClick={onClose} size='small' style={{ height: '24px' }}>
                <CloseIcon style={{ fontSize: 16, color: colors.blue }} />
              </IconButton>
            )}
          </div>
        </Stack>
      </motion.div>
    </AnimatePresence>
  )
}

export default Toast
