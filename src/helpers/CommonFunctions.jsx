export const getCombinedName = (color, name, size) => {
  let newColor = "";
  let newName = "";
  let newSize = "";

  if (color) {
    newColor = color + " ";
  }
  if (name) {
    newName = name;
  }
  if (size) {
    newSize = " (" + size + ")";
  }

  return newColor + newName + newSize;
};
