# Hangman

#Play Locally:
1. Clone or download the game repository
2. Run npm install in game directory
3. Install MySQL
  - Create database: hangman
  - Create table: user_scores (username varchar(35), score smallint)
  - Insert 6 or more values ex: insert into user_Scores values('Soumya',10)
4. Run npm start from terminal in game directory (runs development server)
5. Run node app.js in terminal simultaneously
6. Play game at localhost:3000

#Features:
- Ability to guess a letter. Checks for already guessed characters, backspace and non alphabet characters
- Display of top 5 scores and usernames from MySQL model
- 10 varying levels of difficulty
- Display of incorrect guesses and number of guesses left
- Ability to play again
- Hangman figure display that changes for each incorrectly guessed letters

#Implementation:

As I mentioned in my application, my future goals was to learn more about React.js. I chose to implement this game using React.js to work on my goals.
I was able to appreciate React's ability to automatically update and display upon state changes without reloading the entire page.

I came across the CORS issue when trying to access the API from the client. To resolve this issue, I created a backend Node server to make a server to server call.

In a lifecycle method, componentDidMount, a getRandomWord function is called. This function passes in a url (contains user selected difficulty level) to a function, which fetches the data from the API. Upon success, a random word is selected and the correct number of underscores is displayed. getScores is also called, which passes in a url to a function, which fetches the top 5 scores from a model in MySQL. Upon success, the top scores and usernames are displayed.

Users submit guesses in an input text field. The characters in the random selected word are searched for a match. If there is a match, the display at the correct position changes from an underscore to the correct character. If there isn't a match, the character is displayed in the incorrect guesses box, a body part is appended to the hangman figure, and the number of guesses decreases until 0 guesses left.

#Next Steps:
- Styles: for positioning, use relative styling, width and height percentages
- Make game responsive to different screen sizes
- Login function to keep track of real user and score (currently sample data)
- If more features are added to make a larger app, split app into components.
