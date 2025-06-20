// script.js

let words = [];
let currentQuestionIndex = 0;
let totalQuestions = 0;
let score = 0;
let selectedWords = []; // 選択された問題を保持
let usedWords = []; // 既に出題された単語を保持

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
    selectedWords = [];
    usedWords = []; // 新しいクイズのためにリセット

    // フィルタリングした単語からランダムに選択
    while (selectedWords.length < totalQuestions) {
        const randomIndex = Math.floor(Math.random() * filteredWords.length);
        const selectedWord = filteredWords[randomIndex];
        if (!selectedWords.includes(selectedWord) && !usedWords.includes(selectedWord.word)) {
            selectedWords.push(selectedWord);
        }
        // もし全ての単語が使用済みなら、ループを抜ける
        if (selectedWords.length >= filteredWords.length) {
            break;
        }
    }

    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('nextQuestion').style.display = 'none'; // 次の問題ボタンを非表示
    showQuestion();
}

// 問題を表示する関数
function showQuestion() {
    if (currentQuestionIndex >= selectedWords.length) {
        document.getElementById('quiz').innerHTML = `<p>クイズ終了！あなたの得点: ${score}/${totalQuestions}</p>`;
        document.getElementById('nextQuestion').style.display = 'none'; // ボタンを非表示
        return;
    }

    const currentWord = selectedWords[currentQuestionIndex];
    const options = generateOptions(currentWord);
    const quizHtml = `
        <p>単語の意味は何ですか？</p>
        <p>${currentWord.meaning}</p>
        ${options.map(option => `<div class="answer" onclick="checkAnswer('${option.word}', '${currentWord.word}')">${option.word}</div>`).join('')}
    `;
    document.getElementById('quiz').innerHTML = quizHtml;
}

// 選択肢を生成する関数
function generateOptions(currentWord) {
    const options = [currentWord];
    const availableWords = selectedWords.filter(word => !usedWords.includes(word.word)); // 使用可能な単語リスト

    while (options.length < 4 && availableWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const randomWord = availableWords[randomIndex];
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
    usedWords.push(selectedWords[currentQuestionIndex].word); // 出題済みの単語を追加
    currentQuestionIndex++;
    document.getElementById('nextQuestion').style.display = 'block'; // 次の問題ボタンを表示
}

// 配列をシャッフルする関数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// DOMContentLoadedイベントで初期化
document.addEventListener('DOMContentLoaded', () => {
    loadCSV();
    document.getElementById('startQuiz').addEventListener('click', startQuiz);
    document.getElementById('nextQuestion').addEventListener('click', () => {
        document.getElementById('result').innerHTML = ""; // 結果をクリア
        showQuestion(); // 次の問題を表示
    });
});
