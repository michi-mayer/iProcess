import { ReactNode } from 'react'
import { To } from 'react-router-dom'
import { Container, Grid, Paper, Table, TableContainer } from '@mui/material'
import { styled } from '@mui/material/styles'
import { GroupUIAddButton } from 'lib/ui/Buttons'

export const FormContainer = styled(Paper)({
  marginTop: 0,
  width: '100%',
  margin: '1rem',
  padding: '1.5rem'
})

const CustomContainer = styled(Container)({
  maxWidth: '100%',
  marginTop: '1rem'
})

interface OldSectionContainerProps {
  onClick?: () => void
  to?: To
  buttonText: string
  children: ReactNode
  id: string
}

export const SectionContainer = ({ children, buttonText, onClick, to, id }: OldSectionContainerProps) => {
  return (
    <CustomContainer id={id}>
      <Grid container item xs={12} md={12} justifyContent='flex-end'>
        <GroupUIAddButton icon='add-24' onClick={onClick} id='section-add-button' to={to}>
          {buttonText}
        </GroupUIAddButton>
      </Grid>
      <Grid container item xs={12} md={12} style={{ marginTop: '1rem' }}>
        <TableContainer component={Paper} id='table-container'>
          <Table stickyHeader style={{ width: '100%' }} aria-label='sticky table' size='small'>
            {children}
          </Table>
        </TableContainer>
      </Grid>
    </CustomContainer>
  )
}
