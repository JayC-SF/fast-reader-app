"use strict";
/**
 * 
 * @author Kristina Amend
 * @author Juan-Carlos Sreng-Flores
 * @version 2020-11
 */
let globals = {} // define global object
document.addEventListener('DOMContentLoaded', setup)

/*setup function event listener for DOMContentLoaded:
-> Note this one is not suggested, it is required.
-> initializes any global variables. The application starts in the stop state.
-> checks if the local storage contains a word-per-minute speed and saves as a variable. If not, set it to 100.
If it does, update the input tag to reflect the speed
-> adds event listeners for the numeric input change event and for the start/stop button*/

function setup() {
    globals.startState = true; // application starts in the stop state (button start state is true / "START" on load)
    globals.currentWPMValue = localStorage.getItem('wpmCount'); // sets global variable to current local storage
    globals.beforeFocus = document.querySelector('#beforeFocus'); //beforeFocus span element.
    globals.focusChar = document.querySelector('#focusChar'); //focusCharacter.
    globals.afterFocus = document.querySelector('#afterFocus'); //afterFocus character.
    globals.userWPMInput = document.querySelector('#wpmCount'); // input value the user selected
    globals.userWPMInput.addEventListener('input', updateLocalStorage); // event fired when user changes number
    if (globals.currentWPMValue != null) { // check if there is anything in localStorage to retrieve 
        loadLocalStorage();
    }
    else{
        document.querySelector('#wpmCount').value = "100"; // set the default value to 100 if nothing in local storage
    }
    globals.startStopBtn = document.querySelector('#stop_start');
    globals.startStopBtn.addEventListener('click', startStop); // sets up event listener for start/stop button
}

function loadLocalStorage() { // reads from local storage when the page loads, and initializes the global WPM count varaible
    // parse the data in storage
    globals.currentWPMValue = JSON.parse(localStorage.getItem('wpmCount'));
    globals.userWPMInput.value = globals.currentWPMValue; // set the input number value from local storage
}
function updateLocalStorage() { // stringifys the global variable and updates the local storage
    localStorage.setItem('wpmCount', JSON.stringify(globals.userWPMInput.value));
}
/*startStop start/stop button event listener
-> if the button is in start state, invoke the get next quote function, change the state to start and change the button text to stop
-> if the button is in stop state, change the state to stop and change the button text to start. Clear the interval
(the interval identifier must be saved as a global variable)*/
function startStop() {
    if (globals.startState) {
        getNext();
        globals.startStopBtn.textContent = "STOP";
        globals.startState = false;
    }
    // *JS* can you double check my logic here...? the instructions are not clear / doesn't make sense to me based on how the button should work
    else {
        window.clearInterval(globals.intervalID);
        globals.startStopBtn.textContent = "START";
        globals.startState = true;
    }
}

/*getNext get next quote function
-> fetches a random quote from the Ron Swanson API https://ron-swanson-quotes.herokuapp.com/v2/quotes using the fetch API.
-> then invokes the string splitter function
-> then invokes the displayQuote function
-> in case of any error, write a message to console.log.*/
function getNext(e) {
    let url = "https://ron-swanson-quotes.herokuapp.com/v2/quotes";
    fetch(url).then(response => {
        if (!response.ok) {
            throw new Error('Error status code: ' + response.status);
        }
        else {
            return response.json();
        }
    })
        // option 1 ? .. don't use function at all, don't think she'll like this
        .then(json => displayQuote(strSplitter(json))) // if response is ok invoke strSplitter which returns a split []
        /* option 2 ? unnamed function --> not sure how to call displayQuote with unnamed function
        .then((json => function(){
            return JSON.stringify(json).split('\s')
        })*/
        /* option 3 ? use strSplitter function
        //.then(json => displayQuote(strSplitter(json))) */
        .catch(e => console.log(e + "You broke Ron Swanson's spirit")); // catch the error and display it
}
/**
    strSplitter string splitter function
    -> breaks the quote string into an array of tokens and returns the array. A token is a single word (including punctuation)
    separated by a space. Hint: look into the String split method. Note: this does not need to be a named function.
    @param {JSON} json - JSON object fetched from web API.
    @return {Array} - Returns a string array splitted by white spaces. 
*/
function strSplitter(json) {
    return json[0].split(" "); // splits sentence on whitespace
}
/**
 * displayQuote display quote function
 * takes the array of words as a parameter. It uses setInterval to help achieve the words-per-minute rate
 * (e.g., if the rate is 50 words per minute, the delay between words is 60000 ms/minute divided by 50 words/minute equals 1200 ms between words).
 * setInterval uses a display word function as callback.
 * @param {Array} quoteSplit - String array containing splitted words to be displayed.
 * @return {void} - this method simply executes the window.setInterval asynchronous function.
 */
