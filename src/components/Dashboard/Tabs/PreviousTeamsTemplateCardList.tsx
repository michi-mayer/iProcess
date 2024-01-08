import { lazy, Suspense, useEffect, useState } from 'react'
import { DragOverlay, UniqueIdentifier } from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { Grid, Stack } from '@mui/material'
import { sortBy } from 'remeda'
import { TemplateBaseWithOriginator } from 'types'
import { TemplateBaseWithTeamInfoSchema } from 'zodSchemas'
import TemplateCard from 'components/Cards/TemplateCard'
import DisruptionDialog from 'components/Dialogs/DisruptionDialogs/DisruptionDialog'
import useDialogHandler from 'hooks/useDialogHandler'
import useFilterTemplates from 'hooks/useFilterTemplates'
import useForceUpdate from 'hooks/useForceUpdate'
import usePreviousOriginatorTeamTemplates from 'hooks/usePreviousOriginatorTeamTemplates'
import { DashedCardButton } from 'lib/ui/DashedCardButton'
import { conditionallySortArray } from 'shared'
import { useStoreDisruptionTemplates } from '../DisruptionDashboard'
import PreviousTeamsFilterGroup from './PreviousTeamsFilterGroup'

const TemplateDialog = lazy(() => import('components/Dialogs/DisruptionDialogs/TemplateDialog'))

interface Props {
  currentTab: number
  activeId: UniqueIdentifier | undefined
}

const PreviousTeamsTemplateCardList = ({ currentTab, activeId }: Props) => {
  const forceUpdate = useForceUpdate()
  const { previousOriginatorTeamTemplates, templateRefs } = usePreviousOriginatorTeamTemplates()

  const [{ previousTeamTemplates, clickedOption, searchInput }, setDisruptionStore] = useStoreDisruptionTemplates(
    (store) => store
  )

  const { open, handleClickOpen, handleClose } = useDialogHandler()

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateBaseWithOriginator | undefined>()

  const filteredPreviousTeamTemplates = useFilterTemplates(searchInput, previousTeamTemplates, clickedOption)

  const activeTemplate = previousTeamTemplates.find((_) => _.id === activeId)

  const handleClick = (template: TemplateBaseWithOriginator) => {
    setSelectedTemplate(template)
    handleClickOpen()
  }

  const handleClickClose = () => {
    handleClose()
    setSelectedTemplate(undefined)
  }

  useEffect(() => {
    forceUpdate()
  }, [currentTab, forceUpdate, previousOriginatorTeamTemplates])

  useEffect(() => {
    if (previousOriginatorTeamTemplates) {
      setDisruptionStore({
        previousTeamTemplates: conditionallySortArray(
          TemplateBaseWithTeamInfoSchema,
          previousOriginatorTeamTemplates,
          (_) => sortBy(_, (_) => _.description.toLowerCase())
        )
      })
    }
  }, [previousOriginatorTeamTemplates, setDisruptionStore])

  return (
    <Stack>
      <PreviousTeamsFilterGroup templateRefs={templateRefs} />
      <div style={{ paddingLeft: '0.5rem' }}>
        <SortableContext items={previousTeamTemplates} strategy={rectSortingStrategy}>
          <Grid container item spacing={0}>
            {filteredPreviousTeamTemplates?.map((template, i) => (
              <TemplateCard
                key={template.id ?? `index-${i}`}
                template={template}
                onClick={() => handleClick(template)}
                showOriginator
                ref={templateRefs[i]}
                updateCounter={forceUpdate}
              />
            ))}
            <DashedCardButton
              label='QRK'
              id='QRK-add-template'
              dialogComponent={(onClose, open) =>
                open && (
                  <Suspense>
                    <TemplateDialog onClose={onClose} open={open} showOriginators />
                  </Suspense>
                )
              }
            />
          </Grid>
          {open && !!selectedTemplate && (
            <DisruptionDialog
              onClose={handleClickClose}
              open={open}
              isUpdatingDisruption={false}
              disruption={{ ...selectedTemplate, isSolved: true }}
            />
          )}
        </SortableContext>
        <DragOverlay adjustScale style={{ transformOrigin: '0 0 ' }}>
          {!!activeId && !!activeTemplate && <TemplateCard template={activeTemplate} />}
        </DragOverlay>
      </div>
    </Stack>
  )
}

export default PreviousTeamsTemplateCardList
