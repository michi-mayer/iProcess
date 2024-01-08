import { CSSProperties, ForwardedRef, forwardRef, lazy, memo, Suspense, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardActionArea, CircularProgress, Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Template } from 'types'
import { breakWords } from './helper/breakWords'
import { useStoreDisruptionTemplates } from 'components/Dashboard/DisruptionDashboard'
import { useAuth } from 'contexts/authContext'
import { useIProcessState } from 'contexts/iProcessContext'
import { truncateText } from 'helper/truncateText'
import useMutateDeleteDisruptionTemplate from 'hooks/services/useMutateDeleteDisruption'
import useQueryDisruptionsByTemplateId from 'hooks/services/useQueryDisruptionsByTemplateId'
import useQueryRejectedCount from 'hooks/services/useQueryRejectedCount'
import useDialogHandler from 'hooks/useDialogHandler'
import { UpdateMenu } from 'lib/ui/Menus'
import { OTHER_DISRUPTIONS_TEMPLATE_ID } from 'shared/constants'
import { colors } from 'theme'

const TemplateDialog = lazy(() => import('components/Dialogs/DisruptionDialogs/TemplateDialog'))

const CardStyled = styled(Card)({
  height: '132px',
  width: '164px',
  margin: '12px'
})

interface ConditionalDisruptionRemoveDropDownProps {
  template: Template
  onClickEdit: () => void
}

const TemplateSettings = ({ template, onClickEdit }: ConditionalDisruptionRemoveDropDownProps) => {
  const { t } = useTranslation('iProcess')

  const { mutate: deleteDisruptionTemplate } = useMutateDeleteDisruptionTemplate('FetchTemplates')

  if (
    template?.description === t('disruptionList.nioDisruptionName') ||
    template?.description === t('disruptionDialog.genericDisruptionName')
  )
    return <></>

  return (
    <UpdateMenu
      id={template?.description}
      editText={t('disruptionList.editDisruption')}
      removeText={t('disruptionList.removeDisruption')}
      onClickEdit={onClickEdit}
      onClickRemove={() => deleteDisruptionTemplate(template)}
    />
  )
}

interface TemplateCardProps {
  template: Template
  onClick?: () => void
  backgroundColor?: string
  id?: string
  selectedTemplate?: Template
}

export const DefaultCardTemplate = memo(function DefaultCardTemplate({
  onClick,
  template,
  backgroundColor,
  id
}: TemplateCardProps) {
  const { t } = useTranslation('iProcess')
  const { data: genericDisruptions } = useQueryDisruptionsByTemplateId({
    templateId: OTHER_DISRUPTIONS_TEMPLATE_ID,
    filterByTeam: true
  })

  const { productSelected: partSelected, shiftTimeRange, shiftModelSelected } = useIProcessState()
  const [disruptionCount, setDisruptionCount] = useState<number | undefined>(0)
  const { data, isPending } = useQueryRejectedCount({
    startDateTime: shiftTimeRange?.workStartDateTime,
    endDateTime: shiftTimeRange?.workEndDateTime,
    isDisruptionCard: true,
    partId: partSelected.id
  })

  useEffect(() => {
    if (shiftTimeRange?.workStartDateTime) {
      const description = template?.description
      switch (description) {
        case t('disruptionList.nioDisruptionName'): {
          setDisruptionCount(data?.rejectedCount)
          break
        }

        case t('disruptionDialog.genericDisruptionName'): {
          setDisruptionCount(genericDisruptions.length)
          break
        }

        default:
          break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    genericDisruptions.length,
    data?.rejectedCount,
    partSelected.id,
    shiftModelSelected?.scheduleHours,
    t,
    template?.description,
    shiftTimeRange?.workStartDateTime
  ])

  return (
    <CardStyled key={template?.id} style={{ backgroundColor }}>
      <CardActionArea onClick={onClick} id={id}>
        <Grid container item direction='row' justifyContent='space-between' style={{ height: '140px' }}>
          <Grid container item xs={12}>
            <Grid item xs={12} style={{ padding: '16px' }}>
              <Typography variant='body1'>{template?.description}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ alignSelf: 'flex-end' }}>
            <Typography
              variant='body1'
              id='disruptioncard-body'
              style={{
                textAlign: 'right',
                marginBottom: '16px',
                marginRight: '16px',
                color: disruptionCount === 0 ? colors.gray2 : colors.black
              }}
            >
              {isPending ? <CircularProgress size={30} /> : disruptionCount}
            </Typography>
          </Grid>
        </Grid>
      </CardActionArea>
    </CardStyled>
  )
})

