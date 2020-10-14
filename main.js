
// the link to your model locally or the link from Teachable Machines
const URL = "./tm-mask-nomask/";

// parameters to modify
const webCamWidth = 640;
const webCamHeight = 480;
const flip = true; // flip camera?
const limit = .5;
const yesLabel = "Mask";
const noLabel = "No Mask";

const noEl = document.getElementById("no-container");
const yesEl = document.getElementById("yes-container");


//random video

let videoEl;

function randomVideo() {
  const videoNo = "vid" + (Math.floor(Math.random() * 3) + 1);
  videoEl = document.getElementById(videoNo);
  videoEl.classList.remove("hide");
  videoEl.play();
  console.log('video numer:' +  videoNo);
}


//-------------------------------------------------------
let model, webcam, labelContainer, maxPredictions;
let lastLabel = "none";

function swapDivs(label) {

  console.log(label);

  if (lastLabel == label)
    return;

  if (label == noLabel) {
    // hide yes, show no
    noEl.classList.remove("hide");
    yesEl.classList.add("hide");
    randomVideo();
  } else if (label == yesLabel) {
    // hide no, show yes
    yesEl.classList.remove("hide");
    noEl.classList.add("hide");
    videoEl.pause();
    videoEl.classList.add("hide");
  } else {
    // hide both
    noEl.classList.add("hide");
    yesEl.classList.add("hide");
  }

  lastLabel = label;
}

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // convenience function to setup a webcam
  webcam = new tmImage.Webcam(webCamWidth, webCamHeight,
                              flip); // width, height, flip
  await webcam.setup();              // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);
  let highestProbability = 0;
  let bestLabel = "";

  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
        prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    // console.log(classPrediction);
    if (prediction[i].probability > highestProbability &&
        prediction[i].probability > limit) {
      bestLabel = prediction[i].className;
      highestProbability = prediction[i].probability;
    }
  }

  swapDivs(bestLabel);
}

init();
