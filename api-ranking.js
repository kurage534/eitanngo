const API_BASE = "http://localhost:3000/api/rankings"; // サーバーURLに応じて変更

// ランキング保存APIへのPOST
async function saveRankingAPI(userName, score, questionCount) {
    try {
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: userName,
                score: score,
                questionCount: questionCount,
                date: new Date().toLocaleString()
            })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error('API保存に失敗しました: ' + (err.error || ''));
        }
    } catch (e) {
        alert(e.message);
    }
}

// ランキング取得API
async function showRankingAPI(questionCount = null) {
    document.getElementById('settings').classList.add('hidden');
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('backButton').classList.add('hidden');
    document.getElementById('ranking').classList.remove('hidden');

    let url = API_BASE;
    if (questionCount !== null) url += `?questionCount=${questionCount}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        let list = document.getElementById('rankingList');
        list.innerHTML = "";

        if (!data || data.length === 0) {
            list.innerHTML = "<li>ランキングはありません</li>";
            return;
        }
        data.forEach((entry, idx) => {
            let li = document.createElement('li');
            li.textContent = ` ${idx + 1}位: ${entry.name} - ${entry.score}点 (${entry.date})`;
            list.appendChild(li);
        });
    } catch (e) {
        alert('ランキング取得に失敗しました');
    }
}

// Excelダウンロード
document.getElementById('downloadExcelButton').addEventListener('click', function() {
    window.open(API_BASE + '/excel', '_blank');
});

// クイズ終了時の例
async function endQuiz() {
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('backButton').classList.remove('hidden');
    setTimeout(async () => {
        let userName = prompt("クイズ終了! 正解数: " + correctAnswers + " / " + totalQuestions + "\n名前を入力してください（ランキングに登録されます）:");
        if (!userName) userName = "名無し";
        await saveRankingAPI(userName, correctAnswers, totalQuestions);
        await showRankingAPI(totalQuestions);
        alert("結果が保存されました。");
    }, 100);
}