type OriginatorProps = { showOriginator?: boolean; updateCounter?: () => void }

const TemplateCard = forwardRef(
  (
    { template, backgroundColor, onClick, showOriginator = false, updateCounter }: TemplateCardProps & OriginatorProps,
    ref: ForwardedRef<HTMLSpanElement>
  ) => {
    const hasOriginatorInfo = !!template.originatorTeam?.id
    const { open, handleClickOpen, handleClose } = useDialogHandler()
    const { authInfo } = useAuth()
    const isAuthorized = authInfo?.roles.includes('Manager')
    const { cycleStationSelected } = useIProcessState()
    const [searchInput] = useStoreDisruptionTemplates((store) => store.searchInput)
    const isDisabled = !isAuthorized || !!searchInput || !!cycleStationSelected?.id
    const { isDragging, attributes, listeners, setNodeRef, transition, transform, setActivatorNodeRef } = useSortable({
      id: template?.id,
      disabled: isDisabled
    })
    const { data: disruptionsByTemplateId } = useQueryDisruptionsByTemplateId({
      templateId: template?.id
    })

    const style: CSSProperties = useMemo(
      () => ({
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? '0.3' : '1',
        transition,
        backgroundColor,
        cursor: !isDisabled ? (isDragging ? 'grabbing' : 'grab') : undefined,
        boxShadow: isDragging ? 'rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px' : undefined
      }),
      [backgroundColor, isDisabled, isDragging, transform, transition]
    )

    const maxTextLength = 25
    const maxWordLength = 15

    useEffect(() => {
      if (disruptionsByTemplateId.length > 0) {
        updateCounter?.()
      }
    }, [disruptionsByTemplateId.length, updateCounter])

    return (
      <>
        <CardStyled id='disruption-template-card' style={style} ref={setNodeRef} {...attributes}>
          <Grid
            container
            item
            direction='row'
            justifyContent='space-between'
            style={{ height: '140px' }}
            ref={setActivatorNodeRef}
            {...listeners}
          >
            <Grid container item xs={9} style={{ height: '100%' }}>
              <CardActionArea
                id={`disruption-template-card-action-area-${template?.description}`}
                onClick={onClick}
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '16px'
                }}
              >
                <Typography
                  variant='body1'
                  style={{
                    wordBreak: breakWords({
                      maxWordLength,
                      text: template?.description
                    })
                  }}
                >
                  {truncateText({ maxTextLength, text: template?.description })}
                </Typography>
                {showOriginator && <Typography variant='caption'>{template.originatorTeam?.name}</Typography>}
              </CardActionArea>
            </Grid>
            <Grid container item xs={3} alignContent='space-between'>
              <Grid item xs={12}>
                {authInfo?.roles.includes('Manager') && (
                  <TemplateSettings template={template} onClickEdit={handleClickOpen} />
                )}
              </Grid>
              <Grid item xs={12} style={{ height: '48px' }} />
              <Grid item xs={12}>
                <Typography
                  variant='body1'
                  id={`disruption-card-body-${template?.description}`}
                  ref={ref}
                  style={{
                    textAlign: 'right',
                    marginBottom: '16px',
                    marginRight: '16px',
                    color:
                      disruptionsByTemplateId?.length === 0
                        ? colors.gray2
                        : showOriginator
                        ? colors.redError
                        : colors.black
                  }}
                >
                  {/* Disruption Count */}
                  {disruptionsByTemplateId?.length ?? 0}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </CardStyled>
        {open && (
          <Suspense>
            <TemplateDialog
              onClose={handleClose}
              open={open}
              templateBaseData={template}
              showOriginators={hasOriginatorInfo}
            />
          </Suspense>
        )}
      </>
    )
  }
)

TemplateCard.displayName = 'TemplateCard'

export default memo(TemplateCard)
