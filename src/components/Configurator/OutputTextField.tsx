import { forwardRef, useEffect } from 'react'
import { Grid, Typography } from '@mui/material'
import { Shift } from 'API'
import { ExtendedShiftModel, ShiftTranslator, SpeedMode, useIProcessState } from 'contexts/iProcessContext'
import useCalculateShiftTargetCustom from 'hooks/services/useCalculateShiftTargetCustom'
import InputForm, { InputFormProps } from 'lib/form/InputForm'
import { colors } from 'theme'

interface OutputTextFieldProps extends InputFormProps {
  cycleTime: SpeedMode | undefined
  shiftModelSelected: ExtendedShiftModel | undefined
  onCalculatedOutput: (value: number | undefined | null) => void
}

const OutputTextField = forwardRef<unknown, OutputTextFieldProps>(
  ({ title, error, disabled, style, cycleTime, onCalculatedOutput, shiftModelSelected, ...props }, ref) => {
    const { selectedShift } = useIProcessState()

    const { data: calculatedOutput, isFetching: isLoadingAdornmentSpinner } = useCalculateShiftTargetCustom({
      cycleTime: cycleTime?.value,
      shiftType: ShiftTranslator[selectedShift] as Shift,
      shiftModelId: shiftModelSelected?.id,
      enableQuery: disabled
    })

    useEffect(() => {
      if (calculatedOutput) {
        onCalculatedOutput(calculatedOutput)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calculatedOutput])

    return (
      <Grid container item direction='column'>
        {title && (
          <Typography variant='h3' color={error ? colors.redError : colors.blue}>
            {title}
          </Typography>
        )}
        <InputForm
          id='output-text-field'
          type='number'
          marginTop='0rem'
          {...props}
          style={{ width: '100%', fontSize: '16px', ...style }}
          ref={ref}
          error={error}
          disabled={disabled}
          isLoadingAdornmentSpinner={isLoadingAdornmentSpinner}
        />
      </Grid>
    )
  }
)

OutputTextField.displayName = 'OutputTextField'

export default OutputTextField
