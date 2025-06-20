// script.js

let words = [];
let currentQuestionIndex = 0;
let totalQuestions = 0;
let score = 0;

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

    // 指定された範囲の単語をフィルタリング
    const filteredWords = words.filter(word => word.number >= start && word.number <= end);
    
    if (filteredWords.length === 0) {
        document.getElementById('quiz').innerHTML = "<p>指定された範囲に単語がありません。</p>";
        return;
    }

    // ランダムに問題を選択
    const selectedWords = [];
    while (selectedWords.length < totalQuestions) {
        const randomIndex = Math.floor(Math.random() * filteredWords.length);
        const selectedWord = filteredWords[randomIndex];
        if (!selectedWords.includes(selectedWord)) {
            selectedWords.push(selectedWord);
        }
    }

    currentQuestionIndex = 0;
    score = 0;
    showQuestion(selectedWords);
}

// 問題を表示する関数
function showQuestion(selectedWords) {
    if (currentQuestionIndex >= selectedWords.length) {
        document.getElementById('quiz').innerHTML = `<p>クイズ終了！あなたの得点: ${score}/${totalQuestions}</p>`;
        return;
    }

    const currentWord = selectedWords[currentQuestionIndex];
    const options = generateOptions(currentWord, selectedWords);
    const quizHtml = `
        <p>単語の意味は何ですか？</p>
        <p>${currentWord.meaning}</p>
        ${options.map(option => `<div class="answer" onclick="checkAnswer('${option.word}', '${currentWord.word}')">${option.word}</div>`).join('')}
    `;
    document.getElementById('quiz').innerHTML = quizHtml;
}

// 選択肢を生成する関数
function generateOptions(currentWord, selectedWords) {
    const options = [currentWord];
    while (options.length < 4) {
        const randomIndex = Math.floor(Math.random() * selectedWords.length);
        const randomWord = selectedWords[randomIndex];
        if (!options.includes(randomWord)) {
            options.push(randomWord);
        }
    }
    return shuffleArray(options);
}

// 正誤判定を行う関数
function checkAnswer(selected, correct) {
    const isCorrect = selected === correct;
    if (isCorrect) {
        score++;
        document.getElementById('result').innerHTML = "<p>正解！</p>";
    } else {
        document.getElementById('result').innerHTML = `<p>不正解。正しい答えは "${correct}" です。</p>`;
    }
    currentQuestionIndex++;
    setTimeout(() => {
        document.getElementById('result').innerHTML = ""; // 結果をクリア
        showQuestion(selectedWords); // 次の問題を表示
    }, 2000);
}

// 配列をシャッフルする関数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// イベントリスナー
document.getElementById('startQuiz').addEventListener('click', startQuiz);

// 初期化
loadCSV();
