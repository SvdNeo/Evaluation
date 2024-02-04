const imageCanvas = document.getElementById("imageCanvas");
const colorPaletteContainer = document.getElementById("colorPalette");
const imageInput = document.getElementById("imageInput");
let colorPickers = [];
let hexValues = [];

imageInput.addEventListener("change", handleImageUpload);
const defaultImg = new Image();
defaultImg.src = "/default_image.jpg";
let initialLoad = true;
defaultImg.onload = function() {
  imageCanvas.getContext("2d").drawImage(defaultImg, 0, 0, imageCanvas.width, imageCanvas.height);
  if (initialLoad) {
    addColorPicker();
    addColorPicker();
    initialLoad = false; 
  }
}

defaultImg.crossOrigin = "Anonymous";


function handleImageUpload(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();
    

      img.onload = function () {
        imageCanvas
          .getContext("2d")
          .drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
             };
   
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  } 
}


function addColorPicker() {
  if (colorPickers.length < 10) {
    const colorPicker = document.createElement("div");
    colorPicker.classList.add("colorPicker");
    colorPicker.style.top = getRandomPosition() + "px";
    colorPicker.style.left = getRandomPosition() + "px";

    colorPicker.addEventListener("mousedown", startDrag);
    colorPickers.push(colorPicker);
    console.log(colorPickers);
    updateColorPalette();
    document.getElementById("canvasContainer").appendChild(colorPicker);
    addActivePicker(colorPicker);

  
    if (colorPickers.length === 10) {
    
      document.getElementById("addColorPickerButton").disabled = true;
    }
  } else {
    document.getElementById("addColorPickerButton").disabled = false;
  }
}

function removeColorPicker() {
  if (colorPickers.length > 2) {
   
    const removedPicker = colorPickers.pop();
    removedPicker.remove();

    hexValues.pop();
    updateColorPalette();
   
    document.getElementById("addColorPickerButton").disabled = false;
  } else {
    document.getElementById("removeColorPickerButton").disabled = true;
  }
}

function startDrag(event) {
  const colorPicker = event.target;
  addActivePicker(colorPicker);
  const offsetX = event.clientX - parseInt(colorPicker.style.left);
  const offsetY = event.clientY - parseInt(colorPicker.style.top);

  function handleDragMove(moveEvent) {
    const x = moveEvent.clientX - offsetX;
    const y = moveEvent.clientY - offsetY;
    const colorPickerLeft =
      constrainValue(x, 0, imageCanvas.width - colorPicker.offsetWidth) + "px";
    const colorPickerTop =
      constrainValue(y, 0, imageCanvas.height - colorPicker.offsetHeight) +
      "px";
    const color = getColorAtPosition(colorPickerLeft, colorPickerTop);
    colorPicker.style.left = colorPickerLeft;
    colorPicker.style.top = colorPickerTop;
    colorPicker.style.backgroundColor = color;
    updateColorPalette();
  }
  function handleDragEnd() {
    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
  }

  document.addEventListener("mousemove", handleDragMove);
  document.addEventListener("mouseup", handleDragEnd);
}