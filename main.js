
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

const imgEl = document.getElementById("artImg");
const gallery = document.getElementById("gallery");

// artworks
const artWorks = [
  {
    name: 'Starry Night',
    artist: 'Vincent van Gogh',
    date: '1893',
    location: 'Museum of Modern Art New York',
    img: 'https://random-ize.com/random-art-gallery/starry-night.jpg'
  },
  {
    name: 'Guernica',
    artist: 'Pablo Picasso',
    date: '1937',
    location: '',
    img: 'https://random-ize.com/random-art-gallery/guernica.jpg'
  },
  {
    name: 'Whistlers Mother',
    artist: 'James McNeill Whistler',
    date: '1871',
    location: 'Musée du Luxembourg Paris',
    img: 'https://random-ize.com/random-art-gallery/whistlers-mother.jpg'
  },
  {
    name: 'Forward Retreat',
    artist: 'Tansey',
    date: '1986',
    location: 'Broad Art Foundation',
    img: 'https://random-ize.com/random-art-gallery/forward-retreat.GIF'
  }
]

// pick artwork

function newArt() {
  const randomArt = artWorks[Math.floor(Math.random() * artWorks.length)];
  imgEl.src = randomArt.img;
  if (randomArt.location == '') {
    document.getElementById('description').textContent = `${randomArt.name} by ${randomArt.artist} (${randomArt.date})`;
  } else {
    document.getElementById('description').textContent = `${randomArt.name} by ${randomArt.artist} (${randomArt.date}) – ${randomArt.location}`;
  }
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
    gallery.classList.add("hide");
  } else if (label == yesLabel) {
    // hide no, show yes
    yesEl.classList.remove("hide");
    gallery.classList.remove("hide");
    noEl.classList.add("hide");
    newArt();
  } else {
    // hide both
    noEl.classList.add("hide");
    yesEl.classList.add("hide");
    gallery.classList.add("hide");
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
