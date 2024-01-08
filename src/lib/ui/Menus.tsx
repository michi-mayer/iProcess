import { MouseEvent, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, styled } from '@mui/material'
import { colors } from 'theme'

const MenuItemStyled = styled(MenuItem)({
  '&:hover': {
    background: `${colors.blueLightOpacity}`
  }
})

interface UpdateMenuProps {
  id: string
  onClickRemove: () => void
  onClickEdit: () => void
  editText: string
  removeText: string
}

export const UpdateMenu = ({ onClickRemove, onClickEdit, editText, removeText, id }: UpdateMenuProps) => {
  const [anchorElement, setAnchorElement] = useState<undefined | HTMLElement>(undefined)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorElement(undefined)
  }

  const handleClickEdit = () => {
    onClickEdit()
    handleClose()
  }

  return (
    <>
      <IconButton
        id={`template-settings-${id}`}
        aria-label='more'
        aria-controls='long-menu'
        aria-haspopup='true'
        onClick={handleClick}
        size='large'
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorElement}
        keepMounted
        open={Boolean(anchorElement)}
        onClose={handleClose}
        MenuListProps={{ style: { padding: 0, margin: 0 } }}
      >
        <MenuItemStyled id={`edit-button-${id}`} onClick={handleClickEdit}>
          <ListItemIcon>
            <EditIcon color='primary' />
          </ListItemIcon>
          <ListItemText>{editText}</ListItemText>
        </MenuItemStyled>
        <Divider style={{ margin: 0 }} />
        <MenuItemStyled id={`remove-button-${id}`} onClick={onClickRemove}>
          <ListItemIcon>
            <DeleteIcon color='primary' />
          </ListItemIcon>
          <ListItemText>{removeText}</ListItemText>
        </MenuItemStyled>
      </Menu>
    </>
  )
}
