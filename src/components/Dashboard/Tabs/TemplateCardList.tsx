import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DragOverlay, UniqueIdentifier } from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { Grid } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { isAssemblyLine, Template, TemplateBase } from 'types'
import { OnAddDisruptionSubscription, OnAddDisruptionSubscriptionVariables } from 'API'
import { RejectedCard } from 'components/Cards/RejectedCard'
import TemplateCard, { DefaultCardTemplate } from 'components/Cards/TemplateCard'
import DisruptionDialog from 'components/Dialogs/DisruptionDialogs/DisruptionDialog'
import { useAuth } from 'contexts/authContext'
import { useIProcessState } from 'contexts/iProcessContext'
import { onAddDisruption } from 'graphql/subscriptions'
import useSubscription from 'hooks/services/useSubscription'
import useDialogHandler from 'hooks/useDialogHandler'
import useFilterTemplates from 'hooks/useFilterTemplates'
import { DashedCardButton } from 'lib/ui/DashedCardButton'
import { OTHER_DISRUPTIONS_TEMPLATE_ID, UNIT_SPECIFIC_CYCLE_STATION } from 'shared/constants'
import { colors } from 'theme'
import { useStoreDisruptionTemplates } from '../DisruptionDashboard'

const TemplateDialog = lazy(() => import('components/Dialogs/DisruptionDialogs/TemplateDialog'))
interface Props {
  activeId: UniqueIdentifier | undefined
}

const TemplateCardList = ({ activeId }: Props) => {
  const { t } = useTranslation('iProcess')
  const { unitSelected, shiftTimeRange, cycleStationSelected } = useIProcessState()

  const [{ templates, searchInput, clickedOption }] = useStoreDisruptionTemplates((store) => store)

  const filteredTemplates = useFilterTemplates(searchInput, templates, clickedOption)

  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>()
  const genericTemplate: TemplateBase = {
    description: t('disruptionDialog.genericDisruptionName'),
    id: OTHER_DISRUPTIONS_TEMPLATE_ID,
    cycleStationId: cycleStationSelected?.id ? cycleStationSelected.id : UNIT_SPECIFIC_CYCLE_STATION.id,
    disLocation: '',
    disLocationSpecification: ''
  }
  const { open, handleClickOpen, handleClose } = useDialogHandler()
  const { authInfo } = useAuth()
  const queryClient = useQueryClient()

  const forwardCallbackUpdate = useCallback(
    ({ onAddDisruption }: OnAddDisruptionSubscription) => {
      if (onAddDisruption) {
        const { templateId, partId, unitId, cycleStationId } = onAddDisruption
        queryClient.invalidateQueries({
          queryKey: [
            'FetchDisruptionsByTemplateId',
            {
              partSelected: partId,
              unitSelected: unitId,
              dateTimeStartUTC: shiftTimeRange?.dateTimeStartUTC,
              dateTimeEndUTC: shiftTimeRange?.dateTimeEndUTC,
              templateId,
              cycleStationId
            }
          ]
        })
      }
    },
    [queryClient, shiftTimeRange?.dateTimeStartUTC, shiftTimeRange?.dateTimeEndUTC]
  )

  const getSubscriptionVariables = useCallback((): OnAddDisruptionSubscriptionVariables | undefined => {
    if (unitSelected?.id) {
      return { unitId: unitSelected.id }
    }
  }, [unitSelected?.id])

  useSubscription(onAddDisruption, forwardCallbackUpdate, getSubscriptionVariables())

  const handleClick = (template: Template) => {
    setSelectedTemplate(template)
    handleClickOpen()
  }

  const handleClickClose = () => {
    handleClose()
    setSelectedTemplate(undefined)
  }

  useEffect(() => {
    if (!open) {
      setSelectedTemplate(undefined)
    }
  }, [open])

  const activeTemplate = templates.find((_) => _.id === activeId)

  return (
    <>
      <SortableContext items={templates} strategy={rectSortingStrategy}>
        <Grid container item spacing={0} padding='0rem 0.4rem 0rem'>
          {!isAssemblyLine(unitSelected) && <RejectedCard />}
          {filteredTemplates?.map((template, i) => {
            return (
              <TemplateCard
                key={template.id ?? `index-${i}`}
                template={template}
                onClick={() => handleClick(template)}
              />
            )
          })}
          <DefaultCardTemplate
            onClick={() => handleClick(genericTemplate)}
            id='generic-disruption-card'
            backgroundColor={colors.white}
            template={genericTemplate}
          />
          {authInfo?.roles.includes('Manager') && (
            <Grid item>
              <DashedCardButton
                id='disruption-add-card'
                dialogComponent={(onClose, open) =>
                  open && (
                    <Suspense>
                      <TemplateDialog onClose={onClose} open={open} />
                    </Suspense>
                  )
                }
              />
            </Grid>
          )}
        </Grid>
        {open && !!selectedTemplate && (
          <DisruptionDialog
            onClose={handleClickClose}
            open={open}
            isUpdatingDisruption={false}
            disruption={{
              ...selectedTemplate,
              isSolved: true
            }}
          />
        )}
      </SortableContext>
      <DragOverlay adjustScale style={{ transformOrigin: '0 0 ' }}>
        {!!activeId && !!activeTemplate && <TemplateCard template={activeTemplate} />}
      </DragOverlay>
    </>
  )
}

export default TemplateCardList
