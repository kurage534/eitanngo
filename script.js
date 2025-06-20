// script.js

let words = [];

// CSVファイルを読み込む関数
async function loadCSV() {
    const response = await fetch('words.csv'); // CSVファイルのパス
    const data = await response.text();
    const rows = data.split('\n').slice(1); // ヘッダーを除く
    words = rows.map(row => {
        const [number, word, meaning] = row.split(',');
        return { number, word, meaning };
    });
}

// ランダムな単語を選んで表示する関数
function generateQuestion() {
    if (words.length === 0) return;
    const randomIndex = Math.floor(Math.random() * words.length);
    const selectedWord = words[randomIndex];
    document.getElementById('quiz').innerHTML = `<p>単語: ${selectedWord.word}</p><p>意味: ${selectedWord.meaning}</p>`;
}

// イベントリスナー
document.getElementById('generate').addEventListener('click', generateQuestion);

// 初期化
loadCSV();
