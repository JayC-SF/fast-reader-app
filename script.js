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
    globals.startStopBtn = document.querySelector('#stop_start');
    globals.startStopBtn.addEventListener('click', startStop);

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
        .then(json => displayQuote(JSON.stringify(json).split('\s'))) // if response is ok invoke strSplitter which returns a split []
        /* option 2 ? unnamed function --> not sure how to call displayQuote with unnamed function
        .then((json => function(){
            return JSON.stringify(json).split('\s')
        })*/
        /* option 3 ? use strSplitter function
        //.then(json => displayQuote(strSplitter(json))) */
        .catch(e => console.log(e + "You broke Ron Swanson's spirit")); // catch the error and display it
}
/*strSplitter string splitter function
-> breaks the quote string into an array of tokens and returns the array. A token is a single word (including punctuation)
separated by a space. Hint: look into the String split method. Note: this does not need to be a named function.*/

// use function or unnamed function?
function strSplitter(json) {
    return JSON.stringify(json).split('\s'); // splits sentence on whitespace
}
/*displayQuote display quote function
 takes the array of words as a parameter. It uses setInterval to help achieve the words-per-minute rate
(e.g., if the rate is 50 words per minute, the delay between words is 60000 ms/minute divided by 50 words/minute equals 1200 ms between words).
setInterval uses a display word function as callback.*/
function displayQuote(quoteSplit) {
    console.log(quoteSplit); // making sure code reaches here!
}
/*displayWord display word function
-> takes the array of words as a parameter, and uses a global variable (or a captured variable if you code this as an anonymous function
    closure within the displayQuote function) to keep track of the index of the word it needs to display
-> In order to display each word, choose a focus letter based off the length of the word and “center” the word around the focus letter
(not really centered, see algorithm below): see project instructions

-> This means you will be splitting up the word, with some letters in the before span, the focus letter in the span tag, and remaining
letters in the after span. Do NOT use innerHTML! Look at the String substring method.
-> after updating the DOM, increment the token counter. If you reach the end of the array, clearInterval. If you are not in a stop state,
ask for the next quote by invoking the quote fetching function.*/
function displayWord() {

}