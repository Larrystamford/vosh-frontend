import React, { useState, useEffect } from "react";
import "./Lobby.css";

import { Link } from "react-router-dom";

import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import { RoomPreview } from "./RoomPreview";

export const Lobby = () => {
  const [rooms, setRooms] = useState([
    {
      message: "For any enquiries / help, feel free to drop us a message on instagram @vosh.club !",
      sender: "Admin",
      receiver: "You",
      timestamp: "now",
    },
  ]);
  const [input, setInput] = useState("");

  // useEffect(() => {
  //   axios.get("/v1/messages/list").then((response) => {
  //     let roomOrdered = response.data;
  //     roomOrdered = roomOrdered.reverse();
  //     setRooms(getUniqueRooms(roomOrdered));
  //   });
  // }, []);

  // useEffect(() => {
  //   var pusher = new Pusher("809f1f3e1c946a13b5b7", {
  //     cluster: "ap1",
  //   });

  //   var channel = pusher.subscribe("messages-channel");
  //   channel.bind("inserted-event", function (newRoom) {
  //     let roomOrdered = [newRoom, ...rooms];
  //     setRooms(getUniqueRooms(roomOrdered));
  //   });

  //   return () => {
  //     channel.unsubscribe("messages-channel");
  //     channel.unbind_all();
  //   };
  // }, [rooms]);

  const getUniqueRooms = (roomOrdered) => {
    const userSeenSet = new Set();
    const roomOrderedUnique = [];
    for (const room of roomOrdered) {
      if (!userSeenSet.has(room.name)) {
        roomOrderedUnique.push(room);
        userSeenSet.add(room.name);
      }
    }
    return roomOrderedUnique;
  };

  return (
    <div className="lobby">
      <div className="lobby_search">
        <div className="lobby_searchContainer">
          <SearchOutlinedIcon />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search"
            type="text"
          />
        </div>
      </div>

      <div className="lobby_roomPreview">
        {rooms.map(({ message, sender, receiver, timestamp }) =>
          sender.includes(input) ? (
            <Link to={`/room/${sender}`} className="lobby_link">
              <RoomPreview
                userId={sender}
                message={message}
                sender={sender}
                receiver={receiver}
                timestamp={timestamp}
              />
            </Link>
          ) : null
        )}
      </div>
    </div>
  );
};
