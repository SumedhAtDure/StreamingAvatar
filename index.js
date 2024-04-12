const chatDiv = document.getElementById("chat");
let isMicrophoneListening = false;


navigator.mediaDevices.getUserMedia({ audio: true })
.then(function(stream) {
  // Microphone is listening
  // console.log('Microphone is listening');

  // Set up the MediaRecorder
  const mediaRecorder = new MediaRecorder(stream);

  // console.log("mediaRecorder",mediaRecorder)
  // Event listener for when recording starts
  mediaRecorder.onstart = function() {
    isMicrophoneListening = true;
    // console.log("mediaRecorder>>",mediaRecorder)
    console.time()
    // console.log('Recording started',);
  };
  
  // Event listener for when recording stops
  mediaRecorder.onstop = function() {
    isMicrophoneListening = false;
    // console.log("mediaRecorder>>>>",mediaRecorder)
    // console.log('Recording stopped');
    console.timeEnd()
  };

  // Start recording
  // mediaRecorder.start();

  // // Stop recording after 5 seconds (for demonstration purposes)
  // setTimeout(() => {
  //   mediaRecorder.stop();
  // }, 5000);
})
// Check if the browser supports the MediaRecorder API
// if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//   navigator.mediaDevices.getUserMedia({ audio: true })
//     .then(function(stream) {
//       // Microphone is listening
//       console.log('Microphone is listening');

//       // Set up the MediaRecorder
//       const mediaRecorder = new MediaRecorder(stream);

//       console.log("mediaRecorder",mediaRecorder)
//       // Event listener for when recording starts
//       mediaRecorder.onstart = function() {
//         isMicrophoneListening = true;
//         console.log("mediaRecorder>>",mediaRecorder)
//         console.time()
//         console.log('Recording started',);
//       };
      
//       // Event listener for when recording stops
//       mediaRecorder.onstop = function() {
//         isMicrophoneListening = false;
//         console.log("mediaRecorder>>>>",mediaRecorder)
//         console.log('Recording stopped');
//         console.timeEnd()
//       };

//       // Start recording
//       mediaRecorder.start();

//       // Stop recording after 5 seconds (for demonstration purposes)
//       setTimeout(() => {
//         mediaRecorder.stop();
//       }, 5000);
//     })
//     .catch(function(error) {
//       // Microphone is not listening
//       console.error('Microphone is not listening', error);
//     });
// } else {
//   console.error('getUserMedia is not supported in this browser');
// }

let chat = [];
let message = {};
const removeBGCheckbox = document.querySelector('#removeBGCheckbox');


const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const transcriptionDiv = document.getElementById('transcription');
let recognition = new window.webkitSpeechRecognition();
// window.onload(
// );
startButton.addEventListener('click', () => {
  recognition.start();
  // console.log('Recognition started');
});

stopButton.addEventListener('click', () => {
  recognition.stop();
  // console.log('Recognition stopped');
});

recognition.onresult = (event) => {
  const result = event.results[event.results.length - 1];
  const transcript = result[0].transcript;
  // console.log("tanscript",transcript)
  // transcriptionDiv.textContent = transcript;
  talkHandler(transcript)
};
// if(transcript){
//   talkHandler(transcript)
// }

'use strict';

const heygen_API = {
apiKey: 'NDZmODZjZjExYzVlNDBmMDhlMmUxN2U0Njk0NTE3ZTYtMTcxMjMwMTQ2NQ==',
serverUrl: 'https://api.heygen.com',
};


const statusElement = document.querySelector('#status');
const apiKey = heygen_API.apiKey;
const SERVER_URL = heygen_API.serverUrl;
async function checkStatus(){
  const response = await fetch(`${SERVER_URL}/v1/streaming.list `, {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': apiKey,
    },
    });
    const respData = await response.json();
    if(respData.data.sessions.length > 0){
      console.log("sessionisactive",respData.data)
      stopSession(respData.data.sessions[0].session_id)
      createNewSession()
      // repeat(respData.data.sessions[0].session_id, introMsg)
    }else{
      // console.log("sessionisnotactive")
      createNewSession()
      // repeat(respData.data.sessions[0].session_id, introMsg)
    }
}
// checkStatus()
if (apiKey === 'YourApiKey' || SERVER_URL === '') {
alert('Please enter your API key and server URL in the api.json file');
}

let sessionInfo = null;
let peerConnection = null;

