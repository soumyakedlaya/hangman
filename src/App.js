import React, { Component } from 'react';
import $ from 'jquery';
import AppHeader from './Components/AppHeader';
import Slider, { Range } from 'rc-slider';
import Spinner from 'react-spinner-material';
import 'rc-slider/assets/index.css';
import './App.css';

const bodyPartsObj = {
  head: <circle cx="320" cy="190" r="40" fill="black"/>,
  body: <line x1="320" y1="190" x2="320" y2="360"  style={{fill:'none',stroke:'black',strokeWidth:3}}/>,
  leftArm: <line x1="320" y1="260" x2="250" y2="230" style={{fill:'none',stroke:'black',strokeWidth:3}}/>,
  rightArm: <line x1="320" y1="260" x2="390" y2="230" style={{fill:'none',stroke:'black',strokeWidth:3}}/>,
  leftLeg: <line x1="320" y1="360" x2="250" y2="450" style={{fill:'none',stroke:'black',strokeWidth:3}}/>,
  rightLeg: <line x1="320" y1="360" x2="390" y2="450" style={{fill:'none',stroke:'black',strokeWidth:3}}/>
}

var difficultyLevel = 1;

class App extends Component {
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
    console.log("getRandomWord(): ")
    this.setState({spinnerVisible: true});
    $.ajax({
      url: 'http://localhost:4000/getWords?difficulty=' + difficultyLevel,
      success: function(data){
        // debugger;
          var allWords = data.words.split("\n");

          var min = 0;
          var max = allWords.length;

          var randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;

          console.log("word = " + allWords[randomIndex]);
          allWords[randomIndex].split('').map((item) =>
            this.state.successItems.push('_'));
          this.setState({randomSelectedWord: allWords[randomIndex], successItems: this.state.successItems, spinnerVisible: false});
          // debugger;
      }.bind(this),
      error: function(xhr, status, err){
        console.log(err);
      }
    });
  }

getScores() {
  console.log("getScores(): ")
  this.setState({spinnerVisible: true});
  $.ajax({
    url: 'http://localhost:4000/getScores',
    success: function(data){
      console.log("Scores:", data);
      this.setState({topScores: JSON.parse(data)});
    }.bind(this),
    error: function(xhr, status, err){
      console.log(err);
    }
  });
}
  componentDidMount(){
    this.getRandomWord(this.state.difficulty);
    this.getScores();
  }

  validateInput(event){
    var value = event.target.value.toLowerCase();
    console.log("validateInput(): value = ", value);

    var nonLetters = value.match(/^[^a-zA-Z]+$/) ? true : false;
    console.log("nonLetters = ", nonLetters);

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
    console.log("drawBodyPart(): numGuesses = " + this.state.numGuesses);
    switch (this.state.numGuesses) {
      case 5:
        console.log("case numGuesses = 5");
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
    console.log('topscores', this.state.topScores[0])
    var topScores = this.state.topScores.map((item) => {
      return (
        <div>
          <div>User: {item.username}</div>
          <div>Score: {item.score}</div>
        </div>
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
      displayMessage = <p className="display-message">You Win!</p>
    }
    else if(this.state.gameOver){
      displayMessage = <p className="display-message">Game Over! The word is {this.state.randomSelectedWord}</p>
    }
    else{
      displayMessage = <p className="display-message">Number of guesses left: {this.state.numGuesses} </p>
    }

    return (
      <div className="App">
        <AppHeader />
        <hr />
        <button onClick={() => this.handleButtonClick()}>Try Again!</button>

        <div style={{marginTop: '50%', marginLeft:'50%'}}>
        <Spinner size={50} spinnerColor={"#333"} spinnerWidth={2} visible={this.state.spinnerVisible}/>
        </div>
        <svg width="450" height="480">
          <polyline id="hangman-structure" points="400,430 100,430 150,430 150,100 320,100 320,150"/>
          {this.state.bodyParts}
        </svg>
        <div id="error-box">
          {errorChar}
        </div>
        <div id="word-container">
          {successChar}
          <div id="guess-box">
            <input id="guess-input" type= "text" value={this.state.guessedCharacter} placeholder="Guess!" maxLength="1" disabled={this.state.gameOver} onChange={this.validateInput.bind(this)}/>
            {displayMessage}
          </div>
        </div>
        <div>
        <Slider min={1} max={10} step={1} marks={{1:"1", 2:"2", 3:"3", 4:"4", 5:"5", 6:"6", 7:"7", 8:"8", 9:"9", 10:"10"}} onChange= {(value) => this.handleDifficultyChange(value)}/>
        </div>
        <div>
          {topScores}
        </div>
      </div>
    );
  }
}

export default App;
