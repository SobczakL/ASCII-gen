const density =
  "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. ";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");
const asciiArt = document.getElementById("ascii-art");

const targetWidth = 200;
const targetHeight = 120

upload.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.type.startsWith("image/")) {
      handleImage(file);
    } else if (file.type.startsWith("video/")) {
      handleVideo(file);
    }
  }
});

function handleImage(file) {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    const aspectRatio = img.width / img.height;
    const width = targetWidth;
    // const height = Math.round(width / aspectRatio);
    const height = targetHeight

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    generateASCII();
  };
}

async function handleVideo(file) {
  const video = document.createElement("video");
  video.src = URL.createObjectURL(file);
  video.currentTime = 0;
  await video.play();

  video.addEventListener("timeupdate", () => {
    const aspectRatio = video.videoWidth / video.videoHeight;
    const width = targetWidth;
    const height = Math.round(width / aspectRatio);

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(video, 0, 0, width, height);
    generateASCII();
  });
}

function generateASCII() {
  const width = canvas.width;
  const height = canvas.height;
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

  // const fontSize = Math.floor(width / 10)
  const fontSize = 16
  asciiArt.style.fontSize = `${fontSize}px`;
  asciiArt.textContent = ascii;
}