function updateStatus(statusElement, message) {
statusElement.innerHTML += message + '<br>';
statusElement.scrollTop = statusElement.scrollHeight;
}

// console.log(statusElement, 'Please click the new button to create the stream first.');

function onMessage(event) {
const message = event.data;
// console.log('Received message:', message);
}

// Create a new WebRTC session when clicking the "New" button
async function createNewSession() {
// console.log(statusElement, 'Creating new session... please wait');

const avatar = "Anna_public_3_20240108";
const voice = "";

// call the new interface to get the server's offer SDP and ICE server to create a new RTCPeerConnection
sessionInfo = await newSession('high', avatar, voice);
// if(sessionInfo){

// }
const { sdp: serverSdp, ice_servers2: iceServers } = sessionInfo;
peerConnection = new RTCPeerConnection({ iceServers: iceServers });

// When audio and video streams are received, display them in the video element
peerConnection.ontrack = (event) => {
// console.log('Received the track');
if (event.track.kind === 'audio' || event.track.kind === 'video') {
mediaElement.srcObject = event.streams[0];
// document.getElementById('mediaElement').removeAttribute("muted");
// document.getElementById('mediaElement').removeAttribute("controls");
}
};

// When receiving a message, display it in the status element
peerConnection.ondatachannel = (event) => {
const dataChannel = event.channel;
dataChannel.onmessage = onMessage;
};

// Set server's SDP as remote description
const remoteDescription = new RTCSessionDescription(serverSdp);
await peerConnection.setRemoteDescription(remoteDescription);

// console.log(statusElement, 'Session creation completed');
// console.log(statusElement, 'Now.You can click the start button to start the stream');
startAndDisplaySession();

// Create a new RTCPeerConnection
}

// Start session and display audio and video when clicking the "Start" button
async function startAndDisplaySession() {
// if (!sessionInfo) {
// console.log(statusElement, 'Please create a connection first');
// return;
// }

// console.log(statusElement, 'Starting session... please wait');

// Create and set local SDP description
const localDescription = await peerConnection.createAnswer();
await peerConnection.setLocalDescription(localDescription);

// When ICE candidate is available, send to the server
peerConnection.onicecandidate = ({ candidate }) => {
// console.log('Received ICE candidate:', candidate);
if (candidate) {
handleICE(sessionInfo.session_id, candidate.toJSON());
}

};

// When ICE connection state changes, display the new state
// peerConnection.oniceconnectionstatechange = (event) => {
// console.log(
// statusElement,
// `ICE connection state changed to: ${peerConnection.iceConnectionState}`,
// );
// };



// Start session
await startSession(sessionInfo.session_id, localDescription);
document.body.addEventListener('mousemove', () => {
  const isChecked = true; // status after click

  // if (isChecked && !sessionInfo) {
  //   // console.log(statusElement, 'Please create a connection first');
  //   removeBGCheckbox.checked = false;
  //   return;
  // }

  // if (isChecked && !mediaCanPlay) {
  //   // console.log(statusElement, 'Please wait for the video to load');
  //   removeBGCheckbox.checked = false;
  //   return;
  // }

  if (isChecked) {
    hideElement(mediaElement);
    showElement(canvasElement);

    renderCanvas();
  } else {
    hideElement(canvasElement);
    showElement(mediaElement);

    renderID++;
  }
});
// console.log(statusElement, 'Session started successfully');
}

// const taskInput = document.querySelector('#taskInput');

// When clicking the "Send Task" button, get the content from the input field, then send the tas
async function repeatHandler() {
// if (!sessionInfo) {
// console.log(statusElement, 'Please create a connection first');

// return;
// }
// console.log(statusElement, 'Sending task... please wait');
const text = taskInput.value;
if (text.trim() === '') {
alert('Please enter a task');
return;
}

const resp = await repeat(sessionInfo.session_id, text);

// console.log(statusElement, 'Task sent successfully');
}

async function talkHandler(message) {
// console.log("message",message)

// if (!sessionInfo) {
// console.log(statusElement, 'Please create a connection first');
// return;
// }
const prompt = message; // Using the same input for simplicity
if (prompt.trim() === '') {
alert('Please enter a prompt for the LLM');
return;
}

// console.log(statusElement, 'Talking to LLM... please wait',prompt);

try {
const text = await talkToOpenAI(prompt)
// console.log("text received from openAI>>",text);

if (text) {
// Send the AI's response to Heygen's streaming.task API
const resp = await repeat(sessionInfo.session_id, text);
// console.log(statusElement, 'LLM response sent successfully',resp);
} else {
// console.log(statusElement, 'Failed to get a response from AI');
}
} catch (error) {
// console.error('Error talking to AI:', error);
// console.log(statusElement, 'Error talking to AI');
}
}


