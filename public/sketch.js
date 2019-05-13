// LSTM setup
let charRNN;
let startBtn;
let generating = false;
// let canvasHeight = 100;
let period = 0;
let seed = "tell me about you.";

// speech setup
let foo;
let myRec;


function setup() {
  // noCanvas();
  // Create the LSTM Generator passing it the model directory
  charRNN = ml5.charRNN('./models/woolf/', modelReady);
  startBtn = select('#start');
  // // DOM element events
  // startBtn.mousePressed(generate);

  //speech setup
  var canvas = createCanvas(windowWidth, 100);
  canvas.parent("canvasContainer");
  background(255, 255, 255);
  fill(0, 0, 0, 255);
  fill(0, 0, 0, 255);
  // instructions:
  textSize(20);

  foo = new p5.Speech(); // speech synthesis object

  // foo.setVoice("Sara");
  foo.setPitch(2);
  foo.setVoice(2);
  foo.setRate(1);
  myRec = new p5.SpeechRec(); // new P5.SpeechRec object
  myRec.continuous = true;
  myRec.onEnd = function (){
    myRec.start();
  }

  // textAlign(CENTER);
  text("say something", 30, 100);
  myRec.onResult = showResult;
  // myRec.onEnd = myRec.start();
  myRec.start();
}

//speech result
function showResult() {
  if (myRec.resultValue == true) {
    background(192, 255, 192);
    text(myRec.resultString, 30, 30);
    // console.log("resultingString", myRec.resultString);
    updateSeed();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function updateSeed(){
  seed = myRec.resultString;
  // console.log("seed", seed);
  generate();
  // myRec.continuous = false;
}

async function modelReady() {
  // select('#status').html('Model Loaded');
  resetModel();
}

function resetModel() {
  charRNN.reset();
  // const seed = select('#textInput').value();
  // const seed = "tell me about yourself";
  charRNN.feed(seed);
  // select('#result').html(seed);
  select('#result').html("");
  // myRec.continuous = true;
}

function generate() {
    resetModel();
    generating = true;
    // startBtn.html('Pause');
    loopRNN();
}

async function loopRNN() {
  while (generating) {
    await predict();
  }
}

async function predict() {
  let par = select('#result');
  // range is 0 to 1
  let temperature = 1;
  let next = await charRNN.predict(temperature);
  await charRNN.feed(next.sample);
  par.html(par.html() + next.sample);
  // console.log(next.sample);
  // foo.speak(next.sample); // say something

  if(next.sample=="." ||next.sample=="?" ){
    period++;
    // console.log(period);
  }

  if(period>0){
    generating = false;
    // startBtn.html('Start');
    period = 0;
    foo.speak(par.html());
  }
}
