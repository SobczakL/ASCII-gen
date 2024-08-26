const density = "B@#W$G98SHP654321?!abc;:+=-,._ ";
const ctx = document.getElementById("canvas").getContext("2d");
const upload = document.getElementById("upload");
const output = document.getElementById("output");
const asciiArt = document.getElementById('ascii-art')

//process image or video
upload.addEventListener("change", async (event) => {
  console.log('here')
  const file = event.target.files[0];
  if (file.type.startsWith("image/")) {
    handleImage(file);
  } else if (file.type.startsWith("video/")) {
    handleVideo(file);
  }
});

function handleImage(file) {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    generateASCII();
  };
}

async function handleVideo(file) {
  const video = document.createElement("video");
  video.src = URL.createObjectURL(file);
  video.currentTime = 0;
  await video.play();

  video.addEventListener("timeupdate", () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    generateASCII();
  });
}

function generateASCII() {
  const width = 100;
  const height = (canvas.height / canvas.width) * width;
  ctx.drawImage(canvas, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  let ascii = "";

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      const r = imageData.data[offset];
      const g = imageData.data[offset + 1];
      const b = imageData.data[offset + 2];
      const avg = (r + g + b) / 3;
      const charIndex = Math.floor((avg / 255) * (density.length - 1));
      ascii += density[charIndex];
    }
    ascii += "\n";
  }
  asciiArt.textContent = ascii;
}
