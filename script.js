// --- ランキング機能の追加 ---
function saveCorrectAnswer(userName, correctAnswers) {
    // localStorageから既存データを取得
    const currentData = JSON.parse(localStorage.getItem('quizResults')) || [];
    // 新しい結果を追加
    currentData.push({
        name: userName,
        score: correctAnswers,
        timestamp: new Date().toISOString()
    });
    // localStorageに保存
    localStorage.setItem('quizResults', JSON.stringify(currentData));
}

function showRanking() {
    // localStorageからランキングデータを取得
    const rankingData = JSON.parse(localStorage.getItem('quizResults')) || [];
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = '';

    // データをスコア順にソート
    rankingData.sort((a, b) => b.score - a.score);

    // ランキングをリストに追加
    rankingData.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.name} - ${entry.score}点 (${new Date(entry.timestamp).toLocaleString()})`;
        rankingList.appendChild(listItem);
    });

    // ランキング画面を表示
    document.getElementById('ranking').classList.remove('hidden');
}

// --- クイズ終了時に正解数を保存 ---
function endQuiz() {
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('backButton').classList.remove('hidden');
    setTimeout(() => {
        // ユーザー名を取得
        const userName = prompt(`クイズ終了! 正解数: ${correctAnswers} / ${totalQuestions}\n名前を入力してください:`) || "名無し";
        // 正解数を保存
        saveCorrectAnswer(userName, correctAnswers);
        alert("結果が保存されました。");
        // ランキングを表示
        showRanking();
    }, 100);
}

// --- HTMLボタンのイベントリスナー ---
document.getElementById('showRankingButton').addEventListener('click', showRanking);
document.getElementById('closeRankingButton').addEventListener('click', () => {
    document.getElementById('ranking').classList.add('hidden');
});
