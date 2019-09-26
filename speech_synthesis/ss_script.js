var supportMsg = document.getElementById('msg');

eventList = ['start', 'end', 'pause', 'resume'];
errorEventList = ['error'];

var progress = document.getElementById('progress');
function log(msg, clear) {
  console.log(msg);
  if(clear)
      progress.innerHTML = "";
  progress.innerHTML = progress.innerHTML + "<br>" + msg;
}

if ('speechSynthesis' in window) {
  console.log("supports");
	supportMsg.innerHTML = 'Your browser <strong>supports</strong> speech synthesis.';
} else {
  console.log("doesn't support");
	supportMsg.innerHTML = 'Sorry your browser <strong>does not support</strong> speech synthesis.<br>Try this in <a href="https://www.google.co.uk/intl/en/chrome/browser/canary.html">Chrome Canary</a>.';
	supportMsg.classList.add('not-supported');
}

var voicesBtn = document.getElementById('getvoices');
var speechMsgInput = document.getElementById('speech-msg');
var voiceSelect = document.getElementById('voice');
var volumeInput = document.getElementById('volume');
var rateInput = document.getElementById('rate');
var speakBtn = document.getElementById('speak');
var pauseBtn = document.getElementById('pause');
var resumeBtn = document.getElementById('resume');
var cancelBtn = document.getElementById('cancel');

// Fetch the list of voices and populate the voice options.
function loadVoices() {
  console.log("loading voices");
  // Fetch the available voices.
	var voices = speechSynthesis.getVoices();
  
  // Loop through each of the voices.
	voices.forEach(function(voice, i) {
    // Create a new option element.
		var option = document.createElement('option');
    
    // Set the options value and text.
		option.value = voice.name;
		option.innerHTML = voice.name;
    option.disabled = true;
		  
    // Add the option to the voice selector.
		voiceSelect.appendChild(option);
	});
}

// Execute loadVoices.
//loadVoices();
// Chrome loads voices asynchronously.
window.speechSynthesis.onvoiceschanged = function(e) {
  loadVoices();
};
voicesBtn.addEventListener('click', loadVoices);

function speak(text) {
    var msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.volume = parseFloat(volumeInput.value);
    msg.rate = parseFloat(rateInput.value);

    eventList.forEach((event) => {
            msg.addEventListener(event, (speechSynthesisEvent) => {
                    log("Got " + speechSynthesisEvent.type + " Event");
                    });
            });
    errorEventList.forEach((event) => {
            msg.addEventListener(event, (speechSynthesisErrorEvent) => {
                    log("Got Error Event : " + speechSynthesisErrorEvent.error);
                    });
            });

    if (voiceSelect.value) {
        msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == voiceSelect.value; })[0];
    }

    if(!window.speechSynthesis.pending)
        progress.innerHTML = "";
    window.speechSynthesis.speak(msg);
}

speakBtn.addEventListener('click', function(e) {
	if (speechMsgInput.value.length > 0) {
		speak(speechMsgInput.value);
	} else {
        log("Empty Input", true);
    }
});

pauseBtn.addEventListener('click', function(e) {
  if(window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  } else {
    log("No speech is in progress");
  }
})

resumeBtn.addEventListener('click', function(e) {
    if(window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  } else {
    log("No speech is in paused");
  }
})

cancelBtn.addEventListener('click', function(e) {
  if(window.speechSynthesis.speaking || window.speechSynthesis.paused) {
    window.speechSynthesis.cancel();
  } else {
    log("No speech is in progress");
  }
})

