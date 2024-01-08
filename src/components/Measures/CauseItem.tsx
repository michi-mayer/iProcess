import { MutableRefObject, useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CloseIcon from '@mui/icons-material/Close'
import { Grid, IconButton, Typography } from '@mui/material'
import { Cause } from 'APIcustom'
import { Reorder, useDragControls, useMotionValue } from 'framer-motion'
import BurgerIconWithDragControls from 'components/Icons/BurgerIconWithDragControls'
import { useRaisedShadow } from 'hooks/useRaisedShadow'
import { CustomInput } from 'lib/form/InputForm'
import { colors } from 'theme'
import { IReportMeasureState } from './ReportMeasures'

interface Props {
  dragConstraints: MutableRefObject<HTMLDivElement | null>
  index: number
  onDelete: (index: number) => void
}

const CauseItem = ({ index, dragConstraints, onDelete }: Props) => {
  const {
    register,
    watch,
    formState: { errors }
  } = useFormContext<IReportMeasureState>()
  const causes: Cause[] = watch('causes')
  const { t } = useTranslation('measures')
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()
  const isError = !!errors.causes?.[index]?.cause
  const iRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    const touchHandler = (event: Event) => event.preventDefault()

    const iTag = iRef.current

    if (iTag) {
      iTag.addEventListener('touchstart', touchHandler)

      return () => {
        iTag.removeEventListener('touchstart', touchHandler)
      }
    }
  }, [iRef])

  return (
    <Grid container alignItems='center' display='flex' marginTop='1rem'>
      <Typography variant='caption' style={{ width: '3%', color: colors.blue }}>
        {index + 1} .
      </Typography>
      <Reorder.Item
        value={causes[index]}
        id={causes[index]?.id}
        dragConstraints={dragConstraints}
        dragElastic={0.2}
        dragControls={dragControls}
        dragListener={false}
        style={{
          padding: 0,
          boxShadow,
          width: '97%',
          listStyleType: 'none',
          y
        }}
      >
        <CustomInput
          disableUnderline
          {...register(`causes.${index}.cause`)}
          startAdornment={<BurgerIconWithDragControls dragControls={dragControls} ref={iRef} />}
          endAdornment={
            <IconButton onClick={() => onDelete(index)} size='small'>
              <CloseIcon color='primary' />
            </IconButton>
          }
          error={isError}
          type='text'
          placeholder={t('systematicProblemAnalysis.causePlaceholder')}
          style={{ display: 'flex', userSelect: 'none' }}
          id={`cause-${index}`}
        />
        {isError && (
          <Typography variant='caption' style={{ color: colors.redError, fontSize: 12 }}>
            {t('systematicProblemAnalysis.causeError')}
          </Typography>
        )}
      </Reorder.Item>
    </Grid>
  )
}

export default CauseItem
