document.addEventListener("DOMContentLoaded", function () {
    let scheduleData = localStorage.getItem("generatedSchedule");

    if (!scheduleData) {
        console.error("スケジュールデータが見つかりません。");
        return;
    }

    try {
        // JSONデータのパース
        scheduleData = JSON.parse(JSON.parse(scheduleData));

        // HTML要素の取得
        const resultElement = document.getElementById("rain");
        if (!resultElement) {
            console.error("要素が見つかりません: id='rain'");
            return;
        }

        // データが適切か確認
        if (!scheduleData || !scheduleData.days) {
            console.error("スケジュールデータが不正です。");
            return;
        }

        let output = ""; // HTML出力用
        let uniqueIdBase = 0; // ユニークなIDを生成するための基数

        // 雨天スケジュールを生成
        for (let day of scheduleData.days) {
            if (day.weather === "rainy") {
                output += `<h2 class="day">${day.date}</h2>`;
                uniqueIdBase += 1000;

                for (let [i, schedule] of day.schedule.entries()) {
                    const timeId = `time_${uniqueIdBase}_${i}`;
                    const locationId = `location_${uniqueIdBase}_${i}`;
                    const activityId = `activity_${uniqueIdBase}_${i}`;
                    const urlId = `url_${uniqueIdBase}_${i}`;
                    output += `
                        <div class="schedule-item">
                            <label for="${timeId}" class="label">時間:</label>
                            <input id="${timeId}" class="input time" value="${schedule.time}" />

                            <label for="${locationId}" class="label">場所:</label>
                            <input id="${locationId}" class="input location" value="${schedule.location}" />

                            <label for="${activityId}" class="label">アクティビティ:</label>
                            <textarea id="${activityId}" class="input activity">${schedule.activity}</textarea>

                            <label for="${urlId}" class="label">URL:</label>
                            <input id="${urlId}" class="input url" value="${schedule.url || ""}" />
                            <a href="${schedule.url || "#"}" target="_blank" class="link">公式サイトを見る</a>
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
