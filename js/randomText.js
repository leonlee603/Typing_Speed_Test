// The function will generate a random quote from data.json by sending AJAX request.
// Function is separated as a module and import into the main script for the testing page. 

export function generateText() {
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