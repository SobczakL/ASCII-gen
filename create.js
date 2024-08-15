const density = "B@#W$G98SHP654321?!abc;:+=-,._ ";
const ctx = document.getElementById("canvas").getContext("2d");
const img = new Image();

console.log("here");

img.addEventListener("load", () => {
  console.log("Image loaded");
  ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
});

function draw() {
  console.log("hello");
  img.src = "gigachad.jpeg"; // Set the source after registering the load event
}

draw();

// function preload() {
//   image = loadImage("gigachad.jpeg");
// }
//
// function setup() {
//   // createCanvas(400, 400);
// }
//
// function draw() {
//   // background(200);
//   Image(image, 0, 0, width, height);
//   // for (let i = 0; i < image.width; i++) {
//   //   for (let j = 0; j < image.height; j++) {
//   //     const pixelIndex = (i + j * image.width) * 4;
//   //     const r = image.pixels[pixelIndex + 0];
//   //     const g = image.pixels[pixelIndex + 1];
//   //     const b = image.pixels[pixelIndex + 2];
//   //   }
//   // }
// }