// when clicking the "Close" button, close the connection
async function closeConnectionHandler() {
if (!sessionInfo) {
// console.log(statusElement, 'Please create a connection first');
return;
}

renderID++;
hideElement(canvasElement);
hideElement(bgCheckboxWrap);
mediaCanPlay = false;

// console.log(statusElement, 'Closing connection... please wait');
try {
// Close local connection
peerConnection.close();
// Call the close interface
const resp = await stopSession(sessionInfo.session_id);

console.log(resp);
} catch (err) {
// console.error('Failed to close the connection:', err);
}
// console.log(statusElement, 'Connection closed successfully');
}

// document.querySelector('#newBtn').addEventListener('click', createNewSession);
// document.querySelector('#startBtn').addEventListener('click', startAndDisplaySession);
// document.querySelector('#repeatBtn').addEventListener('click', repeatHandler);
// document.querySelector('#closeBtn').addEventListener('click', closeConnectionHandler);
// document.querySelector('#talkBtn').addEventListener('click', talkHandler);


// new session
async function newSession(quality, avatar_name, voice_id) {
const response = await fetch(`${SERVER_URL}/v1/streaming.new`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'X-Api-Key': apiKey,
},
body: JSON.stringify({
quality,
avatar_name,
voice: {
  voice_id: voice_id,
},
}),
});
if (response.status === 500) {
// console.error('Server error');
// console.log(
// statusElement,
// 'Server Error. Please ask the staff if the service has been turned on',
// );

throw new Error('Server error');
} else {
const data = await response.json();
console.log(data);
return data.data;
}
}

// start the session
async function startSession(session_id, sdp) {
const introMsg ="Greetings! I'm your friendly Chatbot on Type 1 Diabetes. Please note that I cannot provide medical advice. Refrain from sharing any medical details and promptly notify your healthcare provider of any issues or adverse events. Rest assured, any handling of personal information adheres to applicable data protection laws."
const response = await fetch(`${SERVER_URL}/v1/streaming.start`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'X-Api-Key': apiKey,
},
body: JSON.stringify({ session_id, sdp }),
});
if (response.status === 500) {
// console.error('Server error');
// console.log(
// statusElement,
// 'Server Error. Please ask the staff if the service has been turned on',
// );
throw new Error('Server error');
} else {
const data = await response.json();
setTimeout(() => {  repeat(session_id, introMsg) }, 2000);


let paragraphBot = document.createElement("p");
paragraphBot.style = " color: #fff; background-color: #45a049; padding: 5px 10px;  text-align: left; width: fit-content;  border-radius: 8px; max-width: 70%; margin-left: 10px; margin-bottom: 10px;"
paragraphBot.textContent = introMsg;
chatDiv.appendChild(paragraphBot);
return data.data;
}
}

// submit the ICE candidate
async function handleICE(session_id, candidate) {
const response = await fetch(`${SERVER_URL}/v1/streaming.ice`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'X-Api-Key': apiKey,
},
body: JSON.stringify({ session_id, candidate }),
});
if (response.status === 500) {
// console.error('Server error');
// console.log(
// statusElement,
// 'Server Error. Please ask the staff if the service has been turned on',
// );
throw new Error('Server error');
} else {
const data = await response.json();
return data;
}
}

async function talkToOpenAI(prompt) {
message = {isBot: false, message:prompt};
chat = [...chat, message];
let paragraphUser = document.createElement("p");
paragraphUser.style = " background-color: #189bff; padding: 5px 10px; margin: 3px; text-align: right; width: fit-content; color: #fff; border-radius: 8px; margin-bottom: 10px; max-width: 70%; margin-left: auto; margin-right: 10px;"
paragraphUser.textContent = prompt;
chatDiv.appendChild(paragraphUser);
// console.log("prompt",prompt)
const oRequest = {
  "communityId": "9598053624643d8c9541947dab91ced6",
  "fromNumber": "9999999999999999999",
  "text":prompt
}
const response = await fetch(`https://uatv1.imonitorplus.com/service_redis/v2.0/socialChannel/sendResponse`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify(oRequest),
});


