document.addEventListener("DOMContentLoaded", function () {
    let scheduleData = localStorage.getItem("generatedSchedule");

    if (!scheduleData) {
        console.error("スケジュールデータが見つかりません。");
        return;
    }

    try {
        scheduleData = JSON.parse(JSON.parse(scheduleData));
        const resultElement = document.getElementById("sunny");
        if (!resultElement) {
            console.error("要素が見つかりません: id='sunny'");
            return;
        }

        let output = "";
        let uniqueIdBase = 0;

        for (let day of scheduleData.days) {
            if (day.weather === "sunny") {
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
                            <input id="${timeId}" class="input time" type="time" value="${schedule.time}" disabled />

                            <label for="${locationId}" class="label">場所:</label>
                            <input id="${locationId}" class="input location" value="${schedule.location}" disabled />

                            <label for="${activityId}" class="label">アクティビティ:</label>
                            <textarea id="${activityId}" class="input activity" disabled>${schedule.activity}</textarea>

                            <label for="${urlId}" class="label">URL:</label>
                            <input id="${urlId}" class="input url" value="${schedule.url || ""}" disabled />
                            <a href="${schedule.url || "#"}" target="_blank" class="link">公式サイトを見る</a>
                        </div>
                    `;
                }
            }
        }

        resultElement.innerHTML = output;
    } catch (error) {
        console.error("スケジュールデータのパースに失敗しました:", error);
    }
});
