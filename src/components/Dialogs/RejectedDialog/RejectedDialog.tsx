import { memo } from 'react'
import { Bool } from 'API'
import { useIProcessState } from 'contexts/iProcessContext'
import { Rejected } from 'hooks/services/useQueryRejectedCount'
import RejectedFormWithNoQualityIssue from './RejectedFormWithNoQualityIssue'
import RejectedFormWithQualityIssue from './RejectedFormWithQualityIssue'

interface RejectedDialogProps {
  onClose: () => void
  openDialog: boolean
  rejected?: Rejected
}

const RejectedDialog = ({ onClose, openDialog, rejected }: RejectedDialogProps) => {
  const { productSelected: partSelected } = useIProcessState()

  switch (partSelected?.hasQualityIssueConfig) {
    case Bool[Bool.no]: {
      return <RejectedFormWithNoQualityIssue onClose={onClose} openDialog={openDialog} rejected={rejected} />
    }

    case Bool[Bool.yes]: {
      return <RejectedFormWithQualityIssue onClose={onClose} openDialog={openDialog} rejected={rejected} />
    }

    default:
      return <></>
  }
}

export default memo(RejectedDialog)
