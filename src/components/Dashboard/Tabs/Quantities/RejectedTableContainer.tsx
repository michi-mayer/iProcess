import { useTranslation } from 'react-i18next'
import { Collapse, Grid, TableCell, TableRow, Typography } from '@mui/material'
import { colors } from 'theme'
// Custom Components
import RejectedTable from './RejectedTable'

interface Props {
  isOpen: boolean
  setOpenTable: (value: boolean) => void
}

const RejectedTableContainer = ({ isOpen, setOpenTable }: Props) => {
  const { t } = useTranslation(['iProcess', 'admin'])

  return (
    <>
      <TableRow>
        <TableCell
          colSpan={12}
          padding='none'
          style={{
            borderBottom: 'none'
          }}
        >
          <Collapse in={isOpen} timeout='auto' unmountOnExit>
            <Grid container style={{ backgroundColor: colors.gray4, paddingTop: '1rem' }}>
              <Typography variant='h5' style={{ marginLeft: '42px' }}>
                {t('iProcess:nioDialog.reportedRejects')}
              </Typography>
              <RejectedTable
                firstColumnInfo='type'
                backgroundColor={colors.gray4}
                firstChildrenCell={<TableCell />}
                headerPadding='8px'
                onOpenTable={setOpenTable}
              />
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default RejectedTableContainer
