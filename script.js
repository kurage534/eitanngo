async function loadRanking() {
  try {
    // fetch("/ranking") から fetch("static/ranking.json") に変更
    const res = await fetch("static/ranking.json");
    if (!res.ok) {
      throw new Error(`ランキングデータの取得に失敗しました: ${res.status}`);
    }
    const ranking = await res.json();
    const list = document.getElementById("ranking-list");
    list.innerHTML = "";
    ranking.forEach(r => {
      const li = document.createElement("li");
      li.innerText = `${r.username} - ${r.score}`;
      list.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    // 必要に応じてUIにエラーメッセージを表示
    // document.getElementById("ranking-list").innerText = "ランキングを取得できませんでした";
  }
}
