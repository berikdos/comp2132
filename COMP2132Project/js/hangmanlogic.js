// Author: @Berik Dossayev

// HangmanGame object encapsulating the game logic
const HangmanGame = {
  word: "",
  hint: "",
  guesses: [],
  wrongGuesses: 0,
  maxWrongGuesses: 6,
  wordContainer: document.getElementById("word-container"),
  hintElement: document.getElementById("hint"),
  letterButtons: document.getElementById("letter-buttons"),
  hangmanImage: document.getElementById("hangman-image"),
  message: document.getElementById("message"),
  resetButton: document.getElementById("reset-game"),

  // Start the game by fetching a random word and hint
  startGame: function() {
    fetch("../data/words1.json")
      .then((response) => response.json())
      .then((data) => {
        const randomWord = data[Math.floor(Math.random() * data.length)];
        this.word = randomWord.word.toUpperCase();
        this.hint = randomWord.hint;
        this.hintElement.textContent = `Hint: ${this.hint}`;
        this.guesses = [];
        this.wrongGuesses = 0;
        this.updateUI();
        this.createLetterButtons();
      });
  },

  // Create letter buttons for the alphabet
  createLetterButtons: function() {
    this.letterButtons.innerHTML = "";
    for (let i = 65; i <= 90; i++) {
      const button = document.createElement("button");
      button.textContent = String.fromCharCode(i);
      button.addEventListener("click", (event) => this.handleGuess(event));
      this.letterButtons.appendChild(button);
    }
  },

  // Handle the user's guess
  handleGuess: function(event) {
    const letter = event.target.textContent;
    event.target.disabled = true;
    if (this.word.includes(letter)) {
      this.guesses.push(letter);
    } else {
      this.wrongGuesses++;
    }
    this.updateUI();
  },

  // Update the user interface (display word, hangman image, win/loss messages)
  updateUI: function() {
    this.wordContainer.innerHTML = this.word
      .split("")
      .map((letter) => (this.guesses.includes(letter) ? letter : "_"))
      .join(" ");

    this.fadeInElement(this.wordContainer); // Apply fade-in animation

    if (this.wrongGuesses === this.maxWrongGuesses) {
      // Display "lost" image if the max wrong guesses are reached
      this.hangmanImage.innerHTML = `<img src="../images/stage${this.wrongGuesses}.png" alt="Hangman Stage">`;
      this.message.textContent = `You lost! The word was "${this.word}".`;
      this.endGame();
    } else if (this.word.split("").every((letter) => this.guesses.includes(letter))) {
      // Display "won" image if all letters are guessed correctly
      this.hangmanImage.innerHTML = `<img src="../images/won.jpeg" alt="You won!">`; // Add a new "won" image
      this.message.textContent = "You won!";
      this.endGame();
    } else {
      // Display the current hangman stage
      this.hangmanImage.innerHTML = `<img src="../images/stage${this.wrongGuesses}.png" alt="Hangman Stage">`;
    }
  },

  // End the game (disable letter buttons)
  endGame: function() {
    const buttons = this.letterButtons.querySelectorAll("button");
    buttons.forEach((button) => (button.disabled = true));
  },

  // Fade-in effect for the word container element
  fadeInElement: function(element) {
    let opacity = 0;
    element.style.display = "block"; // Ensure the element is visible
    const fadeInterval = setInterval(() => {
      opacity += 0.1;
      element.style.opacity = opacity;
      if (opacity >= 1) {
        clearInterval(fadeInterval);
      }
    }, 50);
  },

  // Reset the game when the reset button is clicked
  resetGame: function() {
    this.message.textContent = "";
    this.wrongGuesses = 0;
    this.guesses = [];
    this.startGame();
  }
};

// Reset Game Button functionality (Always visible)
HangmanGame.resetButton.addEventListener("click", () => {
  HangmanGame.resetGame();
});

// Start the game on page load
document.addEventListener("DOMContentLoaded", () => {
  HangmanGame.startGame();
});