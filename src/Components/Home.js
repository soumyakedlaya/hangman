import React, { Component } from 'react';
import AppHeader from './AppHeader';
import Slider, { Range } from 'rc-slider';
import Spinner from 'react-spinner-material';
import 'rc-slider/assets/index.css';
import './Home.css';
import getData from '../util/callServer';

//coordinates for hangman figure
const bodyPartsObj = {
  head: <circle cx="320" cy="190" r="40" fill="darkslategray"/>,
  body: <line x1="320" y1="190" x2="320" y2="360"  style={{fill:'none',stroke:'darkslategray',strokeWidth:2}}/>,
  leftArm: <line x1="320" y1="260" x2="250" y2="230" style={{fill:'none',stroke:'darkslategray',strokeWidth:2}}/>,
  rightArm: <line x1="320" y1="260" x2="390" y2="230" style={{fill:'none',stroke:'darkslategray',strokeWidth:2}}/>,
  leftLeg: <line x1="320" y1="360" x2="250" y2="450" style={{fill:'none',stroke:'darkslategray',strokeWidth:2}}/>,
  rightLeg: <line x1="320" y1="360" x2="390" y2="450" style={{fill:'none',stroke:'darkslategray',strokeWidth:2}}/>
}

var difficultyLevel = 1;

class Home extends Component {
  constructor(){
    super();
    this.state = this.getInitialState();
    this.validateInput = this.validateInput.bind(this);
  }

//initialize state variables and return to caller in constructor
  getInitialState(){
    const initialState = {
      randomSelectedWord: '',
      guessedCharacter: '',
      successItems: [],
      errorItems: [],
      numGuesses: 6,
      gameOver: false,
      wordGuessed: false,
      bodyParts: [],
      spinnerVisible: false,
      difficulty: difficultyLevel,
      topScores: []
    };
    return initialState;
  }

//sets spinner visibilty to true as the API is being called.
//call getData function in callServer.js with the url containing user's chosen difficulty level
  getRandomWord(difficultyLevel){
    this.state.successItems = []; //reset blanks
    this.setState({spinnerVisible: true});
    const url = 'getWords?difficulty=' + difficultyLevel
    getData(url, this.randomWordSuccess, this.randomWordFailure )
  }

//getData success callback function. The data is a string. Split the string at each newline character and store in an array.
//get a random index. split the word at the random index at each character and create an array with '_' for each character. Update state variables.
  randomWordSuccess = (data) => {
    var allWords = data.words.split("\n");

    var min = 0;
    var max = allWords.length;

    var randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;

    allWords[randomIndex].split('').map((item) =>
      this.state.successItems.push('_'));
    this.setState({randomSelectedWord: allWords[randomIndex], successItems: this.state.successItems, spinnerVisible: false});
  }

  randomWordFailure = (err) => {
    console.log(err);
  }

//call getData function in callServer.js with the url '/getScores'
  getScores() {
    this.setState({spinnerVisible: true});
    const url = 'getScores';
    getData(url, this.getScoresSuccess, this.getScoresFailure )
  }

//getScrores success callback function - sets topScores in state to the scores returned from MySQL database.
  getScoresSuccess = (data) => {
    this.setState({topScores: data.scores});
  }

  getScoresFailure = (err) => {
    console.log(err)
  }

//lifecycle method that runs before page is rendered
  componentDidMount(){
    this.getRandomWord(this.state.difficulty);
    this.getScores();
  }

//converts character from user input to lowercase and checks if the character is not an alphabet.
//if there is a user input an it is an alphabet, map through the characters in the word that was randomly selected to find a character match to the user validateInput
//if there is a match, change the character from '_' to the user input character
//if the user input is an incorrect guess, push character into an array that stores incorrect guesses. Decrease number of guesses and call the function that draws a part of the hangman figure.
  validateInput(event){
    var value = event.target.value.toLowerCase();

    var nonLetters = value.match(/^[^a-zA-Z]+$/) ? true : false;

    if (value.length && !nonLetters) {
      var error = true;
      this.setState({guessedCharacter: value});
      this.state.randomSelectedWord.split('').map((item, index) => {
        if(item === value){
          this.state.successItems[index] = value;
          this.setState({successItems: this.state.successItems});
          error = false;
       }
      });

      if(error){
        if(!this.state.errorItems.includes(value)){
          this.state.errorItems.push(value);
          this.setState({errorItems: this.state.errorItems, numGuesses: --this.state.numGuesses});
        }
        this.drawBodyPart();
      }
      //if the array containing '_' initially does not contain an '_' after 6 guesses, set wordGuessed to true
      if(!this.state.successItems.includes('_')){
        this.setState({wordGuessed: true});
      }
      //set gameOver to true when number of guesses equals 0
      if(this.state.numGuesses === 0){
        this.setState({gameOver: true});
      }
    }
    else{
      this.setState({guessedCharacter: ''});
    }
  }

