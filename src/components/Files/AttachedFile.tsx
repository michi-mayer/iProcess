import { useTranslation } from 'react-i18next'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import { Button, Grid, IconButton, Link, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import moment from 'moment-timezone'
import { AttachmentInput } from 'API'
import GenericFileIcon from 'components/Icons/GenericFileIcon'
import useQueryFile from 'hooks/services/useQueryFile'
import { formatBytes } from 'lib/form/helper/getFileSize'
import { colors } from 'theme'
import DownloadIcon from '../Icons/DownloadIcon'

const StyledGrid = styled(Grid)({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center'
})

const deletedStyle = { color: colors.gray2, textDecoration: 'line-through' } as const

interface DownloadLabelProps {
  downloadText: string
  disabled?: boolean
}

const DownloadLabel = ({ downloadText, disabled }: DownloadLabelProps) => (
  <>
    <DownloadIcon color={disabled ? colors.gray2 : undefined} />
    <Typography variant='button' color={disabled ? colors.gray2 : 'inherit'} fontSize='0.875rem'>
      {downloadText}
    </Typography>
  </>
)

interface Props {
  attachment: AttachmentInput
  isDeleted?: boolean
  disabled?: boolean
  onClickAction?: () => void
}

const AttachedFile = ({ attachment, onClickAction, isDeleted, disabled }: Props) => {
  const { data } = useQueryFile(attachment.key)
  const { t } = useTranslation('measures')
  const style = isDeleted ? deletedStyle : undefined

  const timeUploaded = moment(attachment.createdAt).calendar()
  const timeUploadedFormatted = timeUploaded.charAt(0).toUpperCase() + timeUploaded.slice(1)

  return (
    <Grid container style={{ marginBottom: '0.75rem' }}>
      <StyledGrid item xs={4}>
        <GenericFileIcon color={isDeleted ? colors.gray2 : undefined} />
        <Typography variant='body2' style={style}>
          {attachment.key.split('#')[3]}
        </Typography>
      </StyledGrid>
      <StyledGrid item xs={4}>
        <Typography variant='body2' style={style}>
          {`${timeUploadedFormatted} ${t('attachements.by')} ${attachment.uploadedBy}`}
        </Typography>
      </StyledGrid>
      <StyledGrid item xs={1} style={{ justifyContent: 'right' }}>
        <Typography variant='body2' style={style}>
          {formatBytes(attachment.size)}
        </Typography>
      </StyledGrid>
      {!isDeleted && (
        <StyledGrid item xs={2} style={{ justifyContent: 'right' }} id='download-file'>
          {disabled ? (
            <DownloadLabel disabled downloadText={t('disruptionDetails.download')} />
          ) : (
            <Link href={data} target='_blank' style={{ display: 'flex' }} underline='hover'>
              <DownloadLabel downloadText={t('disruptionDetails.download')} />
            </Link>
          )}
        </StyledGrid>
      )}
      <StyledGrid item xs={isDeleted ? 3 : 1} style={{ justifyContent: 'center' }}>
        {isDeleted ? (
          <Button style={{ margin: 0, padding: 0 }} size='small' disabled={disabled} onClick={onClickAction}>
            <Typography variant='button' fontSize='0.875rem'>
              {t('disruptionDetails.restore')}
            </Typography>
          </Button>
        ) : (
          <IconButton style={{ margin: 0, padding: 0 }} size='small' disabled={disabled} onClick={onClickAction}>
            <DeleteIcon color={disabled ? 'disabled' : 'primary'} fontSize='small' />
          </IconButton>
        )}
      </StyledGrid>
    </Grid>
  )
}

export default AttachedFile
