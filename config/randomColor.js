const colors = ["red", "green", "blue", "pink", "purple", "orange", "gray"];

function getRandomColor() {
  let randomNum = Math.floor(Math.random() * colors.length);
  return colors[randomNum];
}

module.exports = getRandomColor;
