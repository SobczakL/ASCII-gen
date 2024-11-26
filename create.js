const density =
  "$@b%8&wm#*oahkbdpqwmzo0qlcjuyxzcvunxrjft/\\|()1{}[]?-_+~<>i!;:,^`'. ";
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");
const asciiArt = document.getElementById("ascii-art");

const targetWidth = 200;
const targetHeight = 120

upload.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.type.startsWith("image/")) {
      handleimage(file);
    } else if (file.type.startsWith("video/")) {
      handleVideo(file);
    }
  }
});

function handleimage(file) {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = URL.createObjectURL(file);
  image.onload = () => {
    const aspectRatio = image.width / image.height;

    let maxwidth = targetWidth
    let maxheight = Math.round(maxwidth / aspectRatio);

    if (maxheight > targetHeight) {
      maxheight = targetHeight;
      maxwidth = Math.round(maxheight * aspectRatio);
    }

    const charHeightRatio = 2;
    maxheight = Math.round(maxheight / charHeightRatio);

    canvas.width = maxwidth;
    canvas.height = maxheight;

    ctx.drawImage(image, 0, 0, maxwidth, maxheight);
    console.log({ "width": canvas.width, "height": canvas.height })

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