import { CSSProperties, useCallback, useEffect, useState } from 'react'
import { Card, TableRow } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useQueryClient } from '@tanstack/react-query'
import { Disruption, DisruptionWithTemplateData } from 'types'
import { OnAddDisruptionSubscription, OnAddDisruptionSubscriptionVariables } from 'API'
import DisruptionDialog from 'components/Dialogs/DisruptionDialogs/DisruptionDialog'
import SimpleTable, { SimpleTableProps } from 'components/Tables/SimpleTable'
import { useIProcessState } from 'contexts/iProcessContext'
import { onAddDisruption } from 'graphql/subscriptions'
import { getTimeTabRange } from 'helper/utils'
import useQueryDisruptionsByTime, {
  FetchDisruptionsByTimeProps,
  UseQueryDisruptionsByTimeProps
} from 'hooks/services/useQueryDisruptionsByTime'
import useSubscription from 'hooks/services/useSubscription'
import useCycleStations, { UseCycleStationsReturn } from 'hooks/useCycleStations'
import { NullableRecord } from 'shared'
import { colors } from 'theme'
import ReportedDisruptionsDeleteDialog from './ReportedDisruptionsDeleteDialog'
import ReportedDisruptionsViewDialog from './ReportedDisruptionsViewDialog'

export const TableCardStyled = styled(Card)({
  maxginLeft: '0px',
  boxShadow: 'none',
  height: '100%',
  overflow: 'hidden',
  padding: '1rem'
})

export const borderLineBox: CSSProperties = {
  borderTop: `0.1px solid ${colors.gray3}`,
  borderLeft: `0.1px solid ${colors.gray3}`,
  borderRight: `0.1px solid ${colors.gray3}`
}

interface UseSubscribeDisruptionsProps extends UseQueryDisruptionsByTimeProps {}

const useSubscribeDisruptions = ({
  dateTimeStartUTC,
  dateTimeEndUTC,
  originator,
  reporter
}: UseSubscribeDisruptionsProps) => {
  const { unitSelected } = useIProcessState()
  const queryClient = useQueryClient()

  const forwardCallbackUpdate = useCallback(
    ({ onAddDisruption }: OnAddDisruptionSubscription) => {
      if (onAddDisruption) {
        const { partId, unitId, cycleStationId } = onAddDisruption
        queryClient.invalidateQueries({
          queryKey: [
            'FetchDisruptionsByTime',
            {
              unitId,
              partId,
              originator,
              reporter,
              startUTC: dateTimeStartUTC,
              endUTC: dateTimeEndUTC,
              cycleStationId
            } satisfies NullableRecord<FetchDisruptionsByTimeProps>
          ]
        })
      }
    },
    [queryClient, originator, reporter, dateTimeStartUTC, dateTimeEndUTC]
  )

  const getSubscriptionVariables = useCallback((): OnAddDisruptionSubscriptionVariables | undefined => {
    if (unitSelected?.id) {
      return { unitId: unitSelected.id }
    }
  }, [unitSelected?.id])

  useSubscription(onAddDisruption, forwardCallbackUpdate, getSubscriptionVariables())
}

const useReportedDisruptionsDialogs = () => {
  const [disruptionSelected, setDisruptionSelected] = useState<undefined | Disruption>()
  const [{ openDeleteDialog, openEditDialog, openViewDialog }, setState] = useState({
    openViewDialog: false,
    openEditDialog: false,
    openDeleteDialog: false
  })

  const handleClickEdit = (disruption?: Disruption) => {
    setDisruptionSelected(disruption)
    setState((previousState) => ({ ...previousState, openViewDialog: false, openEditDialog: true }))
  }

  const handleClickDelete = (disruption?: Disruption) => {
    setDisruptionSelected(disruption)
    setState((previousState) => ({ ...previousState, openDeleteDialog: true }))
  }

  const handleClickView = (disruption?: Disruption) => {
    setDisruptionSelected(disruption)
    setState((previousState) => ({ ...previousState, openViewDialog: true }))
  }

  const handleClose = () => {
    setState({ openDeleteDialog: false, openEditDialog: false, openViewDialog: false })
  }

  useEffect(() => {
    if (!openDeleteDialog && !openEditDialog && !openViewDialog) {
      setDisruptionSelected(undefined)
    }
  }, [openDeleteDialog, openEditDialog, openViewDialog])

  return {
    openDeleteDialog,
    openEditDialog,
    openViewDialog,
    handleClose,
    handleClickView,
    handleClickEdit,
    handleClickDelete,
    disruptionSelected
  }
}

export interface ReportedDisruptionsTableRowProps {
  index: number
  disruption: DisruptionWithTemplateData
  cycleStations: UseCycleStationsReturn
  style?: CSSProperties
  onClickEdit: (disruption: DisruptionWithTemplateData) => void
  onClickView: (disruption: DisruptionWithTemplateData) => void
  onClickDelete: (disruption: DisruptionWithTemplateData) => void
}

interface ReportedDisruptionsTableProps
  extends Pick<SimpleTableProps<DisruptionWithTemplateData>, 'headers' | 'tableStyle'>,
    Pick<UseQueryDisruptionsByTimeProps, 'originator' | 'reporter' | 'cycleStationId'> {
  renderTableRow: (_: ReportedDisruptionsTableRowProps) => ReturnType<typeof TableRow>
}

const ReportedDisruptionsTable = ({
  headers,
  renderTableRow,
  tableStyle,
  ...queryProps
}: ReportedDisruptionsTableProps) => {
  const {
    openDeleteDialog,
    openEditDialog,
    openViewDialog,
    disruptionSelected,
    handleClickEdit,
    handleClose,
    handleClickDelete,
    handleClickView
  } = useReportedDisruptionsDialogs()
  const { currentShiftScheduleSlots, selectedShiftTab } = useIProcessState()
  const cycleStations = useCycleStations()
  const dateTimeRange = getTimeTabRange(currentShiftScheduleSlots, selectedShiftTab)

  useSubscribeDisruptions({ ...queryProps, ...dateTimeRange })
  const { data } = useQueryDisruptionsByTime({ ...queryProps, ...dateTimeRange })

  return (
    <SimpleTable
      hasActionButtons
      headers={headers}
      data={data}
      renderTableRow={(disruption, index) =>
        renderTableRow({
          disruption,
          index,
          cycleStations,
          style: { borderBottom: data?.length === index ? 'none' : undefined },
          onClickDelete: handleClickDelete,
          onClickEdit: handleClickEdit,
          onClickView: handleClickView
        })
      }
      ariaLabel='review-table'
      tableStyle={tableStyle}
    >
      <DisruptionDialog
        open={openEditDialog}
        onClose={handleClose}
        disruption={disruptionSelected}
        isUpdatingDisruption={true}
      />
      <ReportedDisruptionsViewDialog
        open={openViewDialog}
        onClose={handleClose}
        onClick={handleClickEdit}
        disruption={disruptionSelected}
      />
      <ReportedDisruptionsDeleteDialog
        open={openDeleteDialog}
        handleClose={handleClose}
        disruptionSelected={disruptionSelected}
      />
    </SimpleTable>
  )
}

export default ReportedDisruptionsTable
