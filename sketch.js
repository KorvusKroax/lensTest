let imgSharp_original;
let imgBlur_neworiginal;
let imgDOF_original;
let imgLensMask_original;
let imgLensFrame_original;
let imgLensDOF_original;
let imgLensZones_original;

let imgWidth;
let imgHeight;
let imgAspect;
let pxSize = 1;
let imgSharp;
let imgBlur;
let imgDOF;

let lens;
let lensScale = 1;
let offsetX = 0;
let offsetY = 0;
let imgLens;
let imgLensDOF;

let canvas;

function preload() {
  imgSharp_original = loadImage("images/alaska1440x900_sharp.png");
  imgBlur_neworiginal = loadImage("images/alaska1440x900_blur.png");
  imgDOF_original = loadImage("images/alaska1440x900_dof.png");
  imgLensMask_original = loadImage("images/lens640x480_mask.png");
  imgLensFrame_original = loadImage("images/lens640x480_frame.png");
  imgLensDOF_original = loadImage("images/lens640x480_dof.png");
  imgLensZones_original = loadImage("images/lens640x480_zones.png");
}

function setup() {
  // https://stackoverflow.com/questions/69225985/how-to-use-mousepressedover-in-p5-for-phone
  // Prevent top level gesture scrolling/zooming
  // This if iOS Safari specific
  document.addEventListener("gesturestart", function (e) {
    e.preventDefault();
    return false;
  });

  lens = new HotSpot(
    (imgSharp_original.width - imgLensFrame_original.width * lensScale) * 0.5, 
    (imgSharp_original.height - imgLensFrame_original.height * lensScale) * 0.5, 
    imgLensFrame_original.width * lensScale, 
    imgLensFrame_original.height * lensScale,
    -10);

  imgAspect = imgSharp_original.width / imgSharp_original.height;
  
  setImage();
  
  canvas = createCanvas(imgWidth, imgHeight).position((windowWidth - imgWidth) * 0.5, (windowHeight - imgHeight) * 0.5);
}

function draw() {
  image(imgSharp, 0, 0);
  
  let imgBlur_new = imgBlur.get();
  imgBlur_new.loadPixels();
  imgDOF.loadPixels();
  imgLensDOF.loadPixels();
  for (let x = 0; x < lens.w; x++) {
    for (let y = 0; y < lens.h; y++) {
      let value = 200;
      let imgIndex = 4 * (int(lens.x + x) + int(lens.y + y) * imgBlur.width);
      let lensIndex = 4 * (x + y * int(lens.w));
      if (imgLensDOF.pixels[lensIndex + 3] != 0) {

        let iv = imgDOF.pixels[imgIndex];
        let lv = imgLensDOF.pixels[lensIndex];
        value = 255 - abs(lv - iv);
      }
      
      imgBlur_new.pixels[imgIndex + 3] = value;
    }
  }
  imgBlur_new.updatePixels();
  
  imgBlur_new.copy(imgLensZones_original, 0, 0, imgLensZones_original.width, imgLensZones_original.height, lens.x, lens.y, lens.w, lens.h);
  imgBlur_new.copy(imgLensFrame_original, 0, 0, imgLensFrame_original.width, imgLensFrame_original.height, lens.x, lens.y, lens.w, lens.h);
  
  image(imgBlur_new, 0, 0);
  
  
  //lens.show();
  
  //if (touches.length) {
  //  print(touches.length);
  //}
}

function mousePressed() {
  if (lens.contains(mouseX, mouseY)) {
    offsetX = lens.x - mouseX;
    offsetY = lens.y - mouseY;
  }
  return false;
}

function mouseDragged() {
  if (lens.contains(mouseX, mouseY)) {
    lens.move(mouseX + offsetX, mouseY + offsetY);
  }
  return false;
}

function windowResized() {
  setImage();
  resizeCanvas(imgWidth, imgHeight);
  canvas.position((windowWidth - imgWidth) * 0.5, (windowHeight - imgHeight) * 0.5);
}

function setImage() {
  let padding = 1 * 10;
  imgHeight = windowHeight - padding;
  if (imgHeight * imgAspect > windowWidth - padding) {
    imgHeight = (windowWidth - padding) / imgAspect;
  }
  imgWidth = imgHeight * imgAspect;

  
  
  let oldPxSize = pxSize;
  pxSize = imgHeight / imgSharp_original.height;

  let n = pxSize / oldPxSize;
  lens.x *= n;  
  lens.y *= n;
  lens.w *= n;
  lens.h *= n;
  lens.padding *= n;

    
  
  imgSharp = imgSharp_original.get();
  imgSharp.resize(imgWidth, imgHeight);

  imgBlur = imgBlur_neworiginal.get();
  imgBlur.resize(imgWidth, imgHeight);
  
  imgDOF = imgDOF_original.get();
  imgDOF.resize(imgWidth, imgHeight);
  
  imgLensDOF = imgLensDOF_original.get();
  imgLensDOF.resize(lens.w, lens.h);
}
