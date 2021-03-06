
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
    name: "Whistler's Mother",
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
  },
  {
    name: 'Three Musicians',
    artist: 'Pablo Picasso',
    date: '1921',
    location: 'Museum of Modern Art New York',
    img: 'https://random-ize.com/random-art-gallery/three-musicians.jpg'
  },
  {
    name: 'The Night Watch',
    artist: 'Rembrandt',
    date: '1642',
    location: '',
    img: 'https://random-ize.com/random-art-gallery/the-night-watch.jpg'
  },
  {
    name: 'Death and the Maiden',
    artist: 'Egon Schiele',
    date: '1915',
    location: 'Belvedere Museum Vienna',
    img: 'https://random-ize.com/random-art-gallery/death-and-the-maiden.jpg'
  },
  {
    name: 'Girl with a Pearl Earring',
    artist: 'Johannes Vermeer',
    date: '1665',
    location: 'Mauritshuis Gallery in The Hague',
    img: 'https://random-ize.com/random-art-gallery/girl-with-a-pearl-earring.jpg'
  },
  {
    name: 'The Last Supper',
    artist: 'Leonardo da Vinci',
    date: '1497',
    location: 'Santa Maria delle Grazie, Milan',
    img: 'https://random-ize.com/random-art-gallery/the-last-supper.jpg'
  },
  {
    name: 'American Gothic',
    artist: 'Grant Wood',
    date: '1930',
    location: 'The Art Institute of Chicago',
    img: 'https://random-ize.com/random-art-gallery/american-gothic.jpg'
  },
  {
    name: 'Mona Lisa',
    artist: 'Leonardo da Vinci',
    date: '1503 - 1519',
    location: 'Musee du Louvre Paris',
    img: 'https://random-ize.com/random-art-gallery/mona-lisa.jpg'
  },
  {
    name: 'The Grainstack',
    artist: 'Claude Monet',
    date: '1896',
    location: 'Museum of Fine Arts Boston',
    img: 'https://random-ize.com/random-art-gallery/the-grainstack.jpg'
  },
  {
    name: "Portrait de l'Artiste sans Barbe",
    artist: 'Vincent van Gogh',
    date: '1889',
    location: '',
    img: 'https://random-ize.com/random-art-gallery/portrait-de-artiste-sans-barbe.jpg'
  },
  {
    name: 'I and the Village',
    artist: 'Chagall',
    date: '1911',
    location: 'Museum of Modern Art New York',
    img: 'https://random-ize.com/random-art-gallery/i-and-the-village.jpg'
  },
  {
    name: 'The Son of Man',
    artist: 'Rene Magritte',
    date: '1964',
    location: '',
    img: 'https://random-ize.com/random-art-gallery/the-son-of-man.jpg'
  },
  {
    name: 'Judith I',
    artist: 'Gustav Klimt',
    date: '1901',
    location: 'Belvedere Museum Vienna',
    img: 'https://random-ize.com/random-art-gallery/judith.jpg'
  },
  {
    name: 'The Kiss',
    artist: 'Gustav Klimt',
    date: '1908',
    location: '',
    img: 'https://random-ize.com/random-art-gallery/the-kiss.jpg'
  },
  {
    name: 'The Last Judgement',
    artist: 'Hieronymus Bosch',
    date: '1505',
    location: 'Gemäldegalerie der Akademie der Bildenden Kunste Wien',
    img: 'https://random-ize.com/random-art-gallery/the-last-judgement.jpg'
  },
  {
    name: 'Nimphee',
    artist: 'Claude Monet',
    date: '1926',
    location: 'Orangerie Paris',
    img: 'https://random-ize.com/random-art-gallery/nimphee.jpg'
  },
]

// pick artwork

function newArt() {
  const randomArt = artWorks[Math.floor(Math.random() * artWorks.length)];
  imgEl.src = randomArt.img;
  document.getElementById('name').textContent = randomArt.name;
  if (randomArt.location == '') {
    document.getElementById('description').textContent = `by ${randomArt.artist} (${randomArt.date})`;
  } else {
    document.getElementById('description').textContent = `by ${randomArt.artist} (${randomArt.date}) – ${randomArt.location}`;
  }
}

document.getElementById('next').onclick = function() {newArt()};

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
    newArt();
    yesEl.classList.remove("hide");
    gallery.classList.remove("hide");
    noEl.classList.add("hide");
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
