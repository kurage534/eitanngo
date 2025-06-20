// script.js

let words = [];

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

// ランダムな単語を選んで表示する関数
function generateQuestion() {
    const start = parseInt(document.getElementById('start').value);
    const end = parseInt(document.getElementById('end').value);

    // 指定された範囲の単語をフィルタリング
    const filteredWords = words.filter(word => word.number >= start && word.number <= end);
    
    if (filteredWords.length === 0) {
        document.getElementById('quiz').innerHTML = "<p>指定された範囲に単語がありません。</p>";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    const selectedWord = filteredWords[randomIndex];
    document.getElementById('quiz').innerHTML = `<p>単語: ${selectedWord.word}</p><p>意味: ${selectedWord.meaning}</p>`;
}

// イベントリスナー
document.getElementById('generate').addEventListener('click', generateQuestion);

// 初期化
loadCSV();
