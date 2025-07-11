let words = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let totalQuestions = 0;
let selectedRange = [];
let lastCorrectAnswer = null;
let quizQuestions = []; // 出題順序を保持（重複なし）

// CSVを配列に変換する関数
function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    return lines.map(line => {
        let [number, word, meaning] = line.replace(/^﻿/, '').split(',');
        number = parseInt(number, 10);
        return { number, word, meaning };
    });
}

// CSVロード
function loadWordsCSV() {
    return fetch('words.csv')
        .then(response => {
            if (!response.ok) throw new Error('CSVの読み込みに失敗しました');
            return response.text();
        })
        .then(text => {
            words = parseCSV(text);
        });
}

// イベントリスナ
document.getElementById('startButton').addEventListener('click', () => {
    if (words.length === 0) {
        loadWordsCSV().then(startQuiz).catch(e => alert(e.message));
    } else {
        startQuiz();
    }
});
document.getElementById('nextButton').addEventListener('click', nextQuestion);
document.getElementById('backButton').addEventListener('click', resetQuiz);
document.getElementById('showRankingButton').addEventListener('click', () => {
    showRanking();
});
document.getElementById('closeRankingButton').addEventListener('click', () => {
    document.getElementById('ranking').classList.add('hidden');
    document.getElementById('settings').classList.remove('hidden');
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('backButton').classList.add('hidden');
    document.getElementById('result').classList.add('hidden');
    document.getElementById('options').innerHTML = '';
    document.getElementById('question').innerText = '';
});
document.getElementById('filterRankingButton').addEventListener('click', () => {
    const count = parseInt(document.getElementById('rankingQuestionCount').value);
    showRanking(isNaN(count) ? null : count);
});

// --- ランキングリセット機能 ---
// ここを書き換えて保存
const RANKING_RESET_PASSWORD = 'Kurage0805'; // 必要なら変更

(function setupRankingResetButton() {
    const resetBtn = document.createElement('button');
    resetBtn.id = 'resetRankingButton';
    resetBtn.type = 'button';
    resetBtn.textContent = 'ランキングをリセット';
    resetBtn.style.background = "#d9534f";
    resetBtn.style.marginTop = "20px";
    resetBtn.style.fontWeight = "bold";
    const rankingDiv = document.getElementById('ranking');
    rankingDiv.appendChild(resetBtn);

    resetBtn.addEventListener('click', () => {
        const pw = prompt("ランキングをリセットするにはパスワードを入力してください:");
        if (pw === null) return;
        if (pw === RANKING_RESET_PASSWORD) {
            localStorage.removeItem("rankings");
            alert("ランキングをリセットしました。");
            showRanking();
        } else {
            alert("パスワードが違います。");
        }
    });
})();
// ----------------------------

function startQuiz() {
    const startNum = parseInt(document.getElementById('startNum').value);
    const endNum = parseInt(document.getElementById('endNum').value);
    totalQuestions = parseInt(document.getElementById('questionCount').value);

    // バリデーション
    if (isNaN(startNum) || isNaN(endNum) || isNaN(totalQuestions) ||
        startNum < 1 || endNum < startNum || totalQuestions < 1) {
        alert("入力値を正しく設定してください。");
        return;
    }

    selectedRange = words.filter(word => word.number >= startNum && word.number <= endNum);

    if (selectedRange.length === 0) {
        alert("その範囲に単語がありません。");
        return;
    }
    if (totalQuestions > selectedRange.length) {
        alert(`出題数が範囲内の単語数を超えています。最大${selectedRange.length}問まで設定してください。`);
        return;
    }

    // 出題問題リストをランダムに作成（重複なし）
    quizQuestions = shuffleArray([...selectedRange]).slice(0, totalQuestions);

    currentQuestionIndex = 0;
    correctAnswers = 0;

    document.getElementById('settings').classList.add('hidden');
    document.getElementById('quiz').classList.remove('hidden');
    document.getElementById('backButton').classList.add('hidden');
    document.getElementById('result').classList.add('hidden');
    document.getElementById('nextButton').classList.add('hidden');

    nextQuestion();
}

function nextQuestion() {
    document.getElementById('result').classList.add('hidden');
    document.getElementById('nextButton').classList.add('hidden');

    if (currentQuestionIndex < quizQuestions.length) {
        const questionData = getRandomQuestion();
        lastCorrectAnswer = questionData.correctAnswer;
        document.getElementById('question').innerText = questionData.word;
        document.getElementById('options').innerHTML = '';

        questionData.options.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option.meaning;
            button.onclick = () => checkAnswer(option);
            document.getElementById('options').appendChild(button);
        });

        currentQuestionIndex++;
    } else {
        endQuiz();
    }
}

