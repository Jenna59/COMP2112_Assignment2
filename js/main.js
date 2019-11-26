const API_URL = 'https://opentdb.com/api.php?amount=15&type=multiple';

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// 1b. Instantiation of new Vue({}) is present
// eslint-disable-next-line no-new
new Vue({
  el: "#app", //hook
  data: {
    triviaArrayResults: [],
    API_URL,
    play: false,
    qIndex: 0,
    question: '',
    answer1: '',
    answer2: '',
    answer3: '',
    answer4: '',
    correctAnswer: '',
    correctLetter: '',
    host: new SpeechSynthesisUtterance(),
    // is this where the speech recognition should go?
    // recognition: new window.SpeechRecognition(),
  },
  // 2a. Use of async/await/fetch to get json data from opentdb.com’s API. 
  async created() {
    const res = await fetch(this.API_URL);
    const data = await res.json();
    // console.log(data); defined
    this.triviaArrayResults = data.results;
    this.displayQandA();
  },
  mounted() {
    this.host.lang = 'en-US';
  },
  methods: {
    beginGame() {
      this.play = true;
      this.readQuestion();
    },
    displayQandA() {
      this.parseCurrentQuestion();
    },
    isAnswer(letter) {
      const dictionary = ['a', 'b', 'c', 'd'];
      const index = dictionary.findIndex(char => char === letter);
      if (index == this.correctLetter) {
        this.qIndex += 1;
        this.parseCurrentQuestion();
      } else {
        this.play = false;
        alert('You guessed the wrong answer!');
      } 
    },
    parseCurrentQuestion() {
      this.question = this.triviaArrayResults[this.qIndex].question;
      this.correctAnswer = this.triviaArrayResults[this.qIndex].correct_answer;
      this.shuffleAnswers();
    },
    shuffleAnswers() {
      const answers = [
        this.correctAnswer,
        ...this.triviaArrayResults[this.qIndex].incorrect_answers,
      ];
      answers.sort(() => Math.random() - 0.5);
      [this.answer1, this.answer2, this.answer3, this.answer4] = answers;
      this.correctLetter = answers.findIndex(
        answer => answer === this.correctAnswer
      );
    },
    // 4. Make browser speak as if it was the host asking the question 
    readQuestion() {
      this.host.text =
        this.question +
        this.answer1 +
        this.answer2 +
        this.answer3 +
        this.answer4;
      speechSynthesis.speak(this.host);
    },
    getChart() {
      window.open('https://codepen.io/jaelyn59/pen/pooBzad', 'Voting Options');
      window.open('https://codepen.io/jaelyn59/pen/LYYawBm', 'Answer Chart');
    },
    removeTwo() {
      const incorrectAnswers = [
        ...this.triviaArrayResults[this.qIndex].incorrect_answers,
      ];
      function pick(i) {
        return i.splice(Math.floor(Math.random() * i.length), 1);
      }
    }
  },
});
