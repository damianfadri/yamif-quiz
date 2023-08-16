const Scene = require('Scene');
const FaceTracking = require('FaceTracking');
const Reactive = require('Reactive');
const Materials = require('Materials');
const Data = require('./questions');

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function selectQuestions(questions, len) {
  let selected = [];
  
  while (selected.length < len) {
    let randomIndex = getRandomNumber(0, questions.length);

    selected.push(questions[randomIndex]);
    questions.splice(randomIndex, 1);
  }

  return selected;
}

(async function () {
  const canvasQuiz = await Scene.root.findFirst('canvas-quiz');
  const canvasScore = await Scene.root.findFirst('canvas-score');

  const pivotLeft = await Scene.root.findFirst('pivot-left');
  const pivotRight = await Scene.root.findFirst('pivot-right');

  const textQuestion = await Scene.root.findFirst('text-question');
  const textRight = await Scene.root.findFirst('text-right');
  const textLeft = await Scene.root.findFirst('text-left');
  const textScore = await Scene.root.findFirst('text-score');

  const boxRight = await Scene.root.findFirst('box-right');
  const boxLeft = await Scene.root.findFirst('box-left');

  const matBoxNormal = await Materials.findFirst('box-normal');
  const matBoxCorrect = await Materials.findFirst('box-correct');
  const matBoxWrong = await Materials.findFirst('box-wrong');

  const face = FaceTracking.face(0);

  const session = {
    index: 0,
    score: 0,
    questions: selectQuestions(Data.questions, 5),

    currentQuestion: function() { 
      return this.questions[this.index]; 
    },

    goToNextQuestion: function() {
      if (this.isEnd()) {
        return;
      }

      return this.questions[++this.index];
    },

    markAsCorrect: function() {
      if (this.isEnd()) {
        return;
      }

      this.score++;
    },

    isEnd: function() {
      return this.index == this.questions.length;
    },

    rating: function() {
      return (this.score / this.questions.length) * 100;
    }
  };

  function renderQuestion(item) {
    textQuestion.text = item.question;
    textRight.text = item.right;
    textLeft.text = item.left;
  }

  function onSelectLeft(isLeft) {
    if (!isLeft.newValue) {
      boxLeft.material = matBoxNormal;

      var nextQuestion = session.goToNextQuestion();

      if (session.isEnd()) {
        leftMonitor.unsubscribe();
        rightMonitor.unsubscribe();
        canvasQuiz.hidden = true;
        canvasScore.hidden = false;

        textScore.text = session.rating().toString();
        return;
      }

      renderQuestion(nextQuestion);
      return;
    }

    let question = session.currentQuestion();
    if (question.left == question.answer) {
      session.markAsCorrect();
      boxLeft.material = matBoxCorrect;
    } else {
      boxLeft.material = matBoxWrong;
    }
  }

  function onSelectRight(isRight) {
    if (!isRight.newValue) {
      boxRight.material = matBoxNormal;
      
      var nextQuestion = session.goToNextQuestion();

      if (session.isEnd()) {
        leftMonitor.unsubscribe();
        rightMonitor.unsubscribe();
        canvasQuiz.hidden = true;
        canvasScore.hidden = false;
  
        textScore.text = session.rating().toString();
        return;
      }

      renderQuestion(nextQuestion);
      return;
    }

    let question = session.currentQuestion();
    if (question.right == question.answer) {
      session.markAsCorrect();
      boxRight.material = matBoxCorrect;
    } else {
      boxRight.material = matBoxWrong;
    }
  }

  // set face rotation watcher
  const leftMonitor
    = face.cameraTransform.rotationZ
      .ge(0.25)
      .monitor()
      .subscribe(onSelectLeft);

  const rightMonitor
    = face.cameraTransform.rotationZ
      .le(-0.25)
      .monitor()
      .subscribe(onSelectRight);

  // set answer rotation behavior
  pivotLeft.transform.rotationZ 
  = face.cameraTransform.rotationZ
    .clamp(Reactive.val(0), Reactive.val(0.5));

  pivotRight.transform.rotationZ 
    = face.cameraTransform.rotationZ
      .clamp(Reactive.val(-0.5), Reactive.val(0));

  // show first item
  renderQuestion(session.currentQuestion());
})(); 