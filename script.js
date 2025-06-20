document.getElementById('startQuiz').addEventListener('click', startQuiz);
document.getElementById('nextQuestion').addEventListener('click', nextQuestion);

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    const start = parseInt(document.getElementById('start').value);
    const end = parseInt(document.getElementById('end').value);
    const questionCount = parseInt(document.getElementById('questionCount').value);

    // 簡単なサンプル質問を生成
    questions = [];
    for (let i = start; i <= end && questions.length < questionCount; i++) {
        questions.push(`問題 ${i}: これはサンプルの質問です。`);
    }

    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('result').innerText = '';
    document.getElementById('nextQuestion').style.display = 'none';
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        document.getElementById('quiz').innerText = questions[currentQuestionIndex];
        document.getElementById('nextQuestion').style.display = 'block';
    } else {
        document.getElementById('quiz').innerText = 'クイズ終了！';
        document.getElementById('nextQuestion').style.display = 'none';
        document.getElementById('result').innerText = `スコア: ${score} / ${questions.length}`;
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
}
