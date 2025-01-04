// DOMツリーが読み込まれた後に実行
document.addEventListener("DOMContentLoaded", function () {
    // ローカルストレージから "generatedSchedule" キーのデータを取得
    let scheduleData = localStorage.getItem("generatedSchedule");

    // スケジュールデータが存在しない場合
    if (!scheduleData) {
        console.error("スケジュールデータが見つかりません。");
        return;
    }

    try {
        // ローカルストレージに保存されているデータはJSONをさらにJSON.stringify()したものなので、
        // 二重で JSON.parse() する必要がある (JSON.parse(JSON.parse(scheduleData)) )
        scheduleData = JSON.parse(JSON.parse(scheduleData));

        // id="sunny" の要素を取得 (晴れ時用のスケジュールを表示するためのDOM)
        const resultElement = document.getElementById("sunny");
        if (!resultElement) {
            console.error("要素が見つかりません: id='sunny'");
            return;
        }

        // 最終的に晴れ時のスケジュールHTMLを格納する変数
        let output = "";
        // ユニークIDを生成するためのベース値
        let uniqueIdBase = 0;

        // scheduleData.days の配列をループし、各要素が "weather" = "sunny" の場合に表示
        for (let day of scheduleData.days) {
            if (day.weather === "sunny") {
                // 日付を見出しとして表示
                output += `<h2 class="day">${day.date}</h2>`;

                // uniqueIdBase を増やしていき、ID生成に利用（※重複回避用）
                uniqueIdBase += 1000;

                // day.scheduleに含まれる各活動情報を順に表示
                for (let [i, schedule] of day.schedule.entries()) {
                    // inputやtextareaにユニークなidを付与するために変数を作成
                    const timeId = `time_${uniqueIdBase}_${i}`;
                    const locationId = `location_${uniqueIdBase}_${i}`;
                    const activityId = `activity_${uniqueIdBase}_${i}`;
                    const urlId = `url_${uniqueIdBase}_${i}`;

                    // アクティビティをHTML構造として組み立て
                    // 各種labelとinput/textareaをペアにして、disabled状態（編集不可）で表示
                    // "公式サイトを見る" のリンクは schedule.url があればそちらに飛ばす。無ければ "#" を指定
                    output += `
                        <div class="schedule-item">
                            <label for="${timeId}" class="label">時間:</label>
                            <input id="${timeId}" class="input time" type="time" value="${schedule.time}" disabled />

                            <label for="${locationId}" class="label">場所:</label>
                            <input id="${locationId}" class="input location" value="${schedule.location}" disabled />

                            <label for="${activityId}" class="label">アクティビティ:</label>
                            <textarea id="${activityId}" class="input activity" disabled>${schedule.activity}</textarea>

                            <label for="${urlId}" class="label">URL:</label>
                            <input id="${urlId}" class="input url" value="${schedule.url || ""}" disabled />
                            <br />
                            <a href="${schedule.url || "#"}" target="_blank" class="link">公式サイトを見る</a>
                        </div>
                    `;
                }
            }
        }

        // 生成したHTMLを #sunny 要素に挿入
        resultElement.innerHTML = output;

    } catch (error) {
        console.error("スケジュールデータのパースに失敗しました:", error);
    }
});
