let words = [];
let currentQuestionIndex = 0;
let totalQuestions = 0;
let score = 0;
let selectedWords = []; // 選択された問題を保持

// CSVファイルを読み込む関数
async function loadCSV() {
    const response = await fetch('words.csv'); // CSVファイルのパス
    const data = await response.text();
    const rows = data.split('\n').slice(1); // ヘッダーを除く
    words = rows.map(row => {
        const [number, word, meaning] = row.split(',');
        return { number: parseInt(number), word, meaning };
    });
}

// クイズを開始する関数
function startQuiz() {
    const start = parseInt(document.getElementById('start').value);
    const end = parseInt(document.getElementById('end').value);
    totalQuestions = parseInt(document.getElementById('questionCount').value);
    
    selectedWords = words.filter(word => word.number >= start && word.number <= end);
    selectedWords = shuffleArray(selectedWords).slice(0, totalQuestions);
    currentQuestionIndex = 0;
    score = 0;
    
    displayQuestion();
}

// 問題を表示する関数
function displayQuestion() {
    if (currentQuestionIndex < selectedWords.length) {
        const question = selectedWords[currentQuestionIndex];
        const options = generateOptions(question.meaning); // 選択肢を生成
        const quizHtml = `
            <div>
                <p>問題 ${currentQuestionIndex + 1}: ${question.word}</p>
                ${options.map((option, index) => `
                    <button onclick="checkAnswer('${option}', '${question.meaning}')">${option}</button>
                `).join('')}
            </div>
        `;
        document.getElementById('quiz').innerHTML = quizHtml;
    } else {
        showResult();
    }
}

// 正解をチェックする関数
function checkAnswer(selectedMeaning, correctMeaning) {
    if (selectedMeaning === correctMeaning) {
        score++;
    }
    currentQuestionIndex++;
    displayQuestion();
}

// 結果を表示する関数
function showResult() {
    document.getElementById('quiz').innerHTML = '';
    document.getElementById('result').innerHTML = `あなたの得点: ${score} / ${totalQuestions}`;
    addScore(prompt("あなたの名前を入力してください:"), score);
}

// スコアを追加する関数
function addScore(name, score) {
    scores.push({ name: name, score: score });
    scores.sort((a, b) => b.score - a.score); // スコアでソート
    displayRanking();
}

// ランキングを表示する関数
function displayRanking() {
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = ''; // リストをクリア

    scores.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
        rankingList.appendChild(listItem);
    });

    document.getElementById('ranking').style.display = 'block'; // ランキングを表示
}

// 配列をシャッフルする関数
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// 選択肢を生成する関数
function generateOptions(correctAnswer) {
    const incorrectAnswers = words
        .filter(word => word.meaning !== correctAnswer)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3) // 3つの不正解を選ぶ
        .map(word => word.meaning);
    
    const options = [correctAnswer, ...incorrectAnswers];
    return shuffleArray(options); // 正解と不正解を混ぜる
}

// イベントリスナーの設定
document.getElementById('startQuiz').addEventListener('click', async () => {
    await loadCSV(); // CSVファイルを読み込む
    startQuiz(); // クイズを開始
});
