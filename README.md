# fab-project2-ka-js
420-320-DW JavaScript - Project 2 Speed Reader
Created by Kristina Amend & Juan-Carlos Sreng-Flores

A simple implementation of a speed reader that display quotes from popular Parks & Recreation character Ron Swanson.

The user can adjust the words per minute speed (defaults at 100) and select START/STOP to get the next quote. 
The quotes are fetched randomly from an API that returns a single JSON. 
Quotes are displayed one word at a time, with each focus letter in red (which is dependant on the words length).
Note: the WPM speed can only be adjusted by pressing STOP and START again.

More about speed reading: Displaying the words at a variable speed and fixating on a specific character triggers the brain to recognize that word quickly. This eliminates internally speaking the words and not having to move our eyes as we read, therefore increasing one's ability to speed read!

Ron Swanson quotes API source: https://ron-swanson-quotes.herokuapp.com/v2/quotes