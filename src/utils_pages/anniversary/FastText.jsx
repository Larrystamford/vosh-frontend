import React, { useEffect, useState } from "react";
import "./IntroText.css";

export const FastText = () => {
  var textArray = ["I", "CANT", "LET", "YOU", "GO"];

  const [typedText, setTypedText] = useState([]);

  const [done, setDone] = useState(false);

  const typingDelay = 0;
  const erasingDelay = 0;
  const newTextDelay = 500;
  let textIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < textArray[textIndex].length) {
      setTypedText((prevState) => [
        ...prevState,
        textArray[textIndex][charIndex],
      ]);

      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      setTimeout(erase, newTextDelay);
    }
    if (textIndex == 4) {
      setTimeout(() => setDone(true), 500);
    }
  }

  function erase() {
    if (charIndex > 0) {
      setTypedText((prevState) => [
        ...prevState.splice(0, prevState.length - 2),
      ]);
      charIndex--;
      setTimeout(erase, erasingDelay);
    } else {
      textIndex++;
      if (textIndex >= textArray.length) {
        textIndex = 0;
      }
      setTimeout(type, typingDelay);
    }
  }

  useEffect(() => {
    setTimeout(type, 700);
  }, []);

  return (
    <div>{done ? null : <p className="fastText_headers">{typedText}</p>}</div>
  );
};