// ---- 問題範囲外も選択肢に含めるバージョン ----
function getRandomQuestion() {
    // quizQuestions から順に出題（重複なし）
    const correctAnswer = quizQuestions[currentQuestionIndex];
    const options = [correctAnswer];
    let usedNumbers = new Set([correctAnswer.number]);

    // selectedRange外の単語リストを作成
    const outOfRange = words.filter(word => 
        !usedNumbers.has(word.number) && !selectedRange.some(w => w.number === word.number)
    );

    // 2択目までは範囲内、3択目以降は範囲外も混ぜる
    while (options.length < Math.min(5, words.length)) {
        let sourceList;
        if (options.length < 2 && selectedRange.length > options.length) {
            sourceList = selectedRange.filter(word => !usedNumbers.has(word.number));
        } else if (outOfRange.length > 0) {
            sourceList = outOfRange.filter(word => !usedNumbers.has(word.number));
        } else {
            sourceList = words.filter(word => !usedNumbers.has(word.number));
        }
        if (sourceList.length === 0) break;
        const randomOption = sourceList[Math.floor(Math.random() * sourceList.length)];
        options.push(randomOption);
        usedNumbers.add(randomOption.number);
    }
    return {
        word: correctAnswer.word,
        correctAnswer: correctAnswer,
        options: shuffleArray(options)
    };
}
// ---- ここまで ----

function checkAnswer(selectedOption) {
    const resultDiv = document.getElementById('result');
    const correctMeaning = lastCorrectAnswer.meaning;

    if (selectedOption.meaning === correctMeaning) {
        correctAnswers++;
        resultDiv.innerText = `正解! 意味: ${correctMeaning}`;
    } else {
        resultDiv.innerText = `不正解。正しい意味: ${correctMeaning}`;
    }

    resultDiv.classList.remove('hidden');
    document.getElementById('nextButton').classList.remove('hidden');
}

function endQuiz() {
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('backButton').classList.remove('hidden');
    setTimeout(() => {
        let userName = prompt("クイズ終了! 正解数: " + correctAnswers + " / " + totalQuestions + "\n名前を入力してください（ランキングに登録されます）:");
        if (!userName) userName = "名無し";
        saveRanking(userName, correctAnswers, totalQuestions);
        showRanking(totalQuestions);
    }, 100);
}

function resetQuiz() {
    document.getElementById('settings').classList.remove('hidden');
    document.getElementById('backButton').classList.add('hidden');
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('result').classList.add('hidden');
    document.getElementById('options').innerHTML = '';
    document.getElementById('question').innerText = '';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- ランキング機能 ---

function saveRanking(userName, score, questionCount) {
    let rankings = JSON.parse(localStorage.getItem("rankings") || '{}');
    if (!rankings[questionCount]) rankings[questionCount] = [];
    rankings[questionCount].push({ name: userName, score: score, date: new Date().toLocaleString() });
    rankings[questionCount].sort((a, b) => b.score - a.score);
    rankings[questionCount] = rankings[questionCount].slice(0, 5);
    localStorage.setItem("rankings", JSON.stringify(rankings));
}

function showRanking(questionCount = null) {
    document.getElementById('settings').classList.add('hidden');
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('backButton').classList.add('hidden');
    document.getElementById('ranking').classList.remove('hidden');

    let rankings = JSON.parse(localStorage.getItem("rankings") || '{}');
    let list = document.getElementById('rankingList');
    list.innerHTML = "";

    let keys = Object.keys(rankings).sort((a, b) => parseInt(a) - parseInt(b));
    if (questionCount !== null) {
        keys = keys.filter(k => parseInt(k) === questionCount);
    }

    if (keys.length === 0) {
        list.innerHTML = "<li>ランキングはありません</li>";
        return;
    }
    keys.forEach(qc => {
        let title = document.createElement('li');
        title.innerHTML = `<strong>【出題数: ${qc}】</strong>`;
        list.appendChild(title);
        rankings[qc].forEach((entry, idx) => {
            let li = document.createElement('li');
            li.textContent = ` ${idx + 1}位: ${entry.name} - ${entry.score}点 (${entry.date})`;
            list.appendChild(li);
        });
    });
}
