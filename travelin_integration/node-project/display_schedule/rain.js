// ページのDOMが読み込まれたら実行
document.addEventListener("DOMContentLoaded", function () {
    // ローカルストレージから "generatedSchedule" というキーで保存されているデータを取得
    let scheduleData = localStorage.getItem("generatedSchedule");

    // スケジュールデータが存在しない場合
    if (!scheduleData) {
        console.error("スケジュールデータが見つかりません。");
        return;
    }

    try {
        // 取得した文字列は、JSON文字列をさらにJSON.stringify()した2重の形式になっている想定
        // そのため JSON.parse() を2回行って、最終的にJavaScriptオブジェクトに戻す
        scheduleData = JSON.parse(JSON.parse(scheduleData));

        // id="rain" の要素を取得し、そこに雨天時のスケジュールを描画していく
        const resultElement = document.getElementById("rain");
        if (!resultElement) {
            console.error("要素が見つかりません: id='rain'");
            return;
        }

        // HTMLを組み立てるための変数
        let output = "";
        // ユニークIDを生成するためのベース値（重複しないようにする目的）
        let uniqueIdBase = 0;

        // スケジュールデータの days配列をループし、"weather" が "rainy" の日程だけ表示
        for (let day of scheduleData.days) {
            if (day.weather === "rainy") {
                // 日付（day.date）を見出しとして追加
                output += `<h2 class="day">${day.date}</h2>`;

                // IDの重複を避けるため、dayごとに uniqueIdBase を増やす
                uniqueIdBase += 1000;

                // day.schedule に含まれるアクティビティ情報を一つずつHTMLに変換
                for (let [i, schedule] of day.schedule.entries()) {
                    // 各inputやtextareaにユニークなIDを付与するためのID文字列を組み立て
                    const timeId = `time_${uniqueIdBase}_${i}`;
                    const locationId = `location_${uniqueIdBase}_${i}`;
                    const activityId = `activity_${uniqueIdBase}_${i}`;
                    const urlId = `url_${uniqueIdBase}_${i}`;

                    // HTML文字列を組み立て（時間、場所、アクティビティ、URLなど）
                    // disabled 属性を付与し、ユーザーが直接編集できないようにしている
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

        // 組み立てたHTML文字列を #rain 要素に書き込む
        resultElement.innerHTML = output;
    } catch (error) {
        console.error("スケジュールデータのパースに失敗しました:", error);
    }
});
