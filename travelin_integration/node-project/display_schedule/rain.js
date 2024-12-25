document.addEventListener("DOMContentLoaded", function () {
    // LocalStorageから保存されたスケジュールデータを取得
    let scheduleData = localStorage.getItem("generatedSchedule");

    if (!scheduleData) {
        console.error("スケジュールデータが見つかりません。");
        return;
    }

    try {
        // JSONデータをパース
        scheduleData = JSON.parse(JSON.parse(scheduleData));

        // 雨用スケジュールを表示する要素を取得
        const resultElement = document.getElementById("rain");

        // スケジュールデータが正しい形式かを確認
        if (!scheduleData || !scheduleData.days) {
            console.error("スケジュールデータが不正です。");
            return;
        }

        let output = ""; // HTML出力用
        let ran = 0; // ユニークなIDを生成するための基数

        // 雨の日のみデータを抽出
        for (let day of scheduleData.days) {
            if (day.weather === "rainy") {
                output += `<h2 class="day">${day.date}</h2>`;
                ran += 1000;

                // 各スケジュールを生成
                for (let [i, schedule] of day.schedule.entries()) {
                    const timeId = `time_${ran}_${i}`;
                    const locationId = `location_${ran}_${i}`;
                    const activityId = `activity_${ran}_${i}`;
                    output += `
                        <div class="schedule-item">
                            <label for="${timeId}" class="label">時間:</label>
                            <input id="${timeId}" class="input time" value="${schedule.time}" />

                            <label for="${locationId}" class="label">場所:</label>
                            <input id="${locationId}" class="input location" value="${schedule.location}" />

                            <label for="${activityId}" class="label">アクティビティ:</label>
                            <textarea id="${activityId}" class="input activity">${schedule.activity}</textarea>
                        </div>
                    `;
                }
            }
        }

        // HTMLに反映
        resultElement.innerHTML = output;
    } catch (error) {
        console.error("スケジュールデータのパースに失敗しました:", error);
    }
});
