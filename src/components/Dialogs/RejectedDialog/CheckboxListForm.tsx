import { ChangeEvent, memo } from 'react'
// Hooks
import { useTranslation } from 'react-i18next'
// MUI
import { Checkbox, FormControlLabel, FormGroup, ListItemButton, Typography } from '@mui/material'
import { MeasureTranslationKeys } from 'components/Measures/ReportMeasures'

interface CheckboxListProps<T extends { id: string; value: string }> {
  id?: string
  items: T[] | undefined
  onChangeTextInput?: (event: ChangeEvent<HTMLInputElement>) => void
  textInputValue?: string
  checked: string[]
  onClickToggle: (item: T, event: React.MouseEvent<HTMLDivElement>) => void
  isError?: boolean
  errorMessage?: string
  translateText?: boolean
}

const CheckboxListForm = <T extends { id: string; value: string }>({
  id,
  items,
  isError,
  errorMessage,
  checked,
  onClickToggle,
  translateText = false
}: CheckboxListProps<T>) => {
  const { t } = useTranslation(['iProcess', 'measures'])

  return (
    <>
      <FormGroup id={id}>
        {items?.map((item) => {
          const itemText = translateText
            ? t(`measures:filter.${item.value.toLowerCase() as MeasureTranslationKeys}`)
            : item.value

          return (
            <ListItemButton key={item.id} onClick={(event) => onClickToggle(item, event)} style={{ maxHeight: '40px' }}>
              <FormControlLabel
                id={`checkbox-list-label-${item.value}`}
                control={<Checkbox />}
                label={itemText}
                checked={checked?.includes(item?.id ?? '')}
              />
            </ListItemButton>
          )
        })}
      </FormGroup>
      {isError ? (
        <Typography variant='subtitle2' style={{ padding: '12px' }}>
          {errorMessage}
          {t('iProcess:nioDialog.nioClassificationDamageTypeMissing')}
        </Typography>
      ) : undefined}
    </>
  )
}

export default memo(CheckboxListForm)
