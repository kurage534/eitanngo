let username = "";
let mode = "en2ja"; // デフォルトモード
let score = 0;

async function startQuiz() {
  // ユーザー名とモードの取得
  username = document.getElementById("username").value.trim();
  mode = document.getElementById("mode").value;

  // ユーザー名が入力されているか確認
  if (!username) {
    alert("ユーザー名を入力してください。");
    return;
  }

  score = 0;

  // クイズ画面の表示
  document.getElementById("setup").style.display = "none";
  document.getElementById("quiz").style.display = "block";

  try {
    await nextQuestion();
  } catch (error) {
    console.error("クイズを開始できませんでした:", error);
    alert("クイズを開始できませんでした。もう一度お試しください。");
    // 初期状態に戻す
    document.getElementById("setup").style.display = "block";
    document.getElementById("quiz").style.display = "none";
  }
}

async function nextQuestion() {
  try {
    const res = await fetch(`/quiz?mode=${mode}`);
    if (!res.ok) {
      throw new Error(`サーバーエラー: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    document.getElementById("question").innerText = data.question;
    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";

    data.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.innerText = choice;
      btn.onclick = () => submitAnswer(data, choice);
      choicesDiv.appendChild(btn);
    });
  } catch (error) {
    console.error("次の質問を取得できませんでした:", error);
    alert("次の質問を取得できませんでした。ネットワーク接続を確認してください。");
  }
}

// 以下の関数は変更なし
async function submitAnswer(data, choice) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("question", data.question);
  formData.append("answer", data.answer);
  formData.append("user_answer", choice);

  const res = await fetch("/answer", { method: "POST", body: formData });
  const result = await res.json();

  if (result.correct) {
    document.getElementById("result").innerText = "正解！";
    score++;
  } else {
    document.getElementById("result").innerText = `不正解！ 正解は ${data.answer}`;
  }

  setTimeout(nextQuestion, 1000);
}

async function loadRanking() {
  const res = await fetch("/ranking");
  const ranking = await res.json();
  const list = document.getElementById("ranking-list");
  list.innerHTML = "";
  ranking.forEach(r => {
    const li = document.createElement("li");
    li.innerText = `${r.username} - ${r.score}`;
    list.appendChild(li);
  });
}

setInterval(loadRanking, 5000); // 5秒ごとに更新
