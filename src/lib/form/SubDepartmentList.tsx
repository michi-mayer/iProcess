import { Checkbox, Grid, MenuItem, Typography } from '@mui/material'
import { Department } from 'contexts/iProcessContext'
import { sortByName } from 'helper/sortData'
import { defined } from 'helper/utils'
import { colors } from 'theme'

interface SelectSubDepartmentListProps {
  departments: Department[] | undefined
  values: string[]
  onClickItem: (name: string, values: string[], subDepartmentId: string) => void
  name: string
}
const SubDepartmentList = ({ departments, values, onClickItem, name }: SelectSubDepartmentListProps) => {
  const handleClickItem = (value: string, subDepartmentId: string) => {
    if (values.includes(value)) {
      const filteredValues = values.filter((item) => value !== item)
      onClickItem(name, filteredValues, subDepartmentId)
    } else {
      onClickItem(name, [...values, value], subDepartmentId)
    }
  }
  return (
    <>
      {// eslint-disable-next-line array-callback-return
      sortByName(departments)?.map((subDepartment) => {
        if (values && subDepartment?.id) {
          return (
            <MenuItem
              key={subDepartment.id}
              value={subDepartment.id}
              style={{
                backgroundColor: values?.includes(subDepartment?.id) ? colors.bluegray : ''
              }}
              onClick={() =>
                handleClickItem(subDepartment.id, defined('subDepartmentId at SubDepartmentList', subDepartment.id))
              }
            >
              <Grid container direction='row' alignItems='center'>
                <Grid item xs={1} style={{ paddingTop: 2 }}>
                  <Checkbox
                    size='small'
                    color='primary'
                    checked={values?.indexOf(subDepartment?.id) > -1}
                    id={`menu-item-${subDepartment.id}`}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='caption' color='textSecondary' style={{ marginLeft: '1rem', width: '5rem' }}>
                    {subDepartment.id}
                  </Typography>
                </Grid>
              </Grid>
            </MenuItem>
          )
        }
      })}
    </>
  )
}

export default SubDepartmentList
