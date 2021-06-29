const video = document.getElementById('video');
const label1Button = document.getElementById('label1Button');
const label2Button = document.getElementById('label2Button');
const amountOfLabel1Images = document.getElementById('amountOfLabel1Images');
const amountOfLabel2Images = document.getElementById('amountOfLabel2Images');
const train = document.getElementById('train');
const loss = document.getElementById('loss');
const result = document.getElementById('result');
const confidence = document.getElementById('confidence');
const predict = document.getElementById('predict');

let featureExtractor = null;
let classifier = null;

const init = () => {
  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    video.srcObject = stream;
    video.play();
  });

  featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
  classifier = featureExtractor.classification(video, videoReady);
};

// A function to be called when the model has been loaded
const modelLoaded = () => {
  featureExtractor.load('model.json');
  console.log('MobileNet model is loaded');
};

// A function to be called when the video is finished loading
const videoReady = () => {
  console.log('Video is ready');
};

init();

label1Button.onclick = () => {
  classifier.addImage('Wear a mask!!');
  amountOfLabel1Images.innerText = Number(amountOfLabel1Images.innerText) + 1;
};

label2Button.onclick = () => {
  classifier.addImage('Great! always wear a mask!');
  amountOfLabel2Images.innerText = Number(amountOfLabel2Images.innerText) + 1;
};

train.onclick = () => {
  classifier.train(lossValue => {
    if (lossValue) {
      totalLoss = lossValue;
      loss.innerHTML = `Loss: ${totalLoss}`;
    } else {
      loss.innerHTML = `Done Training! Final Loss: ${totalLoss}`;
    }
  });
};

const gotResults = (err, results) => {
  if (err) {
    console.error(err);
  } else if (results && results[0]) {
    result.innerText = results[0].label;
    confidence.innerText = results[0].confidence;
    classifier.classify(gotResults);
  }
};

predict.onclick = () => {
  classifier.classify(gotResults);
};
