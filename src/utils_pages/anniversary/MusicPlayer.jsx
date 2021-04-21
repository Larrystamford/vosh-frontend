import React, { useState, useEffect } from "react";

const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    setPlaying(true);
  };

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

export const MusicPlayer = ({ url, setStartShow }) => {
  // const [playing, toggle] = useAudio(url);

  const onStartShow = () => {
    const audio = new Audio(url);
    audio.play();
    setStartShow(true);
    // toggle();
  };
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "absolute",
        zIndex: 1000,
        opacity: 0,
      }}
      onClick={() => onStartShow()}
    ></div>
  );
};
