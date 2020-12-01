"use strict";
/**
 * A simple implementation of a speed reader that display quotes word by word, at a variable speed
 * Quotes are retrieved from an API and displayed in the HTML
 * The user can adjust the words per minute speed and select START to display each quote and STOP to stop
 * @author Kristina Amend
 * @author Juan-Carlos Sreng-Flores
 * @version 2020-11
 */
let globals = {} // define global object to store variables
document.addEventListener('DOMContentLoaded', setup)
/**
 * Initializes global variables once the DOM is loaded and updates the WPM speed from local storage (default is 100)
 * Adds event listeners for numerical input change and for the START/STOP button
 * On load the speed reader is the on stop state, user must select start to display quote(s)
 * @author Kristina Amend
 * @author Juan-Carlos Sreng-Flores
 * @return {void} - Does not return any value.
 */
function setup() {
    globals.startState = true; // application starts in the stop state (button start state is true / "START" on load)
    globals.currentWPMValue = localStorage.getItem('wpmCount'); // sets global variable to current local storage
    globals.beforeFocus = document.querySelector('#beforeFocus'); //beforeFocus span element.
    globals.focusChar = document.querySelector('#focusChar'); //focusCharacter.
    globals.afterFocus = document.querySelector('#afterFocus'); //afterFocus character.
    globals.userWPMInput = document.querySelector('#wpmCount'); // input value the user selected
    globals.userWPMInput.addEventListener('input', updateLocalStorage); // event fired when user changes number
    globals.userWPMInput.addEventListener('focusout', loadLocalStorage); //event fired when the user removes mouse from 
    if (globals.currentWPMValue != null) { // check if there is anything in localStorage to retrieve 
        loadLocalStorage();
    }
    else{
        document.querySelector('#wpmCount').value = "100"; // set the default value to 100 if nothing in local storage
    }
    globals.startStopBtn = document.querySelector('#stop_start');
    globals.startStopBtn.addEventListener('click', startStop); // sets up event listener for start/stop button
}
/**
 * Reads from local storage when the page loads, and initializes the global WPM count variable
 * @author Kristina Amend
 * @return {void} - Does not return any value.
 */
function loadLocalStorage() {
    globals.currentWPMValue = JSON.parse(localStorage.getItem('wpmCount')); // parse the data from storage
    globals.userWPMInput.value = globals.currentWPMValue; // set the input number value from local storage
}
/**
 * Stringifys the global variable (numerical user input) and updates the local storage
 * @author Kristina Amend
 * @return {void} - Does not return any value.
 */
function updateLocalStorage(e) { 
    //causes the user to not be able to exceed the boundaries. Fixes the number if it does not conform the data.
    if(globals.userWPMInput.value >= 50 && globals.userWPMInput.value <= 1000) {
        localStorage.setItem('wpmCount', JSON.stringify(roundFifty(globals.userWPMInput.value)));
    }
    else if(globals.userWPMInput.value < 50) {
        localStorage.setItem('wpmCount', JSON.stringify(50));
    }
    else{
        localStorage.setItem('wpmCount', JSON.stringify(1000));
    }
   
}
/**
 * @author Juan-Carlos Sreng-Flores
 * @param {Number} n number to be rounded.
 * @return {Number} rounded closest to % of fifty.
 */
function roundFifty(n) {
    let lowerbound = n - n%50;
    let upperbound = lowerbound + 50;
    if(n-lowerbound>upperbound-n) {
        return upperbound;
    }
    else {
        return lowerbound;
    }
}
/**
 * function that is triggered by the button event listener
 * when button is in start state getNext() is called to get the next quote
 * when button is in stop state the global interval id is cleared
 * @author Kristina Amend
 * @author Juan-Carlos Sreng-Flores
 * @return {void} - Does not return any value.
 */
function startStop() {
    loadLocalStorage(); //If the user inputted a bad input, the older valid input will appear.
    if (globals.startState) {
        getNext();
        globals.startStopBtn.textContent = "STOP";
        globals.startState = false;
    }
    else {
        window.clearInterval(globals.intervalID);
        globals.startStopBtn.textContent = "START";
        globals.startState = true;
    }
}
/**
 * fetches a random quote from the Ron Swanson API
 * invokes strSplitter to split the quote in words
 * invokes displayQuote which passes the resulting split[]
 * Catches and displays any errors to the console
 * @author Kristina Amend
 * @param {Event} e any event
 * @return {void} - Does not return any value.
 */
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
        .then(json => displayQuote(strSplitter(json))) // if response is ok invoke strSplitter which returns a split []
        .catch(e => console.log(e.message + " You broke Ron Swanson's spirit")); // catch the error and display it
}
/**
 * Separates the quote string into an array of words
 * @author Juan-Carlos Sreng-Flores
 * @param {JSON} json - JSON object fetched from web API.
 * @return {Array} - Returns a string array splitted by white spaces. 
 */
function strSplitter(json) {
    return json[0].split(" "); // splits sentence on whitespace
}
/**
 * Display quote is a function set up to loop through the quote given asynchronously.
 * It uses setInterval to loop, and uses the word per minute value from the global variable 
 * userWPMInput. 
 * The interval is calculated from 60000 miliseconds divided by the number of words, making 
 * an interval value that will display the quote at each interval.
 * To display the word is uses the method displayWord(String).
 * @author Juan-Carlos Sreng-Flores
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
 * This function displays the word into the website with specific format.
 * length = 1 => 1st letter         e.g.: ____|a| or 4 spaces before
 * length = 2-5 => 2nd letter       e.g.: ___f|o|ur or 3 spaces before
 *                                  e.g.: ___l|a|tch or 3 spaces before
 * length = 6-9 => third letter     e.g.: __em|b|assy 2 spaces
 * length = 10-13 => fourth letter  e.g.: _pla|y|ground 1 spaces
 * length >13 => fifth letter       e.g.: ackn|o|wledgement no spaces
 * Where the letters before the | are to be put into the first span, the letter between
 * the | is to be put into the second span, and the letters after the | is to be put into
 * the third span.
 * Depending on the size of the word, some space will be added for padding.
 * @author Juan-Carlos Sreng-Flores
 * @param {String} word - Word to be displayed with specified format.
 * @return {void} - Only displays the word into the html element.
*/
function displayWord(word) {
    //console.log(word); //Test if it works! to be removed later.    
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