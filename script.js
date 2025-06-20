const words = [
    { number: 1, word: "apple", meaning: "りんご" },
    { number: 2, word: "banana", meaning: "バナナ" },
    { number: 3, word: "grape", meaning: "ぶどう" },
    { number: 4, word: "orange", meaning: "オレンジ" },
    { number: 5, word: "peach", meaning: "もも" },
    { number: 6, word: "kiwi", meaning: "キウイ" },
    { number: 7, word: "strawberry", meaning: "いちご" },
    { number: 8, word: "melon", meaning: "メロン" },
    // 必要に応じて単語を追加
];

let currentQuestionIndex = 0;
let correctAnswers = 0;
let totalQuestions = 0;
let selectedRange = [];

document.getElementById('startButton').addEventListener('click', startQuiz);
document.getElementById('nextButton').addEventListener('click', nextQuestion);
document.getElementById('backButton').addEventListener('click', resetQuiz);

function startQuiz() {
    const startNum = parseInt(document.getElementById('startNum').value);
    const endNum = parseInt(document.getElementById('endNum').value);
    totalQuestions = parseInt(document.getElementById('questionCount').value);
    
    selectedRange = words.filter(word => word.number >= startNum && word.number <= endNum);
    currentQuestionIndex = 0;
    correctAnswers = 0;

    document.getElementById('settings').classList.add('hidden');
    document.getElementById('quiz').classList.remove('hidden');

    nextQuestion();
}

function nextQuestion() {
    if (currentQuestionIndex < totalQuestions) {
        const questionData = getRandomQuestion();
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

function getRandomQuestion() {
    const correctAnswer = selectedRange[Math.floor(Math.random() * selectedRange.length)];
    const options = [correctAnswer];

    while (options.length < 5) {
        const randomOption = selectedRange[Math.floor(Math.random() * selectedRange.length)];
        if (!options.includes(randomOption)) {
            options.push(randomOption);
        }
    }

    return {
        word: correctAnswer.word,
        options: shuffleArray(options)
    };
}

function checkAnswer(selectedOption) {
    const resultDiv = document.getElementById('result');
    const correctMeaning = selectedOption.meaning;

    if (selectedOption.meaning === selectedOption.meaning) {
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
    alert(`クイズ終了! 正解数: ${correctAnswers} / ${totalQuestions}`);
}

function resetQuiz() {
    document.getElementById('settings').classList.remove('hidden');
    document.getElementById('backButton').classList.add('hidden');
    document.getElementById('result').classList.add('hidden');
    document.getElementById('options').innerHTML = '';
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}
