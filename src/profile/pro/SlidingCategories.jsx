import React, { useState } from "react";
import "./ProEdit.css";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useHistory } from "react-router";

import { LinkEditCategory } from "./LinkEditCategory";
import { ConfirmDelete } from "./ConfirmDelete";

import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";

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
          <div className="SlidingEdit_TypeLeft">
            {item.proCategoryImage.includes(".png") ? (
              <img
                src={item.proCategoryImage}
                style={{ height: 18, margin: 3 }}
              />
            ) : (
              <span style={{ margin: 3, fontSize: 16 }}>
                {item.proCategoryImage}
              </span>
            )}
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p className="Draggable_Link_Item_Content_2">
              {item.proCategoryName}
            </p>

            <EditOutlinedIcon
              style={{ fontSize: 22, marginLeft: "0.5rem" }}
              onClick={() => {
                setEditingIndex(index);
                setInputValues({
                  proCategoryImage: item.proCategoryImage,
                  proCategoryName: item.proCategoryName,
                });
                setOpenLinkEdit(true);
              }}
            />
            <DeleteOutlineOutlinedIcon
              style={{ fontSize: 22, marginLeft: "0.5rem" }}
              onClick={() => {
                handleSelectDeleteItem(index, item.proCategoryName);
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

export const SlidingCategories = ({
  openCategories,
  proCategories,
  setProCategories,
}) => {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [openLinkEdit, setOpenLinkEdit] = useState(false);
  const handleLinkEditClose = () => {
    setOpenLinkEdit(false);
  };

  const [openCancel, setOpenCancel] = useState(false);
  const [inputValues, setInputValues] = useState({
    proCategoryName: "",
    proCategoryImage: "",
  });
  const [editingIndex, setEditingIndex] = useState(false);

  const [deleteIndex, setDeleteIndex] = useState("");
  const [deleteItem, setDeleteItem] = useState("");
  const handleSelectDeleteItem = (index, item) => {
    setDeleteIndex(index);
    setDeleteItem(item);
  };
  const handleDeleteItem = (index) => {
    let currentItems = [...proCategories["items"]];
    currentItems.splice(index, 1);
    setProCategories({ items: currentItems });
  };

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const items = reorder(
      proCategories.items,
      result.source.index,
      result.destination.index
    );

    setProCategories({ items });
  }

  return (
    <Dialog
      open={openCategories}
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
            Categories
          </span>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <DraggableList
                  items={proCategories.items}
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
            setInputValues({ proCategoryName: "", proCategoryImage: "" });
            setOpenLinkEdit(true);
          }}
        >
          <div className="SlidingEdit_AddNewLinkDetails">
            <AddOutlinedIcon style={{ margin: 5 }} />
            <span>Add new category</span>
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
      <LinkEditCategory
        inputValues={inputValues}
        setInputValues={setInputValues}
        openLinkEdit={openLinkEdit}
        setOpenLinkEdit={setOpenLinkEdit}
        handleLinkEditClose={handleLinkEditClose}
        linksState={proCategories}
        setlinksState={setProCategories}
        editingIndex={editingIndex}
      />
    </Dialog>
  );
};
