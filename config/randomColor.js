const colors = [
  "dark-red",
  "light-red",
  "dark-blue",
  "light-blue",
  "dark-green",
  "light-green",
  "dark-green",
  "pink",
  "purple",
  "orange",
  "gray",
];

function getRandomColor() {
  let randomNum = Math.floor(Math.random() * colors.length);
  return colors[randomNum];
}

module.exports = getRandomColor;
