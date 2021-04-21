import { useRef, useState, useEffect } from "react";

export const useHover = () => {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const enter = () => {
    setHovered(true);
  };
  const leave = () => {
    setHovered(false);
  };
  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener("mouseover", enter);
      node.addEventListener("mouseleave", leave);
      return () => {
        node.removeEventListener("mouseover", enter);
        node.removeEventListener("mouseleave", leave);
      };
    }
  }, [ref]);

  return [ref, hovered];
};
