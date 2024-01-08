import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid, Stack, Typography } from '@mui/material'
import { Disruption } from 'types'
import CustomDialog from 'components/Dialogs/CustomDialog'
import DisruptionDialogHeaderInfo from 'components/Dialogs/DisruptionDialogs/DisruptionDialogHeaderInfo'
import AttachedFile from 'components/Files/AttachedFile'
import LabelWithHeader from 'components/Labels/LabelWithHeader'
import { DialogDivider } from 'components/styled'
import SwitchToggle from 'lib/form/SwitchToggle'
import { GroupUIDiscardButton, GroupUILayout, GroupUISubmitButton } from 'lib/ui/Buttons'
import { getDateAndTime } from 'shared'
import { dayjs } from 'shared/datetime'

interface ReportedDisruptionsViewDialogProps {
  open: boolean
  disruption: Disruption | undefined
  onClose: () => void
  onClick: (_: Disruption | undefined) => void
}

const ReportedDisruptionsViewDialog = ({ disruption, open, onClose, onClick }: ReportedDisruptionsViewDialogProps) => {
  const { t } = useTranslation(['iProcess', 'measures', 'tables'])

  const issues = disruption?.issues?.map((_) => _.name).join(', ')
  const hasFiles = disruption?.attachments && disruption?.attachments.length > 0

  const { date, time } = useMemo(() => {
    const { date, time } = getDateAndTime(dayjs(disruption?.startTimeDate))
    return { date: date.replaceAll('-', '.'), time: time.slice(0, 5) }
  }, [disruption?.startTimeDate])

  return (
    <CustomDialog
      onClose={onClose}
      open={open}
      maxWidth={false}
      title={disruption?.description}
      dialogContentStyle={{ width: '790px' }}
    >
      <Grid container>
        <Stack style={{ flex: 1 }}>
          <DisruptionDialogHeaderInfo
            disruption={disruption}
            showTeamsInfo
            showCycleStationInfo={!disruption?.originatorTeam?.id}
            classifications={{
              category: disruption?.disLocation,
              cause: disruption?.disLocationSpecification,
              type: disruption?.disLocationType
            }}
            xs={{
              unit: 2,
              cycleStation: 3,
              product: 3,
              classifications: 4,
              teams: 2
            }}
          />
          <DialogDivider variant='middle' />
          <Grid container rowSpacing={2} columnSpacing={2}>
            <LabelWithHeader xs={4} title={t('iProcess:disruptionDialog.start')} content={`${date}, ${time}`} />
            <LabelWithHeader
              xs={4}
              title={t('iProcess:disruptionReview.quantityLoss')}
              content={`${disruption?.lostVehicles}`}
            />
            <LabelWithHeader
              xs={4}
              title={t('iProcess:disruptionReview.disruptionsReportedTableHeaderDuration')}
              content={`${disruption?.duration}`}
            />
            <LabelWithHeader
              xs={disruption?.m100 && issues ? 4 : disruption?.m100 || issues ? 8 : 12}
              title={t('iProcess:disruptionDialog.rightMeasuresHeaderShort')}
              content={`${disruption?.measures}`}
            />
            {issues && (
              <LabelWithHeader xs={4} title={t('iProcess:disruptionDialog.issueSpecification')} content={issues} />
            )}
            {disruption?.m100 && (
              <LabelWithHeader xs={4} title={t('iProcess:disruptionReview.m100Title')} content={`${disruption.m100}`} />
            )}
          </Grid>

          <DialogDivider variant='middle' />
          <Grid item>
            <Typography variant='h4'>{t('iProcess:disruptionDialog.addPhotos')}</Typography>
            <Grid item xs={12}>
              <Typography variant='subtitle1' style={{ fontWeight: 'bold', marginTop: '8px', marginBottom: '4px' }}>
                {t(`measures:disruptionDetails.${hasFiles ? 'attachments' : 'missingAttachments'}`)}
              </Typography>
              {hasFiles && (
                <Stack style={{ height: '100%', width: '100%', zIndex: 1, marginTop: '12px' }}>
                  {disruption?.attachments?.map((attachment) => (
                    <AttachedFile key={attachment.key} attachment={attachment} disabled={true} />
                  ))}
                </Stack>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ marginTop: '36px' }}>
            <Typography variant='h4' style={{ marginBottom: '8px' }}>
              {t('tables:status')}
            </Typography>
            <SwitchToggle
              name='isSolved'
              checked={disruption?.isSolved}
              disabled
              text={
                disruption?.isSolved ? t('iProcess:disruptionDialog.solved') : t('iProcess:disruptionDialog.notSolved')
              }
            />
          </Grid>
        </Stack>
        <GroupUILayout>
          <GroupUIDiscardButton onClick={onClose} id='discard-button-disruption-useTemplate'>
            {t('iProcess:buttons.cancel')}
          </GroupUIDiscardButton>
          <GroupUISubmitButton
            id='disruption-usetemplate-dialog-submit'
            icon='pencil-24'
            onClick={() => onClick(disruption)}
          >
            {t('iProcess:buttons.edit')}
          </GroupUISubmitButton>
        </GroupUILayout>
      </Grid>
    </CustomDialog>
  )
}

export default ReportedDisruptionsViewDialog
