import React, { useState } from 'react'
import './ProEdit.css'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useHistory } from 'react-router'

import { LinkEdit } from './LinkEdit'
import { ConfirmDelete } from './ConfirmDelete'

import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'
import { makeStyles } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined'
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined'
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

function Draggable_Item({
  item,
  index,
  setOpenCancel,
  handleSelectDeleteItem,
  setInputValues,
  setOpenLinkEdit,
  setEditingIndex,
  setShoppingLinkNumber,
}) {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          className="Draggable_Item"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="Draggable_Icon_Wrap">
            <MoreVertOutlinedIcon style={{ fontSize: 16 }} />
          </div>
          <div className="SlidingEdit_TypeLeft">
            <img
              src={item.productImageLink}
              style={{ height: '30px', width: '30px', objectFit: 'cover' }}
            />
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p className="Draggable_Link_Item_Content_2">{item.proLinkName}</p>

            <EditOutlinedIcon
              style={{ fontSize: 22, marginLeft: '0.5rem' }}
              onClick={() => {
                setEditingIndex(index)
                setInputValues({
                  proLink: item.proLink,
                  proLink2: item.proLink2,
                  proLink3: item.proLink3,
                  proLink4: item.proLink4,
                  proLink5: item.proLink5,
                  proLinkName: item.proLinkName,
                  tiktokVideoLink: item.tiktokVideoLink,
                  productImageLink: item.productImageLink,
                })

                if (item.proLink5) {
                  setShoppingLinkNumber(5)
                } else if (item.proLink4) {
                  setShoppingLinkNumber(4)
                } else if (item.proLink3) {
                  setShoppingLinkNumber(3)
                } else if (item.proLink2) {
                  setShoppingLinkNumber(2)
                }

                setOpenLinkEdit(true)
              }}
            />
            <DeleteOutlineOutlinedIcon
              style={{ fontSize: 22, marginLeft: '0.5rem' }}
              onClick={() => {
                handleSelectDeleteItem(index, item.proLinkName)
                setOpenCancel(true)
              }}
            />
          </div>
        </div>
      )}
    </Draggable>
  )
}

const DraggableList = React.memo(function DraggableList({
  items,
  setOpenCancel,
  handleSelectDeleteItem,
  setInputValues,
  setOpenLinkEdit,
  setEditingIndex,
  setShoppingLinkNumber,
}) {
  return items.map((item, index) => (
    <Draggable_Item
      item={item}
      index={index}
      key={item.id}
      setOpenCancel={setOpenCancel}
      handleSelectDeleteItem={handleSelectDeleteItem}
      setInputValues={setInputValues}
      setOpenLinkEdit={setOpenLinkEdit}
      setEditingIndex={setEditingIndex}
      setShoppingLinkNumber={setShoppingLinkNumber}
    />
  ))
})

const useStyles = makeStyles((theme) => ({
  dialog: {
    position: 'absolute',
    margin: 0,
    width: '104vw',
    minHeight: '100vh',
    zIndex: 5000,
    backgroundColor: 'white',
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '40ch',
    },
  },
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />
})

export const SlidingLinks = ({ openLinks, proLinks, setProLinks }) => {
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [openLinkEdit, setOpenLinkEdit] = useState(false)
  const handleLinkEditClose = () => {
    setOpenLinkEdit(false)
  }

  const [openCancel, setOpenCancel] = useState(false)
  const [inputValues, setInputValues] = useState({
    proLink: '',
    proLink2: '',
    proLink3: '',
    proLink4: '',
    proLink5: '',
    proLinkName: '',
    tiktokVideoLink: '',
    productImageLink: '',
  })
  const [editingIndex, setEditingIndex] = useState(false)
  const [shoppingLinkNumber, setShoppingLinkNumber] = useState(1)

  const [deleteIndex, setDeleteIndex] = useState('')
  const [deleteItem, setDeleteItem] = useState('')
  const handleSelectDeleteItem = (index, item) => {
    setDeleteIndex(index)
    setDeleteItem(item)
  }
  const handleDeleteItem = (index) => {
    let currentItems = [...proLinks['items']]
    currentItems.splice(index, 1)
    setProLinks({ items: currentItems })
  }

  function onDragEnd(result) {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const items = reorder(
      proLinks.items,
      result.source.index,
      result.destination.index,
    )

    setProLinks({ items })
  }

  return (
    <Dialog
      open={openLinks}
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      fullScreen={fullScreen}
    >
      <div className="SlidingEdit_Body">
        <div className="SlidingEdit_Header">
          <ArrowBackIosOutlinedIcon
            onClick={() => history.goBack()}
            style={{ paddingLeft: 14 }}
          />
          <span
            style={{
              fontSize: 14,
              position: 'absolute',
              fontWeight: 700,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            Product Links
          </span>
        </div>
        <div
          className="SlidingEdit_AddNewLink"
          onClick={() => {
            setEditingIndex(-1)
            setInputValues({
              proLink: '',
              proLink2: '',
              proLink3: '',
              proLink4: '',
              proLink5: '',
              proLinkName: '',
              tiktokVideoLink: '',
              productImageLink: '',
            })
            setOpenLinkEdit(true)
          }}
        >
          <div className="SlidingEdit_AddNewLinkDetails">
            <AddOutlinedIcon style={{ margin: 5 }} />
            <span>Add new link</span>
          </div>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <DraggableList
                  items={proLinks.items}
                  setOpenCancel={setOpenCancel}
                  handleSelectDeleteItem={handleSelectDeleteItem}
                  setInputValues={setInputValues}
                  setOpenLinkEdit={setOpenLinkEdit}
                  setEditingIndex={setEditingIndex}
                  setShoppingLinkNumber={setShoppingLinkNumber}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div style={{ height: '3rem' }}></div>
      </div>

      <ConfirmDelete
        openCancel={openCancel}
        setOpenCancel={setOpenCancel}
        deleteItem={deleteItem}
        deleteIndex={deleteIndex}
        handleDeleteItem={handleDeleteItem}
      />
      <LinkEdit
        inputValues={inputValues}
        setInputValues={setInputValues}
        openLinkEdit={openLinkEdit}
        setOpenLinkEdit={setOpenLinkEdit}
        handleLinkEditClose={handleLinkEditClose}
        linksState={proLinks}
        setlinksState={setProLinks}
        editingIndex={editingIndex}
        shoppingLinkNumber={shoppingLinkNumber}
        setShoppingLinkNumber={setShoppingLinkNumber}
      />
    </Dialog>
  )
}
