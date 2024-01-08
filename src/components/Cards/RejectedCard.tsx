import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import RejectedDialog from 'components/Dialogs/RejectedDialog/RejectedDialog'
import { useIProcessState } from 'contexts/iProcessContext'
import useDialogHandler from 'hooks/useDialogHandler'
import { UNIT_SPECIFIC_CYCLE_STATION } from 'shared'
import { colors } from 'theme'
import { DefaultCardTemplate } from './TemplateCard'

export const RejectedCard = memo(function RejectedCard() {
  const { open, handleClickOpen, handleClose } = useDialogHandler()
  const { t } = useTranslation('iProcess')
  const { cycleStationSelected } = useIProcessState()
  return (
    <>
      <DefaultCardTemplate
        id='rejected-card'
        onClick={handleClickOpen}
        backgroundColor={colors.bluegray}
        template={{
          description: t('disruptionList.nioDisruptionName'),
          id: 'nioDisruption',
          cycleStationId: cycleStationSelected?.id ? cycleStationSelected.id : UNIT_SPECIFIC_CYCLE_STATION.id,
          disLocation: '',
          disLocationSpecification: ''
        }}
      />
      <RejectedDialog onClose={handleClose} openDialog={open} />
    </>
  )
})