if (response.status === 500) {
    // console.error('Server error');
    // console.log(
    // statusElement,
    // 'Server Error. Please make sure to set the openai api key',
    // );
    throw new Error('Server error');
} else {
  // console.log("response", response)
  const responseData = await response.json();
  // console.log("responseData",responseData)
  // message = {isBot: true, message:data.data};
  // chat = [...chat, message];
  // let response = JSON.parse(data.data)
  let paragraphBot = document.createElement("p");
  paragraphBot.style = " color: #fff; background-color: #45a049; padding: 5px 10px;  text-align: left; width: fit-content;  border-radius: 8px; max-width: 70%; margin-left: 10px; margin-bottom: 10px;"
  paragraphBot.textContent = responseData.data.data;
  chatDiv.appendChild(paragraphBot);
  // console.log("chat",chat)
  return responseData.data.data;
}
}

// repeat the text
async function repeat(session_id, text) {
const response = await fetch(`${SERVER_URL}/v1/streaming.task`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'X-Api-Key': apiKey,
},
body: JSON.stringify({ session_id, text }),
});
const data = await response.json();
if (response.status === 400) {
  console.log(data.message)
// console.error('Server error');
// console.log(
// statusElement,
// 'Server Error. Please ask the staff if the service has been turned on',
// );
throw new Error('Server error');
} else {
// console.log("data.data",data.data)
return data.data;
}
}

// stop session
async function stopSession(session_id) {
  console.log(session_id)
const response = await fetch(`${SERVER_URL}/v1/streaming.stop`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': apiKey,
  },
  body: JSON.stringify({ session_id }),
});
const data = await response.json();
// console.log("response",data)
if (response.status === 500) {
// console.error('Server error');
// console.log(statusElement, 'Server Error. Please ask the staff for help');
throw new Error('Server error');
} else {
return data.data;
}
}



let renderID = 0;
function renderCanvas() {
// if (!removeBGCheckbox.checked) return;
hideElement(mediaElement);
showElement(canvasElement);
// document.getElementById('mediaElement').removeAttribute("muted");
canvasElement.classList.add('show');

const curRenderID = Math.trunc(Math.random() * 1000000000);
renderID = curRenderID;

const ctx = canvasElement.getContext('2d', { willReadFrequently: true });
if (bgInput.value) {
canvasElement.parentElement.style.background = bgInput.value?.trim();
}

function processFrame() {
// if (!removeBGCheckbox.checked) return;
if (curRenderID !== renderID) return;

canvasElement.width = mediaElement.videoWidth;
canvasElement.height = mediaElement.videoHeight;

ctx.drawImage(mediaElement, 0, 0, canvasElement.width, canvasElement.height);
ctx.getContextAttributes().willReadFrequently = true;
const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
const data = imageData.data;

for (let i = 0; i < data.length; i += 4) {
const red = data[i];
const green = data[i + 1];
const blue = data[i + 2];

// You can implement your own logic here
if (isCloseToGreen([red, green, blue])) {
  // if (isCloseToGray([red, green, blue])) {
  data[i + 3] = 0;
}
}

ctx.putImageData(imageData, 0, 0);

requestAnimationFrame(processFrame);
}

processFrame();
}

function isCloseToGreen(color) {
const [red, green, blue] = color;
return green > 90 && red < 90 && blue < 90;
}

function hideElement(element) {
element.classList.add('hide');
element.classList.remove('show');
}
function showElement(element) {
element.classList.add('show');
element.classList.remove('hide');
}

const mediaElement = document.querySelector('#mediaElement');
let mediaCanPlay = false;
mediaElement.onloadedmetadata = () => {
mediaCanPlay = true;
mediaElement.removeAttribute("muted")
document.body.addEventListener("mousemove", function () {
  // audio.play()
})
mediaElement.play();
renderCanvas();
// document.getElementById('mediaElement').removeAttribute("muted");
// document.getElementById('mediaElement').removeAttribute("controls");
// showElement(bgCheckboxWrap);
};
const canvasElement = document.querySelector('#canvasElement');

// const bgCheckboxWrap = document.querySelector('#bgCheckboxWrap');
const bgInput = document.querySelector('#bgInput');
canvasElement.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
}
});
window.addEventListener("DOMContentLoaded", checkStatus()); 
// document.ready()