const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const form = document.getElementById("form");
const upload = document.getElementById("upload");
const parent = document.getElementById("parent");
const output = document.getElementById("output");
let fontSize

const testChar = "a";
const fontFamily = "monospace";

const measureChar = (fontSize) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = `${fontSize}px ${fontFamily}`;
  const metrics = ctx.measureText(testChar);
  const charWidth = metrics.width;
  const charHeight = fontSize;
  return { charWidth, charHeight };
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = upload.files[0];
  fontSize = document.getElementById("fontSize").value
  console.log(file, fontSize)
  if (file) {
    output.innerHTML = "";
    const url = URL.createObjectURL(file);
    if (file.type.startsWith("image/")) {
      handleImage(url, parent, canvas, output);
    } else if (file.type.startsWith("video/")) {
      handleVideo(url, parent, canvas, output);
    }
  }
});

const generateASCII = (canvas, ctx, output) => {
  // const density =
  //     "$@b%8&wm#*oakdpwmo0qlcjyxzvuxjft/|()1{}[]?-_+~<>i!;:,^`'. ";
  const density = " .:-=+*o%@";

  // const density =
  //     "@%#*+=-:. ";
  const width = canvas.width;
  const height = canvas.height;
  const imagedata = ctx.getImageData(0, 0, width, height);
  let ascii = "";

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      const r = imagedata.data[offset];
      const g = imagedata.data[offset + 1];
      const b = imagedata.data[offset + 2];
      const avg = (r + g + b) / 3;
      const charindex = Math.floor((avg / 255) * (density.length - 1));
      ascii += density[charindex];
    }
    ascii += "\n";
  }
  output.textContent = ascii;
};

const handleImage = (url, parent, canvas, output) => {
  const ctx = canvas.getContext("2d");
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = url;
  image.onload = () => {
    const containerWidth = parent.offsetWidth;
    const containerHeight = parent.offsetHeight;
    canvas.width = 0;
    canvas.height = 0;

    // Dynamically adjust font size to fit
    while (fontSize > 1) {
      const { charWidth, charHeight } = measureChar(fontSize);
      console.log(charWidth, charHeight);
      const charsPerRow = Math.floor(containerWidth / charWidth);
      const charsPerColumn = Math.floor(containerHeight / charHeight);
      console.log(charsPerRow, charsPerColumn);

      const fits =
        charsPerRow * charWidth <= containerWidth &&
        charsPerColumn * charHeight <= containerHeight;

      if (fits) {
        output.style.fontSize = `${fontSize}px`;
        output.style.lineHeight = `${charHeight}px`;
        canvas.width = charsPerRow;
        canvas.height = charsPerColumn;
        break;
      }
      fontSize--;
    }

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    generateASCII(canvas, ctx, output);
  };

  image.onerror = (error) => {
    console.error("Error loading image:", error);
    output.textContent = "Error loading image";
  };
};

const handleVideo = (url, parent, canvas, output) => {
  const ctx = canvas.getContext("2d");
  const video = document.createElement("video");
  video.src = url;
  video.muted = true;
  video.crossOrigin = "anonymous";
  video.autoplay = true;
  video.loop = true;

  video.onerror = () => {
    console.error("Error loading video");
    output.textContent = "Error loading video";
  };

  video.addEventListener("loadedmetadata", () => {
    const containerWidth = parent.offsetWidth;
    const containerHeight = parent.offsetHeight;

    const maxCharsWidth = Math.floor(containerWidth / charWidth);
    const maxCharsHeight = Math.floor(containerHeight / charHeight);

    canvas.width = Math.floor(maxCharsWidth * 2);
    canvas.height = maxCharsHeight * 2;

    video.play();
  });

  video.addEventListener("play", () => {
    const updateFrame = () => {
      if (!video.paused && !video.ended) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        generateASCII(canvas, ctx, output);
        requestAnimationFrame(updateFrame);
      }
    };
    updateFrame();
  });
};
