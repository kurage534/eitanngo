// 正解数を保存する関数
function saveCorrectAnswer(userName, correctAnswers) {
    const currentData = JSON.parse(localStorage.getItem('quizResults')) || [];
    currentData.push({
        name: userName,
        score: correctAnswers,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('quizResults', JSON.stringify(currentData));
}

// クイズ終了時に正解数を保存する
function endQuiz() {
    document.getElementById('quiz').classList.add('hidden');
    setTimeout(() => {
        const userName = prompt(`クイズ終了! 正解数: ${correctAnswers} / ${totalQuestions}\n名前を入力してください: `) || "名無し";
        saveCorrectAnswer(userName, correctAnswers);
        alert("結果が保存されました。");
    }, 100);
}

// ランキングを表示する関数
function showRanking() {
    const rankingData = JSON.parse(localStorage.getItem('quizResults')) || [];
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = '';

    rankingData.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.name} - ${entry.score}点 (${new Date(entry.timestamp).toLocaleString()})`;
        rankingList.appendChild(listItem);
    });

    document.getElementById('ranking').classList.remove('hidden');
}
