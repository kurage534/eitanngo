let username = "";
let score = 0;
let currentQuizIndex = 0;
let quizData = [];

async function startQuiz() {
  username = document.getElementById("username").value.trim();
  if (!username) {
    alert("ユーザー名を入力してください。");
    return;
  }
  score = 0;
  currentQuizIndex = 0;

  // クイズデータを読み込む
  try {
    const res = await fetch("quiz.json");
    quizData = await res.json();
  } catch (e) {
    alert("クイズデータの読み込みに失敗しました。");
    return;
  }

  document.getElementById("setup").style.display = "none";
  document.getElementById("quiz").style.display = "block";
  nextQuestion();
}

function nextQuestion() {
  if (currentQuizIndex >= quizData.length) {
    // クイズ終了
    document.getElementById("question").innerText = "クイズ終了！あなたのスコア: " + score;
    document.getElementById("choices").innerHTML = "";
    document.getElementById("result").innerText = "";
    // 必要に応じてランキング追加処理(静的ランキングなので省略)
    return;
  }

  const data = quizData[currentQuizIndex];
  document.getElementById("question").innerText = data.question;
  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  data.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = choice;
    btn.onclick = () => submitAnswer(data, choice);
    choicesDiv.appendChild(btn);
  });
}

function submitAnswer(data, choice) {
  if (choice === data.answer) {
    document.getElementById("result").innerText = "正解！";
    score++;
  } else {
    document.getElementById("result").innerText = `不正解！ 正解は ${data.answer}`;
  }
  currentQuizIndex++;
  setTimeout(nextQuestion, 1000);
}

async function loadRanking() {
  try {
    const res = await fetch("ranking.json");
    if (!res.ok) return;
    const ranking = await res.json();
    const list = document.getElementById("ranking-list");
    list.innerHTML = "";
    ranking.forEach(r => {
      const li = document.createElement("li");
      li.innerText = `${r.username} - ${r.score}`;
      list.appendChild(li);
    });
  } catch (e) {
    // エラーは無視
  }
}

setInterval(loadRanking, 5000); // 5秒ごとにランキング更新
