import React, { useState } from "react";
import "./ProEdit.css";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useHistory } from "react-router";

import { LinkItemEdit } from "./LinkItemEdit";
import { LinkPrevious } from "./LinkPrevious";
import { ConfirmDelete } from "./ConfirmDelete";
import { SimpleMiddleNotification } from "../../components/SimpleMiddleNotification";

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
import PlaylistAddOutlinedIcon from "@material-ui/icons/PlaylistAddOutlined";
import CircularProgress from "@material-ui/core/CircularProgress";

import axios from "../../axios";

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
  inputValues,
  setInputValues,
  setOpenLinkEdit,
  setEditingIndex,
  itemImage,
  setItemImage,
  setOpenEditImage,
  gettingProductImage,
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
          <div
            className="SlidingEdit_TypeLeft"
            onClick={() => {
              setEditingIndex(index);
              // temp inputs for editing
              setInputValues({
                itemLink: item.itemLink,
                itemLinkName: item.itemLinkName,
                itemLinkDesc: item.itemLinkDesc,
                itemImage: item.itemImage,
              });
              setOpenLinkEdit(true);
            }}
          >
            {item.itemImage ? (
              <div className="pro_profile_icon_and_name">
                <img
                  className="SlidingEdit_TypeLeft_Image_Placeholder"
                  src={item.itemImage}
                />
              </div>
            ) : gettingProductImage ? (
              <div className="SlidingEdit_TypeLeft_Image_Placeholder">
                <CircularProgress size={18} />
              </div>
            ) : (
              <div className="SlidingEdit_TypeLeft_Image_Placeholder">
                <p style={{ fontSize: 7 }}>No Image</p>
              </div>
            )}
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p className="Draggable_Link_Item_Content_2">{item.itemLinkName}</p>

            <EditOutlinedIcon
              style={{ fontSize: 22, marginLeft: "0.5rem" }}
              onClick={() => {
                setEditingIndex(index);
                // temp inputs for editing
                setInputValues({
                  itemLink: item.itemLink,
                  itemLinkName: item.itemLinkName,
                  itemLinkDesc: item.itemLinkDesc,
                  itemImage: item.itemImage,
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
  inputValues,
  setInputValues,
  setOpenLinkEdit,
  setEditingIndex,
  setOpenEditImage,
  gettingProductImage,
}) {
  return items.map((item, index) => (
    <Draggable_Item
      item={item}
      index={index}
      key={item.id}
      setOpenCancel={setOpenCancel}
      handleSelectDeleteItem={handleSelectDeleteItem}
      inputValues={inputValues}
      setInputValues={setInputValues}
      setOpenLinkEdit={setOpenLinkEdit}
      setEditingIndex={setEditingIndex}
      setOpenEditImage={setOpenEditImage}
      gettingProductImage={gettingProductImage}
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

export const ContentAllProducts = ({
  openItemLinks,
  itemLinks,
  setItemLinks,
  changesMade,
  setChangesMade,
}) => {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [openLinkEdit, setOpenLinkEdit] = useState(false);
  const handleLinkEditClose = () => {
    setOpenLinkEdit(false);
  };

  const [openEditImage, setOpenEditImage] = useState(false);

  const [gettingProductImage, setGettingProductImage] = useState(false);

  const [affiliateGroupName, setAffiliateGroupName] =
    useState("Product Links!");

  const [openCancel, setOpenCancel] = useState(false);
  const [inputValues, setInputValues] = useState({
    itemLink: "",
    itemLinkName: "",
    itemLinkDesc: "",
    itemImage: "",
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

  const [showNotif, setShowNotif] = useState("");

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

  const handleSaveProducts = async () => {
    const res = await axios.put(
      "/v1/users/update/" + localStorage.getItem("USER_ID"),
      {
        allProductLinks: itemLinks.items,
      }
    );

    if (res.status === 201) {
      setShowNotif("Saved");
      setTimeout(() => {
        setShowNotif("");
      }, 3000);
      setChangesMade(false);
    } else {
      setShowNotif("Error");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="SlidingEdit_Body">
        <div
          className="SlidingEdit_AddNewLink"
          style={{
            backgroundColor: "rgb(245,23,86)",
            border: "2px solid rgb(245,23,86)",
            color: "white",
            height: "2.1rem",
          }}
          onClick={handleSaveProducts}
        >
          <div className="SlidingEdit_AddNewLinkDetails">
            <span>SAVE</span>
          </div>
        </div>
        <div
          className="SlidingEdit_AddNewLink"
          onClick={() => {
            setEditingIndex(-1);
            setInputValues({
              itemLink: "",
              itemLinkName: "",
              itemLinkDesc: "",
              itemImage: "",
            });
            setOpenLinkEdit(true);
          }}
        >
          <div className="SlidingEdit_AddNewLinkDetails">
            <AddOutlinedIcon style={{ margin: 5 }} />
            <span>Add New Product Link</span>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <DraggableList
                  items={itemLinks.items}
                  setOpenCancel={setOpenCancel}
                  handleSelectDeleteItem={handleSelectDeleteItem}
                  inputValues={inputValues}
                  setInputValues={setInputValues}
                  setOpenLinkEdit={setOpenLinkEdit}
                  setEditingIndex={setEditingIndex}
                  setOpenEditImage={setOpenEditImage}
                  gettingProductImage={gettingProductImage}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <ConfirmDelete
        openCancel={openCancel}
        setOpenCancel={setOpenCancel}
        deleteItem={deleteItem}
        deleteIndex={deleteIndex}
        handleDeleteItem={handleDeleteItem}
        setChangesMade={setChangesMade}
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
        gettingProductImage={gettingProductImage}
        setGettingProductImage={setGettingProductImage}
        setChangesMade={setChangesMade}
      />

      {showNotif && <SimpleMiddleNotification message={showNotif} />}
    </div>
  );
};
