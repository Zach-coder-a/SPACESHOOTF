import Game from "./game.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const context = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 600;
  context.strokeStyle = "white";
  context.fillstyle = "white";
  context.lineWidth = 3;
  context.font = "50px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";

  const game = new Game(canvas);

  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    context.clearRect(0, 0, canvas.width, canvas.height);
    game.render(context, deltaTime);
    requestAnimationFrame(animate);
  }
  animate(0);
});
