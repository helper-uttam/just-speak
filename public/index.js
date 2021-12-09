  const startBtn = document.getElementsByClassName('start');
  const listenBtn = document.getElementsByClassName('listen');
  const resetBtn = document.getElementsByClassName('reset');
  const downloadBtn = document.getElementsByClassName('download');
  const saveBtn = document.getElementById('save');
  const sendBtn = document.getElementById('send')

  const title = document.getElementById('title');
  const inputTitle = document.getElementById('inputTitle');

  let userData = {
    newTitle : "",
    bodyOfNotes: ""
  };

  let titleOfPdf = "";
  function setTitle(){
    userData.newTitle = inputTitle.value.toString();
    title.innerText = inputTitle.value;
    console.log(inputTitle.value.toString());
  }
  function setBody(body){
    userData.bodyOfNotes = body.toString();
  }


  let text_area = document.getElementById("text_area");
  text_area.addEventListener('change',(e)=>{textValue.push(e.target.value);})

  //Global Variables
  let textValue = [];
  let stopIt = false;
  
//----------------------------- for speach recognition -------------------------------\\
    
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new window.SpeechRecognition();
  recognition.interimResults = true; //not wait for finshing talk
  
function speechToText(){
    recognition.addEventListener("result", (event) => {
    const text = Array.from(event.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join(" ");
          
      text_area.value = text;
      
      if (event.results[0].isFinal) {
        textValue.push(text_area.value);
        text_area.value = textValue.toString();
        console.log(textValue.toString());
      }
  });
  recognition.addEventListener("end", () => {
    if(!stopIt){
      text_area.value = textValue.toString();
      recognition.start();
      setBody(textValue);
    }
  });
}



/* --------------- text to speech-------------------------*/
const voiceList = document.querySelector("select");
let screenWidth = window.screen.width;
if(screenWidth < 480){
  voiceList.style.fontSize = "1rem";
  voiceList.style.width = (screenWidth - 10) +'px';
}else{
  voiceList.style.fontSize = "1.8rem";
}

function textToSpeech(unProcessedtext) {
  var msg = new SpeechSynthesisUtterance();
  msg.text = unProcessedtext;
  for (let voice of speechSynthesis.getVoices()) {
    if (voice.name == voiceList.value) {
      msg.voice = voice;
    }
  }
  speechSynthesis.speak(msg);
}


/*-------------------------making pdf from the input--------------------*/

function downloadNotes(notes){

}
 /* ------------------- saving data to database ----------------------------*/

const submitHandler = async (userData) => {

};
/*-----------------------------------------------handling button clicks----------------------*/

startBtn[0].addEventListener('click', ()=>{
  stopIt = false;
  recognition.start();
  speechToText();
});

listenBtn[0].addEventListener('click', ()=>{
  recognition.abort();
  stopIt = true;
  textToSpeech(textValue.toString());
});
resetBtn[0].addEventListener('click', ()=>{
  textValue = [];
  window.location.reload();
});

downloadBtn[0].addEventListener('click', ()=>{
  downloadNotes(textValue.toString());
});

saveBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  submitHandler(userData);
})




