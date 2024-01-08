import { ChangeEvent, FocusEvent, forwardRef, memo, MutableRefObject } from 'react'
import { useFormContext } from 'react-hook-form'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { Grid, IconButton, OutlinedInput, Paper, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { colors } from 'theme'

const OutlinedInputStyled = styled(OutlinedInput)({
  marginTop: '5px',
  border: '0.5px solid ' + colors.gray3,
  borderRadius: 0,
  height: '48px',
  '& .Mui-error': {
    borderColor: colors.redError
  },
  input: {
    paddingTop: '4px',
    paddingLeft: '8px',
    paddingBottom: '4px',
    paddingRight: '8px',
    width: '100px',
    textAlign: 'center'
  },
  /* The lines below remove the arrows on a <input type=number /> */
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    display: 'none'
  }
})

interface CounterProps {
  value?: number | string | undefined
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: FocusEvent<HTMLTextAreaElement | HTMLInputElement, Element>) => void
  errorMessage: string
  isError: boolean
  name: string
  firstUpdate?: MutableRefObject<boolean>
  formStateField: 'count' | 'lostVehicles'
  defaultValue?: number
  inputId?: string
  addButtonId?: string
  removeButtonId?: string
}

const Counter = forwardRef(
  (
    {
      value,
      onChange,
      onBlur,
      name,
      firstUpdate,
      formStateField,
      errorMessage,
      isError,
      defaultValue,
      inputId,
      addButtonId,
      removeButtonId
    }: CounterProps,
    ref
  ) => {
    const { getValues, setValue } = useFormContext()

    const handleClick = (number: number) => {
      if (firstUpdate) {
        firstUpdate.current = false
      }

      const value = getValues()[formStateField]
      const newValue = value || 0
      if (newValue + number >= 0) {
        setValue(formStateField, newValue + number, { shouldValidate: true })
      }
    }

    return (
      <div>
        <Paper
          style={{
            backgroundColor: colors.bluegray,
            height: '48px',
            width: '200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Grid item>
            <IconButton disabled={!defaultValue} onClick={() => handleClick(-1)} size='small' id={removeButtonId}>
              <RemoveIcon
                color='primary'
                style={{ fontSize: '40px', color: !defaultValue ? colors.gray2 : undefined }}
              />
            </IconButton>
          </Grid>
          <Grid item>
            <OutlinedInputStyled
              type='number'
              id={inputId}
              style={{
                backgroundColor: colors.white,
                width: '56px',
                height: '40px',
                marginTop: '0px'
              }}
              error={isError}
              onChange={onChange}
              onBlur={onBlur}
              name={name}
              value={value}
              defaultValue={defaultValue}
              ref={ref}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item>
            <IconButton onClick={() => handleClick(1)} size='small' id={addButtonId}>
              <AddIcon
                  color='primary'
                  style={{ fontSize: '40px' }}
              />
            </IconButton>
          </Grid>
        </Paper>
        <Grid item xs={12}>
          {isError && (
            <Typography variant='subtitle2' style={{ padding: '12px' }}>
              {errorMessage}
            </Typography>
          )}
        </Grid>
      </div>
    )
  }
)

Counter.displayName = 'Counter'

export default memo(Counter)