  //depending on the number of guesses, push a specific body part from the bodyPartsObj into an array that keeps track of the body parts that need to be rendered
  drawBodyPart() {
    switch (this.state.numGuesses) {
      case 5:
        this.state.bodyParts.push(bodyPartsObj.head);
        this.setState({bodyParts: this.state.bodyParts});
        break;
      case 4:
        this.state.bodyParts.push(bodyPartsObj.body);
        this.setState({bodyParts: this.state.bodyParts});
        break;
      case 3:
        this.state.bodyParts.push(bodyPartsObj.leftArm);
        this.setState({bodyParts: this.state.bodyParts});
        break;
      case 2:
        this.state.bodyParts.push(bodyPartsObj.rightArm);
        this.setState({bodyParts: this.state.bodyParts});
        break;
      case 1:
        this.state.bodyParts.push(bodyPartsObj.leftLeg);
        this.setState({bodyParts: this.state.bodyParts});
        break;
      case 0:
        this.state.bodyParts.push(bodyPartsObj.rightLeg);
        this.setState({bodyParts: this.state.bodyParts});
        break;
      default: break;

    }
  }

//sets difficulty level based on user input from the slider
  handleDifficultyChange(value){
    difficultyLevel = value;
    this.setState({difficulty: difficultyLevel});
    this.getRandomWord(value);
  }

//try again button handler. Calls functions that reset state, get a new random word and get latest top scores
  handleButtonClick(){
    this.setState(this.getInitialState());
    this.getRandomWord(this.state.difficulty);
    this.getScores();
  }

  render() {
    var successChar;
    var errorChar;
    var displayMessage;
    var tryAgainButton;

  //maps through each element in top scores array and displays the username and score in a table
    var topScores = this.state.topScores.map((item) => {
      return (
        <tr id="leader-content">
          <td className="center">{item.username}</td>
          <td className="center" id="leader-score">{item.score}</td>
        </tr>
      )
    })

    //replaces '_' with successful user input character match and displays the character
    if(this.state.successItems.length){
      successChar = this.state.successItems.map(item => {
        return (
          <span className="success-char">{item}</span>
        );
      })
    }

    //displays incorrect user input characters
    if(this.state.errorItems){
      errorChar = this.state.errorItems.map(item => {
        return (
          <span className="error-char">{item}</span>
        );
      })
    }

    //if the user guesses the word, display you win message and play again button
    if(this.state.wordGuessed){
      displayMessage = <p className="display-message" id="win-message">You Win!</p>
      tryAgainButton = <button className="try-again" onClick={() => this.handleButtonClick()}>Play Again!</button>
    }
    //if the user does not guess the word, display you lose message and try again button
    else if(this.state.gameOver){
      displayMessage = <p className="display-message" id="lose-message">You Lose! The word is {this.state.randomSelectedWord}</p>
      tryAgainButton = <button className="try-again" onClick={() => this.handleButtonClick()}>Try Again!</button>
    }
    //display number of guesses left until either the user gueses the word or runs out of guesses
    else{
      displayMessage = <p className="display-message">Number of guesses left: {this.state.numGuesses} </p>
    }

    //renders HTML elements
    return (
      <div className="App">
        <div id="game-container">
          <svg width="450" height="700">
            <polyline id="hangman-structure" points="400,530 100,530 150,530 150,100 320,100 320,150"/>
            {this.state.bodyParts}
          </svg>
          <div id="middle-content">
            <AppHeader />
            <div id="error-wrapper">
              <p id="letters-title">Incorrect Letters Guessed</p>
              <div id="error-box">
                {errorChar}
              </div>
            </div>
            <div>
              <p className="center">Slide to change the difficulty level:</p>
              <Slider min={1} max={10} step={1} marks={{1:"1", 2:"2", 3:"3", 4:"4", 5:"5", 6:"6", 7:"7", 8:"8", 9:"9", 10:"10"}} onChange= {(value) => this.handleDifficultyChange(value)}/>
            </div>
            <div id="word-container">
              {successChar}
              {displayMessage}
              <div id="guess-box">
                <div id="spinner-container">
                  <Spinner size={50} spinnerColor={"black"} spinnerWidth={5} visible={this.state.spinnerVisible}/>
                </div>
                <input id="guess-input" type= "text" value={this.state.guessedCharacter} placeholder="Guess a letter!" maxLength="1" disabled={this.state.gameOver} onChange={this.validateInput.bind(this)}/>
              </div>
            </div>
            {tryAgainButton}
          </div>
          <div id="leaderboard">
            <p id="leaderboard-title">Leaderboard</p>
            <table id="top-scores">
              <tr>
                <th className="top-score-column">Name</th>
                <th className="top-score-column">Score</th>
              </tr>
              {topScores}
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
