import { CSSProperties, PropsWithChildren } from 'react'
import { Grid, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { styled } from '@mui/system'
import ErrorMessage, { ErrorMessageProps } from 'components/ErrorMessage'
import AddIcon from 'components/Icons/AddIcon'
import { colors } from 'theme'

const StackInputFormLayout = styled(Grid)({
  borderBottom: `0.3px solid ${colors.gray2}`,
  paddingBottom: '5px',
  paddingTop: '5px'
})

export interface StackInputFormProps extends ErrorMessageProps {
  id?: string
  title: string
  name: string
  addItemTitle: string
  amountOfItems: number
  maxElements?: number
  width?: CSSProperties['width']
  handleAddItem: () => void
}

const StackInputForm = ({
  id,
  title,
  addItemTitle,
  amountOfItems,
  handleAddItem,
  maxElements = 5,
  width = '19.5rem',
  error,
  errorMessage,
  children
}: PropsWithChildren<StackInputFormProps>) => {
  const canAddNewItem = amountOfItems < maxElements

  return (
    <Grid container direction='column' style={{ marginBottom: '1rem' }}>
      <Typography variant='overline'>{title}</Typography>
      {children}
      {canAddNewItem && (
        <StackInputFormLayout container item direction='row' width={width}>
          <ListItem id={`add-${id}-button`} button onClick={handleAddItem} style={{ paddingLeft: 0 }}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant='body2' color={colors.blue}>
                  {addItemTitle}
                </Typography>
              }
            />
          </ListItem>
        </StackInputFormLayout>
      )}
      <ErrorMessage error={error} errorMessage={errorMessage} />
    </Grid>
  )
}

export default StackInputForm
