import React from "react";

export const SimpleMiddleNotification = ({ message, width }) => {
  let curWidth = 65;
  if (width) {
    curWidth = width;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        margin: "0 auto",
        transform: "translate(-50%, -50%)",
        backgroundColor: "grey",
        color: "white",
        borderRadius: "6px",
        width: curWidth,
        fontSize: 14,
        fontFamily: "calibri",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 25,
      }}
    >
      {message}
    </div>
  );
};
