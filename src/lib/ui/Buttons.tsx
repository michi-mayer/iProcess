import { CSSProperties, FC, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, LinkProps, To } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react-core'
import { GroupuiButton } from '@group-ui/group-ui-react'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Box, Button, ButtonProps, CircularProgress, Grid, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import AddIcon from 'components/Icons/AddIcon'
import { colors } from 'theme'

export const DiscardButton = styled(Button)<LinkProps | ButtonProps>({
  textDecoration: 'underline',
  color: colors.gray2
})

export const CreateButton = styled(Button)<LinkProps | ButtonProps>({
  borderRadius: '4rem',
  backgroundColor: colors.white,
  paddingTop: 10,
  paddingBottom: 10
})

type GroupUIAddButtonProps = Parameters<typeof GroupuiButton>[0] & { to?: To }

export const GroupUIAddButton = ({ children, to, ...props }: PropsWithChildren<GroupUIAddButtonProps>) => (
  <Box sx={{ position: 'relative', display: 'inline-block' }}>
    {to ? (
      <Link to={to}>
        <GroupuiButton {...props} type='button' size='m'>
          {children}
        </GroupuiButton>
      </Link>
    ) : (
      <GroupuiButton {...props} type='button' size='m'>
        {children}
      </GroupuiButton>
    )}
  </Box>
)

const BaseButton = styled(Button)({
  textDecoration: 'none',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  paddingLeft: '50px',
  paddingRight: '50px'
})

export const WideButton = styled(Button)({
  padding: '0.5rem 1rem'
})

export const SubmitButton = styled(BaseButton)({
  padding: '2px 19px',
  fontSize: '1rem',
  color: colors.white,
  backgroundColor: colors.blue,
  '&:hover': {
    backgroundColor: colors.babyblue
  },
  '&:disabled': {
    backgroundColor: colors.disabled
  }
})

export const WideSubmitButton = styled(SubmitButton)({
  padding: '0.55rem 1rem'
})

interface AddButtonProps {
  onClick: () => void
  id: string
  text: string
  disabled?: boolean
  style?: CSSProperties
}

type GroupUILayoutProps = Parameters<typeof Grid>[0]

export const GroupUILayout = ({ children, ...props }: PropsWithChildren<GroupUILayoutProps>) => (
  <Grid
    {...props}
    container
    item
    xs={12}
    direction='row'
    justifyContent='end'
    gap={'16px'}
    style={{ marginTop: '40px' }}
  >
    {children}
  </Grid>
)

type GroupUIButtonProps = Parameters<typeof GroupuiButton>[0]

export const GroupUIButton = ({ children, ...props }: PropsWithChildren<GroupUIButtonProps>) => (
  <Box sx={{ position: 'relative', display: 'inline-block' }}>
    <GroupuiButton {...props} type='button' size='m'>
      {children}
    </GroupuiButton>
  </Box>
)

export const GroupUIDiscardButton = ({ children, ...props }: PropsWithChildren<GroupUIButtonProps>) => (
  <Box sx={{ position: 'relative', display: 'inline-block' }}>
    <GroupuiButton {...props} type='button' size='m' variant={'secondary'}>
      {children}
    </GroupuiButton>
  </Box>
)

type GroupUISubmitButtonProps = GroupUIButtonProps & {
  isLoading?: boolean
}

export const GroupUISubmitButton = ({ children, isLoading, ...props }: PropsWithChildren<GroupUISubmitButtonProps>) => (
  <Box sx={{ position: 'relative', display: 'inline-block' }}>
    <GroupuiButton disabled={isLoading} type='submit' {...props}>
      {children}
    </GroupuiButton>
    {isLoading && (
      <CircularProgress
        size={24}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '25px',
          marginTop: '-12px', // * half of the spinner size
          marginLeft: '-12px' // * half of the spinner size
        }}
      />
    )}
  </Box>
)

export const GroupUISignOutButton = () => {
  const { t } = useTranslation('iProcess')
  const { signOut } = useAuthenticator((context) => [context.user])
  return (
    <GroupuiButton id='logout-button' onClick={signOut}>
      <Typography variant='button' color='inherit' style={{ textTransform: 'uppercase' }}>
        {t('header.logout')}
      </Typography>
    </GroupuiButton>
  )
}

export const AddButton = ({ onClick, id, text, disabled, style }: AddButtonProps) => {
  return (
    <Button
      variant='text'
      style={{ textDecoration: 'underline', padding: 0, marginTop: '1rem', ...style }}
      startIcon={<AddIcon fill={disabled ? colors.gray2 : colors.blue} height={24} width={24} />}
      onClick={onClick}
      disabled={disabled}
      id={id}
    >
      {text}
    </Button>
  )
}

export const StyledAmplifySignOutButton = () => {
  const { t } = useTranslation('iProcess')
  const { signOut } = useAuthenticator((context) => [context.user])
  return (
    <SubmitButton onClick={signOut} id='logout-button'>
      <Typography variant='button' color='inherit' style={{ textTransform: 'uppercase' }}>
        {t('header.logout')}
      </Typography>
    </SubmitButton>
  )
}

interface ActionProps {
  editButtonId?: string
  deleteButtonId?: string
  onClickEdit?: () => void
  editTo?: To
  deleteTo?: To
  onClickDelete?: () => void
  onMouseOverEdit?: () => void
  size?: 'small' | 'large' | 'medium'
  childrenPosition?: 'left' | 'right'
}

export const ActionButtons: FC<PropsWithChildren<ActionProps>> = ({
  onClickEdit,
  onClickDelete,
  onMouseOverEdit,
  editButtonId,
  deleteButtonId,
  size = 'large',
  children,
  childrenPosition = 'left'
}) => {
  return (
    <Box>
      {children && childrenPosition === 'left' ? children : undefined}
      <IconButton onClick={onClickEdit} onMouseOver={onMouseOverEdit} id={editButtonId} size={size}>
        <EditIcon color='primary' />
      </IconButton>
      <IconButton LinkComponent={Link} onClick={onClickDelete} id={deleteButtonId} size={size}>
        <DeleteIcon color='primary' />
      </IconButton>
      {children && childrenPosition === 'right' ? children : undefined}
    </Box>
  )
}
