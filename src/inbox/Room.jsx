import React, { useState, useEffect } from "react";
import "./Room.css";

import axios from "../axios";
import { Link } from "react-router-dom";

import SendIcon from "@material-ui/icons/Send";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

export const Room = ({ match }) => {
  const [input, setInput] = useState("");

  // useEffect(() => {
  //   axios
  //     .get("v1/messages/get/", {
  //       params: {
  //         query: "larry3107" + "&" + match.params.id,
  //       },
  //     })
  //     .then((response) => {
  //       // let roomOrdered = response.data;
  //       // roomOrdered = roomOrdered.reverse();
  //       // setRooms(getUniqueRooms(roomOrdered));
  //       console.log(response);
  //     });
  // }, []);

  //   useEffect(() => {
  //     var pusher = new Pusher("809f1f3e1c946a13b5b7", {
  //       cluster: "ap1",
  //     });

  //     var channel = pusher.subscribe("messages-channel");
  //     channel.bind("inserted-event", function (newRoom) {
  //       let roomOrdered = [newRoom, ...rooms];
  //       setRooms(getUniqueRooms(roomOrdered));
  //     });

  //     return () => {
  //       channel.unsubscribe("messages-channel");
  //       channel.unbind_all();
  //     };
  //   }, [rooms]);

  const sendMessage = (e) => {
    e.preventDefault();
    // axios.post("/v1/messages/create", {
    //   message: input,
    //   sender: "larry3107",
    //   receiver: match.params.id,
    //   timestamp: "now",
    // });

    setInput("");
  };
  return (
    <div className="room">
      <div className="room_header">
        <div className="room_container">
          <Link
            to={`/inbox`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ArrowBackIosIcon />
          </Link>
          <h3>{match.params.id}</h3>
          <MoreHorizIcon style={{ color: "white" }} /> {/* hidden for now */}
        </div>
      </div>

      <div className="room_body">
        <p className="room_message">
          <span className="room_name">Admin</span>
          We are working hard to launch this feature. Stay tuned!
          <span className="room_timestamp">5 mins ago</span>
          {/* <span className="room_timestamp">{new Date().toUTCString()}</span> */}
        </p>
        <p className="room_message">
          <span className="room_name">Admin</span>
          For any enquiries / help, feel free to drop us a message on instagram
          @shoplocoloco_sg !<span className="room_timestamp">now</span>
          {/* <span className="room_timestamp">{new Date().toUTCString()}</span> */}
        </p>
        {/* <p className="room_message room_receiver">
          <span className="room_name">Bubi</span>
          This is a message
          <span className="room_timestamp">{new Date().toUTCString()}</span>
        </p> */}
      </div>

      <div className="room_footer">
        <form className="room_form">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};
