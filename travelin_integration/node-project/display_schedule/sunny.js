document.addEventListener("DOMContentLoaded", function () {
    let scheduleData = localStorage.getItem("generatedSchedule");

    if (!scheduleData) {
        console.error("スケジュールデータが見つかりません。");
        return;
    }

    try {
        scheduleData = JSON.parse(JSON.parse(scheduleData));
        const resultElement = document.getElementById("sunny");

        if (!scheduleData || !scheduleData.days) {
            console.error("スケジュールデータが不正です。");
            return;
        }

        let output = "";
        let ran = 0;

        for (let day of scheduleData.days) {
            if (day.weather === "sunny") {
                output += `<h2 class="day">${day.date}</h2>`;
                ran += 1000;

                for (let [i, schedule] of day.schedule.entries()) {
                    const timeId = `time_${ran}_${i}`;
                    const locationId = `location_${ran}_${i}`;
                    const activityId = `activity_${ran}_${i}`;
                    const urlId = `url_${ran}_${i}`;
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

        resultElement.innerHTML = output;
    } catch (error) {
        console.error("スケジュールデータのパースに失敗しました:", error);
    }
});
