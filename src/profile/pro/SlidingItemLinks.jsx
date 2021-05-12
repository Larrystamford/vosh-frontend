import React, { useState, useEffect } from "react";
import "./ProEdit.css";
import { useGlobalState } from "../../GlobalStates";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useHistory } from "react-router";

import { LinkItemEdit } from "./LinkItemEdit";
import { LinkPrevious } from "./LinkPrevious";
import { ConfirmDelete } from "./ConfirmDelete";

import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import { Divider, makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import PlaylistAddOutlinedIcon from "@material-ui/icons/PlaylistAddOutlined";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function Draggable_Item({
  item,
  index,
  setOpenCancel,
  handleSelectDeleteItem,
  setInputValues,
  setOpenLinkEdit,
  setEditingIndex,
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
          <div className="SlidingEdit_TypeLeft"></div>
          <div className="SlidingEdit_TypeAndIcon">
            <p className="Draggable_Link_Item_Content_2">{item.itemLinkName}</p>

            <EditOutlinedIcon
              style={{ fontSize: 22, marginLeft: "0.5rem" }}
              onClick={() => {
                setEditingIndex(index);
                setInputValues({
                  itemLink: item.itemLink,
                  itemLinkName: item.itemLinkName,
                });
                setOpenLinkEdit(true);
              }}
            />
            <DeleteOutlineOutlinedIcon
              style={{ fontSize: 22, marginLeft: "0.5rem" }}
              onClick={() => {
                handleSelectDeleteItem(index, item.itemLinkName);
                setOpenCancel(true);
              }}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
}

const DraggableList = React.memo(function DraggableList({
  items,
  setOpenCancel,
  handleSelectDeleteItem,
  setInputValues,
  setOpenLinkEdit,
  setEditingIndex,
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
    />
  ));
});

const useStyles = makeStyles((theme) => ({
  dialog: {
    position: "absolute",
    margin: 0,
    width: "104vw",
    minHeight: "100vh",
    zIndex: 5000,
    backgroundColor: "white",
  },
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "40ch",
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export const SlidingItemLinks = ({
  openItemLinks,
  itemLinks,
  setItemLinks,
  previousLinks,
  setPreviousLinks,
}) => {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [openLinkEdit, setOpenLinkEdit] = useState(false);
  const handleLinkEditClose = () => {
    setOpenLinkEdit(false);
  };

  const [openLinkPrevious, setOpenLinkPrevious] = useState(false);

  const [affiliateGroupName, setAffiliateGroupName] = useState(
    "Product Links!"
  );

  const [openCancel, setOpenCancel] = useState(false);
  const [inputValues, setInputValues] = useState({
    itemLink: "",
    itemLinkName: "",
  });
  const [editingIndex, setEditingIndex] = useState(false);

  const [deleteIndex, setDeleteIndex] = useState("");
  const [deleteItem, setDeleteItem] = useState("");
  const handleSelectDeleteItem = (index, item) => {
    setDeleteIndex(index);
    setDeleteItem(item);
  };
  const handleDeleteItem = (index) => {
    let currentItems = [...itemLinks["items"]];
    currentItems.splice(index, 1);
    setItemLinks({ items: currentItems });
  };

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const items = reorder(
      itemLinks.items,
      result.source.index,
      result.destination.index
    );

    setItemLinks({ items });
  }

  return (
    <Dialog
      open={openItemLinks}
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
              position: "absolute",
              fontWeight: 700,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            Product Linking
          </span>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <DraggableList
                  items={itemLinks.items}
                  setOpenCancel={setOpenCancel}
                  handleSelectDeleteItem={handleSelectDeleteItem}
                  setInputValues={setInputValues}
                  setOpenLinkEdit={setOpenLinkEdit}
                  setEditingIndex={setEditingIndex}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div
          className="SlidingEdit_AddNewLink"
          onClick={() => {
            setEditingIndex(-1);
            setInputValues({ itemLink: "", itemLinkName: "" });
            setOpenLinkEdit(true);
          }}
        >
          <div className="SlidingEdit_AddNewLinkDetails">
            <AddOutlinedIcon style={{ margin: 5 }} />
            <span>Add New Product Link</span>
          </div>
        </div>

        <div
          className="SlidingEdit_AddOldLink"
          onClick={() => {
            setOpenLinkPrevious(true);
          }}
        >
          <div className="SlidingEdit_AddNewLinkDetails">
            <PlaylistAddOutlinedIcon style={{ margin: 5 }} />
            <span>Recent Product Links</span>
          </div>
        </div>
      </div>

      <ConfirmDelete
        openCancel={openCancel}
        setOpenCancel={setOpenCancel}
        deleteItem={deleteItem}
        deleteIndex={deleteIndex}
        handleDeleteItem={handleDeleteItem}
      />
      <LinkItemEdit
        inputValues={inputValues}
        setInputValues={setInputValues}
        openLinkEdit={openLinkEdit}
        setOpenLinkEdit={setOpenLinkEdit}
        handleLinkEditClose={handleLinkEditClose}
        linksState={itemLinks}
        setLinksState={setItemLinks}
        editingIndex={editingIndex}
        setPreviousLinks={setPreviousLinks}
      />
      <LinkPrevious
        openLinkPrevious={openLinkPrevious}
        setOpenLinkPrevious={setOpenLinkPrevious}
        previousLinks={previousLinks}
        linksState={itemLinks}
        setLinksState={setItemLinks}
      />
    </Dialog>
  );
};

// <div className="product_linking_group_name">
// Product Links!
// </div>
