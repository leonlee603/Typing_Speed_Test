const testWrapper = document.querySelector(".test-wrapper");
const textToTest = document.querySelector("#origin-text p"); // Text for user to follow.
const testArea = document.querySelector("#test-area");
const theTimer = document.querySelector(".timer");
const resetButton = document.querySelector("#reset");
var timer = [0, 0, 0, 0]; // [mins, seconds, 1/100seconds, 1/1000seconds]
var timerInterval; // Set a variable to clear the interval for timer function.
var startTimer = false; // Set a flag to make sure the timer won't run again until after reset.

// Generate a random text from data.json when the page is loaded.

function generateText() {
    var textToTest = document.querySelector("#origin-text p"); // Text for user to follow.
    var request;
    // Check if browse support XMLHTTPrequest. 
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    // Open the connection with the json file.
    request.open("GET", "json/data.json");
    // Retrieve the data from json when XMLHTTPrequest is ready.
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            var response = JSON.parse(request.responseText);
            // Generate a random number based on the data length as the index of array item.
            var randomNum = Math.floor(Math.random() * response.length);
            textToTest.innerHTML = response[randomNum].quote;
        }
    }
    request.send();
}
generateText();

// Start the timer when user start typing.
function start() {
    let textEnteredLength = testArea.value.length;
    if (textEnteredLength === 0 && startTimer == false) {
        timerInterval = setInterval(runTimer, 10); //run every (1/100)second.
        startTimer = true;
    }
}

// Format the time shown to double digit.
function doubleDigit(timeElement) {
    if (timeElement < 10) {
        timeElement = ("0" + timeElement);
    }
    return timeElement;
}

// Display the timer.
function runTimer() {
    let currentTime = doubleDigit(timer[0]) + " : " + doubleDigit(timer[1]) + " : " + doubleDigit(timer[2]);
    theTimer.innerHTML = currentTime;
    timer[3]++;
    timer[0] = Math.floor(timer[3]/6000); // 1 min = (1/100)s x 6000
    timer[1] = Math.floor(timer[3]/100) - (timer[0] * 60); // 1 second = (1/100)s x 100. Reset 60s to 0 by subtract how many min is passed.
    timer[2] = Math.floor((timer[3]) - (timer[0] * 6000) - (timer[1] * 100));
}


// Check the user's input with the text.
function spellCheck() {
    let textEntered = testArea.value;
    let partialTextToCheck = textToTest.innerHTML.substring(0, textEntered.length);
    if (textEntered === textToTest.innerHTML) {
        testWrapper.setAttribute("style", "border-color: #74c69d"); // Alert user when they finish typing.
        clearInterval(timerInterval);
        // Calculate the word per minute and display to the user.
        let totalTime = (timer[3] / 100); // Total time in seconds.
        let totalWords = textToTest.innerHTML.split(" ").length; 
        let wpm = Math.round(((totalWords / totalTime) * 60).toFixed(2));
        textToTest.innerHTML = "Your typing speed is :" + wpm + " WPM";

    } else {
        if (textEntered === partialTextToCheck) {
            testWrapper.setAttribute("style", "border-color: #aed9e0"); // Alert user they are typing correctly so far.
        } else {
            testWrapper.setAttribute("style", "border-color: #ffa69e"); // Alert user when they typed something wrong.
        }
    }
}

// Function to reset to initial state.
function reset() {
    clearInterval(timerInterval);
    timerInterval = null;
    testArea.value = "";
    startTimer = false;
    timer = [0, 0, 0, 0];
    theTimer.innerHTML = "00 : 00 : 00";
    testWrapper.setAttribute("style", "border-color: #adb5bd");
}

// Event listeners
testArea.addEventListener("keypress", start, false);
testArea.addEventListener("keyup", spellCheck, false);
resetButton.addEventListener("click", reset, false);
resetButton.addEventListener("click", generateText, false);