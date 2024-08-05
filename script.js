let category = document.querySelector(".category span");
let questionsCount = document.querySelector(".count span");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let spans = document.querySelector(".spans");
let countDown = document.querySelector(".countdown");
let startButton = document.querySelector(".start-btn");
let categoryOptions = document.querySelector(".category-options");
let currentIndex = 0;
let rightAnswers;
let questionsObject;
let categoryName;
let correctAnswers = 0;
let globalInterval;

startButton.onclick = function () {
  document.querySelector(".overlay").style.display = "none";
  document.querySelector(".quiz-start").style.display = "none";
  categoryName = document.querySelector(".category-options").value;
  category.innerHTML = categoryName.toUpperCase();
  getQuestions(categoryName);
  timer(100);
};

function getQuestions(categoryName) {
  const myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      questionsObject = JSON.parse(this.responseText);
      questionsCount.innerHTML = questionsObject.length;

      addDate(questionsObject[currentIndex], questionsObject.length);
      
      rightAnswers = questionsObject[currentIndex].right_answer;
    }
  };
  myRequest.open("GET", `JSONS/${categoryName}-questions.json`, true);
  myRequest.send();
}

function createBullets(num) {
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    if (i === 0) {
      theBullet.className = "on-progress";
    }
    spans.appendChild(theBullet);
  }
}

function addDate(data, count) {
  quizArea.innerHTML = "";
  answersArea.innerHTML = "";
  let questionTitle = document.createElement("h2");
  let questionText = document.createTextNode(data.title);
  questionTitle.appendChild(questionText);
  quizArea.appendChild(questionTitle);
  for (let i = 1; i <= 4; i++) {
    let answerDiv = document.createElement("div");
    let answer = document.createElement("input");
    answer.type = "radio";
    answer.id = `answer_${i}`;
    answer.name = "question";
    let label = document.createElement("label");
    label.htmlFor = `answer_${i}`;
    let labelText = document.createTextNode(data[`answer_${i}`]);
    label.appendChild(labelText);
    if (i === 1) {
      answer.checked = true;
    }
    answerDiv.appendChild(answer);
    answerDiv.appendChild(label);
    answerDiv.className = "answer";
    answersArea.appendChild(answerDiv);
  }
  if (spans.children.length < count) {
    createBullets(count);
  }
}

submitButton.onclick = function () {
  checkBullets();
  
  if (currentIndex !== questionsObject.length - 1) {
    currentIndex++;
    document
      .querySelectorAll(".spans span")
      [currentIndex].classList.add("on-progress");

    addDate(questionsObject[currentIndex], questionsObject.length);
  } else {
    document.querySelector(".overlay").style.display = "flex";
    document.querySelector(".quiz-over").style.display = "flex";
    document.querySelector(".quiz-over span").innerHTML = correctAnswers;
    clearInterval(globalInterval)
  }
  getQuestions(categoryName)
};

function checkBullets() {
  document.querySelectorAll(".spans span")[currentIndex].classList.add("done");
  if (
    document.querySelector("input[name='question']:checked").nextElementSibling
      .innerText === rightAnswers
  ) {
    document.querySelector(".on-progress").classList.remove("on-progress");
    document
      .querySelectorAll(".spans span")
      [currentIndex].classList.add("good");
    correctAnswers++;
    
    if (
      document.querySelectorAll(".spans .done").length ===
      questionsObject.length - 1
    ) {
      document.querySelector(".quiz-over").style.display = "block";
      document.querySelector(".quiz-over span").innerHTML = correctAnswers;
    }
  } else {
    document.querySelector(".on-progress").classList.remove("on-progress");
    document.querySelectorAll(".spans span")[currentIndex].classList.add("bad");
  }
}

function timer(duration, count) {
  
    let minutes, seconds;
    globalInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDown.innerHTML = `${minutes}:${seconds}`;

      duration--;
      if (duration < 0) {
        clearInterval(globalInterval)
      }
    }, 1000);
}

document.querySelector(".restart").onclick = function () {
  window.location.reload();
};
