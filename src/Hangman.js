import React, { Component } from "react";
import randomWords from "./wordList";

import "./Hangman.css";
import img0 from "./images/0.jpg";
import img1 from "./images/1.jpg";
import img2 from "./images/2.jpg";
import img3 from "./images/3.jpg";
import img4 from "./images/4.jpg";
import img5 from "./images/5.jpg";
import img6 from "./images/6.jpg";

class Hangman extends Component {
    static defaultProps = {
        maxWrong: 6,
        images: [img0, img1, img2, img3, img4, img5, img6],
    };

    constructor(props) {
        super(props);
        this.state = { nWrong: 0, guessed: new Set(), answer: " ", hint: " ", red: false, gameOver: false, won: false, wordNum: 0 };
    }

    // checking the guessed word
    guessedWord = () => {
        if (this.state.won == false) {
            this.winningPos();
            return this.state.answer.split("").map((ltr) => (this.state.guessed.has(ltr) ? ltr : "_"));
        }
    };

    // when you win the game
    winningPos = () => {
        let correctltrs = 0;
        this.state.answer.split("").map((ltr) => {
            if (this.state.guessed.has(ltr)) {
                correctltrs++;
            }
        });
        if (correctltrs == this.state.answer.length) {
            this.setState({ won: true });
        }
    };

    // handling the guesses here
    handleGuess = (evt) => {
        let ltr = evt.target.value;
        this.setState((st) => ({
            guessed: st.guessed.add(ltr),
            nWrong: st.nWrong + (st.answer.includes(ltr) ? 0 : this.makeRed()),
        }));
    };

    // new word
    nextWord = () => {
        let newHint = randomWords[this.state.wordNum].hint;
        let newWord = randomWords[this.state.wordNum].word;
        this.setState({ nWrong: 0, guessed: new Set(), answer: newWord, hint: newHint, won: false, wordNum: this.state.wordNum + 1 });
    };

    // when the guess is wrong
    makeRed = () => {
        this.setState({ nWrong: this.state.nWrong + 1, makeRed: true });
        setTimeout(() => {
            this.setState({ makeRed: false });
        }, 500);
    };

    // generating buttons
    generateButtons = () => {
        return "abcdefghijklmnopqrstuvwxyz".split("").map((ltr) => (
            <button value={ltr} onClick={this.handleGuess} disabled={this.state.gameOver || this.state.won ? true : this.state.guessed.has(ltr)} key={crypto.randomUUID()}>
                {ltr}
            </button>
        ));
    };

    // resetting the game
    handleReset = () => {
        this.setState({ nWrong: 0, guessed: new Set(), answer: randomWords[this.state.wordNum - 1].word, hint: randomWords[this.state.wordNum - 1].hint, red: false, gameOver: false, won: false });
    };

    // returning display flex or display none according to the argument
    displayFlex = (condition) => {
        return condition ? { display: "flex" } : { display: "none" };
    };

    render() {
        if (this.state.gameOver === false && this.props.maxWrong === this.state.nWrong && this.state.won === false) {
            this.setState({ gameOver: true });
        }
        if (this.state.wordNum == 0 && this.state.answer == " ") {
            this.setState({ answer: randomWords[0].word, hint: randomWords[0].hint, wordNum: 1 });
        }
        let src = "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJvcGh5fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60";

        return (
            <div>
                <div className="Hangman" style={{...this.displayFlex(!(randomWords.length == this.state.wordNum - 1))}}>
                    <h1>Hangman</h1>
                    <img src={this.props.images[this.state.nWrong]} style={{ ...this.displayFlex(!this.state.won), marginLeft: "100px" }} />
                    <img src={src} className="Hangman-zoom" style={this.state.won ? { display: "block" } : { display: "none" }} alt="WinningImage" />

                    {/* number of incorrect guesses will appear here */}
                    <div className={this.state.makeRed ? "Hangman-incorrect make-red" : "Hangman-incorrect"} style={this.state.gameOver || this.state.won ? { display: "none" } : { display: "block" }}>
                        Incorrect Guesses : {this.state.nWrong}
                    </div>

                    {/* will show this when won the game */}
                    <div className="Hangman-won" style={this.state.won ? { display: "block" } : { display: "none" }}>
                        <span className="blink-green">You Won!!</span>
                        <span className="reset next" onClick={this.nextWord}>
                            Next Level
                        </span>
                    </div>

                    {/* will show this when game is over */}
                    <div className="Hangman-game-over" style={this.state.gameOver ? { display: "block" } : { display: "none" }}>
                        <span className="blink">Game Over</span>
                        <span className="reset" onClick={this.handleReset}>
                            Reset...
                        </span>
                    </div>

                    {/* hint */}
                    <p className="Hangman-hint" style={{ ...this.displayFlex(!this.state.won) }}>
                        {this.state.hint}
                    </p>

                    {/* word showcase and keyboard */}
                    <p className="Hangman-word">{this.guessedWord()}</p>
                    <p className="Hangman-btns">{this.generateButtons()}</p>
                </div>
                <div className="blink-green completed" style={{...this.displayFlex(randomWords.length == this.state.wordNum - 1)}}>
                    YOU HAVE SUCCESSYULLY COMPLETED ALL THE LEVELS...!, <br />
                    RELOAD THE PAGE TO RESTART THE GAME
                </div>
            </div>
        );
    }
}

export default Hangman;
