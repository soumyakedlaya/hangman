import React, { Component } from 'react';
import AppHeader from './AppHeader';
import Slider, { Range } from 'rc-slider';
import Spinner from 'react-spinner-material';
import 'rc-slider/assets/index.css';
import './Home.css';
import getData from '../util/callServer';

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

  getRandomWord(difficultyLevel){
    this.state.successItems = [];
    this.setState({spinnerVisible: true});
    const url = 'getWords?difficulty=' + difficultyLevel
    getData(url, this.randomWordSuccess, this.randomWordFailure )
  }

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

  getScores() {
    this.setState({spinnerVisible: true});
    const url = 'getScores';
    getData(url, this.getScoresSuccess, this.getScoresFailure )
  }

  getScoresSuccess = (data) => {
    this.setState({topScores: data.scores});
  }

  getScoresFailure = (err) => {
    console.log(err)
  }

  componentDidMount(){
    this.getRandomWord(this.state.difficulty);
    this.getScores();
  }

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

      if(!this.state.successItems.includes('_')){
        this.setState({wordGuessed: true});
      }

      if(this.state.numGuesses === 0){
        this.setState({gameOver: true});
      }
    }
    else{
      this.setState({guessedCharacter: ''});
    }
  }

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

  handleDifficultyChange(value){
    difficultyLevel = value;
    this.setState({difficulty: difficultyLevel});
    this.getRandomWord(value);
  }

  handleButtonClick(){
    console.log("handleButtonClick()");
    this.setState(this.getInitialState());
    this.getRandomWord(this.state.difficulty);
    this.getScores();
  }

  render() {
    var successChar;
    var errorChar;
    var displayMessage;
    var tryAgainButton;

    console.log('topscores', this.state.topScores[0])
    var topScores = this.state.topScores.map((item) => {
      return (
        <tr id="leader-content">
          <td className="center">{item.username}</td>
          <td className="center" id="leader-score">{item.score}</td>
        </tr>
      )
    })


    if(this.state.successItems.length){
      successChar = this.state.successItems.map(item => {
        return (
          <span className="success-char">{item}</span>
        );
      })
    }

    if(this.state.errorItems){
      errorChar = this.state.errorItems.map(item => {
        return (
          <span className="error-char">{item}</span>
        );
      })
    }

    if(this.state.wordGuessed){
      displayMessage = <p className="display-message" id="win-message">You Win!</p>
      tryAgainButton = <button className="try-again" onClick={() => this.handleButtonClick()}>Try Again!</button>
    }
    else if(this.state.gameOver){
      displayMessage = <p className="display-message" id="lose-message">Game Over! The word is {this.state.randomSelectedWord}</p>
      tryAgainButton = <button className="try-again" onClick={() => this.handleButtonClick()}>Try Again!</button>
    }
    else{
      displayMessage = <p className="display-message">Number of guesses left: {this.state.numGuesses} </p>
    }


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