function displayQuote(quoteSplit) {
    let interval = 60000/globals.userWPMInput.value; // calculates the words per minute
    // counter for interval
    let i = 0;
    //interval loop, calls display quote for specific index, uses modulo to not get index out of bounds.
    //interval variable sets the time between the words to be displayed.
    globals.intervalID = window.setInterval(() => {
        if(i<quoteSplit.length) {
            displayWord(quoteSplit[i]);
            i++;
        }
        else {
            window.clearInterval(globals.intervalID);
            if(!globals.startState) {
                globals.startState = true;
                startStop();
            }
        }
    }, interval);
    //console.log(quoteSplit); // making sure code reaches here!
}
/**
displayWord display word function
-> takes the array of words as a parameter, and uses a global variable (or a captured variable if you code this as an anonymous function
    closure within the displayQuote function) to keep track of the index of the word it needs to display
-> In order to display each word, choose a focus letter based off the length of the word and “center” the word around the focus letter
(not really centered, see algorithm below): see project instructions

-> This means you will be splitting up the word, with some letters in the before span, the focus letter in the span tag, and remaining
letters in the after span. Do NOT use innerHTML! Look at the String substring method.
-> after updating the DOM, increment the token counter. If you reach the end of the array, clearInterval. If you are not in a stop state,
ask for the next quote by invoking the quote fetching function.
    @param {String} word - Word to display when the user presses START.
    @return {void} - Only displays the word into the html element.
*/
function displayWord(word) {
    console.log(word); //Test if it works! to be removed later.    
    if(word.length <= 1) {
        //display 4 spaces before focus character.
        globals.beforeFocus.textContent = '    ';
        //display focus character.
        globals.focusChar.textContent = word; 
        //display nothing after focus character.
        globals.afterFocus.textContent = '';
    }
    else if(word.length <= 5) {
        //display 3 spaces and the first character before focus character.
        globals.beforeFocus.textContent = '   ' + word.charAt(0); 
        //display 2nd character of the word.
        globals.focusChar.textContent = word.charAt(1);
        //display from 3rd character to the end if there are any characters left.
        globals.afterFocus.textContent = word.substring(2);
    }
    else if(word.length <= 9) {
        //display 2 spaces and 1st && 2nd characters of the word.
        globals.beforeFocus.textContent = '  ' + word.substring(0,2);
        //display 3rd character as the focus character.
        globals.focusChar.textContent = word.charAt(2);
        //display rest of the word from 4th to the end.
        globals.afterFocus.textContent = word.substring(3);
    }
    else if(word.length <= 13) {
        //display 1 space and the first 3 characters.
        globals.beforeFocus.textContent = ' ' + word.substring(0,3);
        //display 4th character as focus character.
        globals.focusChar.textContent = word.charAt(3);
        //display from 5th character to the end.
        globals.afterFocus.textContent = word.substring(4);
    }
    else {
        //display no spaces and the first 4 characters.
        globals.beforeFocus.textContent = word.substring(0,4);
        //display 5th character as focus character.
        globals.focusChar.textContent = word.charAt(4);
        //display rest of the string from 6th character to the end.
        globals.afterFocus.textContent = word.substring(5);
    }
}